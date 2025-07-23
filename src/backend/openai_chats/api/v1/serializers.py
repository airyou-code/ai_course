from rest_framework import serializers

from openai_chats.models import ChatMessage


class ChatMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatMessage
        fields = [
            "role",
            "content",
            "created_at",
        ]
        read_only_fields = ["content", "role", "created_at", "uuid"]
        create_only_fields = ["content"]
