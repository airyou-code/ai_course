import os
from openai import OpenAI
from time import sleep
import requests
import logging
import json
import markdown
from django.conf import settings
from django.shortcuts import get_object_or_404
from django.db.models import Sum
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from django.http import StreamingHttpResponse, HttpResponseNotAllowed
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework.renderers import BaseRenderer
from rest_framework import views

from openai_chats.models import ContentBlock, ChatMessage, Chat, Option
from .serializers import ChatMessageSerializer

from drf_spectacular.utils import extend_schema

# Load the API key from .env (or from settings)
# client = OpenAI(
#   base_url=settings.OPENAI_URL,
#   api_key=settings.OPENAI_API_KEY,
# )

logger = logging.getLogger(__name__)


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


@extend_schema(exclude=True)
class OpenRouterStreamView(views.APIView):
    permission_classes = [IsAuthenticated]
    renderer_classes = [EventStreamRenderer]

    @method_decorator(csrf_exempt)
    def post(self, request, content_block_uuid=None):
        """
        POST: Stream data from OpenRouter API and save messages to the database.
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

        # --- 2. Build context for OpenAI ---
        conversation_queryset = ChatMessage.objects.filter(chat=user_chat).order_by(
            "created_at"
        )

        conversation: list = []
        if block.content_text:
            conversation.append(
                {"role": "system", "content": block.content_text}
            )
        for msg in conversation_queryset:
            if msg.content and msg.role != "system":
                conversation.append({"role": msg.role, "content": msg.content})

        conversation.append({"role": "user", "content": user_input})

        url = "https://openrouter.ai/api/v1/chat/completions"
        headers = {
            "Authorization": f"Bearer {settings.OPENAI_API_KEY}",
            "Content-Type": "application/json"
        }

        # get options parameters from
        option = Option.objects.all().first()
        if option:
            payload = {
                **option.parameters,
                "messages": conversation,
                "stream": True
            }
        else:
            payload = {
                "model": "qwen/qwen-vl-plus:free",
                # "model": "meta-llama/llama-3.3-70b-instruct:free",
                "messages": conversation,
                "max_tokens": 500,
                "top_p": 1,
                "temperature": 1,
                "frequency_penalty": 0,
                "presence_penalty": 0,
                "repetition_penalty": 1,
                "top_k": 0,
                "stream": True
            }

        def sse_stream():
            buffer = ""
            assistant_content = ""

            # делаем запрос один раз
            with requests.post(url, headers=headers, json=payload, stream=True) as resp:
                resp.encoding = 'utf-8'
                # если OpenRouter вернул не 200 — сразу отдаём JSON-ошибку и закрываем стрим
                if resp.status_code != 200:
                    err = {
                        "error": True,
                        "message": f"OpenRouter responded with status {resp.status_code}"
                    }
                    yield f"data: {json.dumps(err)}\n\n"
                    return

                for chunk in resp.iter_content(chunk_size=1024, decode_unicode=True):
                    buffer += chunk
                    while True:
                        line_end = buffer.find('\n')
                        if line_end == -1:
                            break

                        line = buffer[:line_end]
                        buffer = buffer[line_end + 1:]
                        if not line.startswith('data: '):
                            continue

                        data = line[6:].rstrip()
                        # конец потока
                        if data == '[DONE]':
                            done_msg = { "done": True }
                            yield f"data: {json.dumps(done_msg)}\n\n"
                            break

                        # парсим JSON-ответ от провайдера
                        try:
                            data_obj = json.loads(data)
                        except json.JSONDecodeError:
                            continue

                        # если провайдер сообщил об ошибке
                        if data_obj.get("error"):
                            err = {
                                "error": True,
                                "message": data_obj.get("error", "Provider returned error")
                            }
                            yield f"data: {json.dumps(err)}\n\n"
                            return

                        # нормальная часть ответа
                        choices = data_obj.get("choices")
                        if not choices:
                            err = {
                                "error": True,
                                "message": "Empty choices from provider"
                            }
                            yield f"data: {json.dumps(err)}\n\n"
                            return

                        content = choices[0]["delta"].get("content")
                        if content:
                            assistant_content += content
                            part = {
                                "error": False,
                                "content": content
                            }
                            yield f"data: {json.dumps(part)}\n\n"

            # после завершения стрима — логируем и сохраняем в базу
            logger.info(f"User input: {user_input}")
            logger.info(f"Assistant content: {assistant_content}")

            try:
                if block.content_text:
                    ChatMessage.objects.create(
                        chat=user_chat, role="system", content=block.content_text
                    )
                ChatMessage.objects.create(
                    chat=user_chat, role="user", content=user_input
                )
                logger.info("User message saved successfully.")
            except Exception as e:
                logger.error(f"Error saving user message: {e}")

            try:
                ChatMessage.objects.create(
                    chat=user_chat, role="assistant", content=assistant_content
                )
                logger.info("Assistant message saved successfully.")
            except Exception as e:
                logger.error(f"Error saving assistant message: {e}")

        response = StreamingHttpResponse(
            sse_stream(),
            content_type='text/event-stream'
        )
        response['Cache-Control'] = 'no-cache'
        response['X-Accel-Buffering'] = 'no'
        return response
