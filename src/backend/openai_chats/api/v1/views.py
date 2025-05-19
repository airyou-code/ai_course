import asyncio
from asgiref.sync import sync_to_async
from openai import OpenAI
from time import sleep
import requests
import logging
import json
import markdown
from django.views import View
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


@extend_schema(exclude=True)
class ChatMessageViewSet(
    viewsets.GenericViewSet,
    viewsets.mixins.ListModelMixin,
    viewsets.mixins.CreateModelMixin,
):
    """
    ViewSet for managing chat messages within a ContentBlock.
    The path in urls.py will be:
      /api/content-blocks/<content_block_uuid>/messages/
    """

    serializer_class = ChatMessageSerializer

    permission_classes = [IsAuthenticated]

    def list(self, request, content_block_uuid=None):
        """
        GET: Returns all messages (user + assistant)
        for the specified content block.
        """
        block = get_object_or_404(
            ContentBlock, uuid=content_block_uuid, block_type="input_gpt"
        )
        user = request.user

        user_chat = Chat.objects.filter(
            user=user, content_block=block
        ).first()

        # Filter messages by the current user if you need to separate dialogs by users
        messages = ChatMessage.objects.filter(
            chat=user_chat
        ).order_by("created_at")

        # Convert content from Markdown to HTML
        messages_data = [
            {
                'content': markdown.markdown(message.content),
                'role': message.role,
                'created_at': message.created_at,
            }
            for message in messages
        ]

        return Response(messages_data, status=status.HTTP_200_OK)

    def create(self, request, content_block_uuid=None):
        """
        POST: Receives the user's message, sends a request to OpenAI,
        saves the assistant's response, and returns both messages.
        """
        block = get_object_or_404(
            ContentBlock, uuid=content_block_uuid, block_type="input_gpt"
        )
        user_input = request.data.get("content", "").strip()
        user = request.user

        if not user_input:
            return Response(
                {"detail": "Message content is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if len(user_input.split()) > settings.OPENAI_LIMIT_WORDS:
            return Response(
                {
                    "detail": f"Your message is too long. Please keep it under {settings.OPENAI_LIMIT_WORDS} words."
                },
                status=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            )

        user_chat, _ = Chat.objects.get_or_create(
            user=user, content_block=block
        )

        # --- 1. Check limits ---
        # The number of messages sent in this block:

        user_message_count: int = (
            ChatMessage.objects.filter(chat=user_chat).count()
        )

        if user_message_count >= settings.OPENAI_LIMIT_MESSAGES:
            return Response(
                {
                    "detail": f"You have reached the limit of messages ({settings.OPENAI_LIMIT_MESSAGES}) for this content block."
                },
                status=status.HTTP_429_TOO_MANY_REQUESTS,
            )

        # --- 2. Build context for OpenAI (take all previous messages) ---
        # If desired, take only the last n messages
        conversation_queryset = ChatMessage.objects.filter(chat=user_chat).order_by(
            "created_at"
        )

        conversation = []
        for msg in conversation_queryset:
            conversation.append({"role": msg.role, "content": msg.content})

        conversation.append({"role": "user", "content": user_input})

        # --- 3. Request OpenAI/OpenRouter ---
        try:
            # completion = client.chat.completions.create(
            #     model="deepseek/deepseek-r1:free",
            #     messages=conversation,
            # )
            if False:
                response = requests.post(
                    url="https://openrouter.ai/api/v1/chat/completions",
                    headers={
                        "Authorization": f"Bearer {settings.OPENAI_API_KEY}",
                    },
                    data=json.dumps({
                        "model": "deepseek/deepseek-r1:free",
                        "messages": conversation
                    })
                )
                if response.status_code != 200:
                    return Response({"detail": "OpenAI/OpenRouter error"}, status=response.status_code)
                completion = response.json()
                assistant_content = completion.get("choices", [{}])[0].get("message", {}).get("content", "").strip()
            else:
                sleep(3)
                assistant_content =  "Я могу помочь с широким спектром задач! Вот основные направления:\n\n### 1. **Поиск и обработка информации**  \n   — Анализ данных, статистика, фактчекинг.  \n   — Объяснение сложных концепций (науки, техники, искусства и т.д.).  \n\nЕсли у тебя есть конкретная задача — просто опиши её, и я постараюсь помочь максимально эффективно 😊".strip()
        except Exception as e:
            # If something went wrong (for example, a network or API issue)
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        # --- 4. Save the user's message ---
        user_msg: ChatMessage = ChatMessage.objects.create(
            chat=user_chat, role="user", content=user_input
        )

        # --- 5. Save the assistant's response ---
        assistant_msg = ChatMessage.objects.create(
            chat=user_chat, role="assistant", content=assistant_content
        )

        # --- 6. Return both messages ---
        data = {
            "user_message": ChatMessageSerializer(user_msg).data,
            "assistant_message": ChatMessageSerializer(assistant_msg).data,
        }
        return Response(data, status=status.HTTP_201_CREATED)

class EventStreamRenderer(BaseRenderer):
    media_type = 'text/event-stream'
    format = None

    def render(self, data, media_type=None, renderer_context=None):
        return data


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
        # 3) Парсим JSON-тело
        try:
            body = request.body
            payload = json.loads(body)
            user_input = payload.get("content", "").strip()
        except json.JSONDecodeError:
            return JsonResponse({"detail": "Invalid JSON payload."}, status=400)

        # 4) Валидация
        if not user_input:
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
            return JsonResponse({"detail": "Not found."}, status=404)

        # 6) Получаем или создаём Chat
        user = request.user
        qs = Chat.objects.filter(user=user, content_block=block)
        if await qs.aexists():
            user_chat = await qs.afirst()
        else:
            user_chat = await Chat.objects.acreate(user=user, content_block=block)

        # 7) Проверяем лимит сообщений
        count = await ChatMessage.objects.filter(chat=user_chat).acount()
        if count >= settings.OPENAI_LIMIT_MESSAGES:
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
                yield f"data: {json.dumps({'error': True, 'message': str(e)})}\n\n"
                return

            # конец стрима
            yield f"data: {json.dumps({'done': True})}\n\n"

            # сохраняем в БД
            if global_prompt:
                await ChatMessage.objects.acreate(
                    chat=user_chat, role="system", content=global_prompt
                )
            if lesson_prompt:
                await ChatMessage.objects.acreate(
                    chat=user_chat, role="developer", content=lesson_prompt
                )
            await ChatMessage.objects.acreate(
                chat=user_chat, role="user", content=user_input
            )
            await ChatMessage.objects.acreate(
                chat=user_chat, role="assistant", content=assistant_content
            )

        # 12) Возвращаем StreamingHttpResponse
        response = StreamingHttpResponse(
            event_stream(),
            content_type="text/event-stream"
        )
        response["Cache-Control"] = "no-cache"
        response["X-Accel-Buffering"] = "no"
        return response
