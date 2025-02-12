import os
from openai import OpenAI
from time import sleep
import requests
import json
import markdown
from django.conf import settings
from django.shortcuts import get_object_or_404
from django.db.models import Sum
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated

from openai_chats.models import ContentBlock, ChatMessage, Chat
from .serializers import ChatMessageSerializer

# Load the API key from .env (or from settings)
# client = OpenAI(
#   base_url=settings.OPENAI_URL,
#   api_key=settings.OPENAI_API_KEY,
# )


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
