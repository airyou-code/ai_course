from django.shortcuts import get_object_or_404
from openai_chats.models import ContentBlock, ChatMessage, Chat
import markdown


def get_chat_messages(user, input_block_uuid) -> list:
    input_block = get_object_or_404(
        ContentBlock, uuid=input_block_uuid, block_type="input_gpt"
    )

    user_chat = Chat.objects.filter(
        user=user, content_block=input_block
    ).first()

    # Filter messages by the current user if you need to separate dialogs by users
    messages = ChatMessage.objects.filter(
        chat=user_chat
    ).order_by("created_at")

    # Convert content from Markdown to HTML
    messages_data: list = [
        {
            'content': markdown.markdown(message.content),
            'type': "input_dialog" if message.role == "user" else "output_dialog",
        }
        for message in messages
    ]

    return messages_data