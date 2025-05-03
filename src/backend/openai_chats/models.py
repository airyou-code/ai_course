from django.db import models
from django.conf import settings
from courses.models import ContentBlock
from django.core.cache import cache

class Chat(models.Model):
    """This model stores chats."""

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="chats")
    content_block = models.ForeignKey(
        ContentBlock, on_delete=models.CASCADE, related_name="chats"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} | {self.content_block.title}"


class ChatMessage(models.Model):
    """This model stores messages in a chat."""

    ROLE_CHOICES = [
        ("user", "User"),
        ("assistant", "Assistant"),
        ("system", "System"),
    ]

    chat = models.ForeignKey(Chat, on_delete=models.CASCADE, related_name="messages")
    role = models.CharField(max_length=50, choices=ROLE_CHOICES)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.get_role_display()} | {self.content[:30]}"


class Option(models.Model):
    """This model stores options for a chat message."""

    CACHE_KEY = "chat_options"

    parameters = models.JSONField(default=dict, blank=True)

    def save(self, *args, **kwargs):
        cache.delete(self.CACHE_KEY)
        super().save(*args, **kwargs)

    @classmethod
    def get_params(cls, default=None):
        """Get default options."""
        cache_key = cls.CACHE_KEY
        params: dict = cache.get(cache_key)
        if params is None:
            option = cls.objects.first()
            if option:
                params = option.parameters
            else:
                params = default or {}
            cache.set(cache_key, params)
        return params
