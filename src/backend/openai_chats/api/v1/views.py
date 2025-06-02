import asyncio
from asgiref.sync import sync_to_async
from openai import OpenAI
from time import sleep
import requests
import logging
import json
import markdown
from django.views import View
from rest_framework.status import HTTP_429_TOO_MANY_REQUESTS
from django.utils.translation import gettext_lazy as _
from django.core.cache import cache
from django.conf import settings
from django.shortcuts import get_object_or_404
from django.db.models import Sum
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.http import StreamingHttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework.renderers import BaseRenderer
from rest_framework import views
from rest_framework_simplejwt.authentication import JWTAuthentication

from openai_chats.models import ChatMessage, Chat, Option
from courses.models import Lesson, ContentBlock
from .serializers import ChatMessageSerializer

from drf_spectacular.utils import extend_schema

# Load the API key from .env (or from settings)
# client = OpenAI(
#   base_url=settings.OPENAI_URL,
#   api_key=settings.OPENAI_API_KEY,
# )

logger = logging.getLogger(__name__)
client = OpenAI(
    api_key=settings.OPENAI_API_KEY
)




@method_decorator(csrf_exempt, name="dispatch")
class LLMTokensReStreamView(View):
    """
    POST: Async stream data from OpenAI ChatCompletion API and save messages to the database.
    """

    async def dispatch(self, request, *args, **kwargs):
        # 1) Аутентификация через JWT
        jwt_auth = JWTAuthentication()
        try:
            auth_result = await sync_to_async(jwt_auth.authenticate)(request)
        except Exception:
            return JsonResponse(
                {"detail": "Invalid token."}, status=401
            )
        if auth_result is None:
            return JsonResponse(
                {"detail": "Authentication credentials were not provided or invalid."},
                status=401
            )
        request.user, request.auth = auth_result

        # 2) Передаём управление дальше
        return await super().dispatch(request, *args, **kwargs)

    async def post(self, request, content_block_uuid=None):
        user = request.user
        cache_key = f"{user.uuid}_use_stream"
        is_use_stream: bool = await cache.aget(
            key=cache_key, default=False
        )
        if not is_use_stream:
            await cache.aset(cache_key, True, timeout=5)  # 5 секунд
        else:
            return JsonResponse(
                {"detail": _("You are already using the stream.")},
                status=HTTP_429_TOO_MANY_REQUESTS
            )

        # 3) Парсим JSON-тело
        try:
            body = request.body
            payload = json.loads(body)
            user_input = payload.get("content", "").strip()
        except json.JSONDecodeError:
            await cache.adelete(cache_key)
            return JsonResponse({"detail": "Invalid JSON payload."}, status=400)

        # 4) Валидация
        if not user_input:
            await cache.adelete(cache_key)
            return JsonResponse({"detail": "Message content is required."}, status=400)
        if len(user_input.split()) > settings.OPENAI_LIMIT_WORDS:
            return JsonResponse(
                {"detail": f"Your message is too long. Please keep it under {settings.OPENAI_LIMIT_WORDS} words."},
                status=413
            )

        # 5) Получаем ContentBlock или 404
        try:
            block = await ContentBlock.objects.select_related("lesson").aget(
                uuid=content_block_uuid, block_type="input_gpt"
            )
        except ContentBlock.DoesNotExist:
            await cache.adelete(cache_key)
            return JsonResponse({"detail": "Not found."}, status=404)

        # 6) Получаем или создаём Chat
        qs = Chat.objects.filter(user=user, content_block=block)
        if await qs.aexists():
            user_chat = await qs.afirst()
        else:
            user_chat = await Chat.objects.acreate(user=user, content_block=block)

        # 7) Проверяем лимит сообщений
        count = await ChatMessage.objects.filter(chat=user_chat).acount()
        if count >= settings.OPENAI_LIMIT_MESSAGES:
            await cache.adelete(cache_key)
            return JsonResponse(
                {"detail": f"You have reached the limit of messages ({settings.OPENAI_LIMIT_MESSAGES})."},
                status=429
            )

        # 8) Строим контекст переписки
        conversation = []
        lesson: Lesson = block.lesson
        global_prompt: str = await Option.aget_global_prompt()
        lesson_prompt: str = await lesson.aget_prompt(user=user)
        if global_prompt:
            conversation.append({"role": "system", "content": global_prompt})
        if lesson_prompt:
            conversation.append({"role": "developer", "content": lesson_prompt})
        async for msg in ChatMessage.objects.filter(chat=user_chat).order_by("created_at"):
            if msg.content and msg.role != "system":
                conversation.append({"role": msg.role, "content": msg.content})
        conversation.append({"role": "user", "content": user_input})

        # 9) Параметры для OpenAI
        params = await Option.aget_params()
        params.update({"messages": conversation, "stream": True})

        # 10) Асинхронный SSE-генератор
        async def event_stream():
            assistant_content = ""
            chunk_iter = client.chat.completions.create(**params)

            async def get_next_chunk():
                """
                Попытаться получить следующий элемент из синхронного генератора chunk_iter
                в ThreadPool, вернуть None, если он исчерпан.
                """
                def _next():
                    try:
                        return next(chunk_iter)
                    except StopIteration:
                        return None

                return await asyncio.to_thread(_next)

            try:
                while True:
                    chunk = await get_next_chunk()
                    if chunk is None:
                        break

                    content = getattr(chunk.choices[0].delta, "content", None)
                    if content:
                        assistant_content += content
                        part = {"error": False, "content": content}
                        yield f"data: {json.dumps(part)}\n\n"
            except Exception as e:
                await cache.adelete(cache_key)
                yield f"data: {json.dumps({'error': True, 'message': str(e)})}\n\n"
                return

            # конец стрима
            yield f"data: {json.dumps({'done': True})}\n\n"

            # сохраняем в БД
            if global_prompt:
                await ChatMessage.objects.acreate(
                    chat=user_chat, role="system", content=global_prompt, model_used=params.get("model", "")
                )
            if lesson_prompt:
                await ChatMessage.objects.acreate(
                    chat=user_chat, role="developer", content=lesson_prompt, model_used=params.get("model", "")
                )
            await ChatMessage.objects.acreate(
                chat=user_chat, role="user", content=user_input, model_used=params.get("model", "")
            )
            await ChatMessage.objects.acreate(
                chat=user_chat, role="assistant", content=assistant_content, model_used=params.get("model", "")
            )
            await cache.adelete(cache_key)

        # 12) Возвращаем StreamingHttpResponse
        response = StreamingHttpResponse(
            event_stream(),
            content_type="text/event-stream"
        )
        response["Cache-Control"] = "no-cache"
        response["X-Accel-Buffering"] = "no"
        return response
