from django.db import models
from django.conf import settings
from courses.models import ContentBlock
from django.core.cache import cache,  caches

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
        ("developer", "Developer"),
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
    CACHE_GLOBAL_PROMPT_KEY = "chat_global_prompt"

    parameters = models.JSONField(default=dict, blank=True)
    global_prompt = models.TextField(
        blank=True,
        null=True,
        help_text="Global prompt for the chat. This will be used as a system message.",
    )

    def save(self, *args, **kwargs):
        cache.delete(self.CACHE_KEY)
        cache.delete(self.CACHE_GLOBAL_PROMPT_KEY)
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

    @classmethod
    def get_global_prompt(cls):
        """Get global prompt."""
        cache_key = cls.CACHE_GLOBAL_PROMPT_KEY
        global_prompt: str = cache.get(cache_key)
        if global_prompt is None:
            option = cls.objects.first()
            if option:
                global_prompt = option.global_prompt
            else:
                global_prompt = ""
            cache.set(cache_key, global_prompt)
        return global_prompt

    @classmethod
    async def aget_params(cls, default=None):
        """Asynchronously get default options, using cache and DB."""
        cache_key = cls.CACHE_KEY

        # пытаемся достать из кэша
        params = await cache.aget(cache_key)
        if params is None:
            # пытаемся достать из кэша
            option = await cls.objects.afirst()
            if option:
                params = option.parameters
            else:
                params = default or {}
            cache.aset(cache_key, params)
        return params

    @classmethod
    async def aget_global_prompt(cls):
        """Asynchronously get global prompt, using cache and DB."""
        cache_key = cls.CACHE_GLOBAL_PROMPT_KEY

        # пытаемся достать из кэша
        global_prompt = await cache.aget(cache_key)
        if global_prompt is None:
            # пытаемся достать из кэша
            option = await cls.objects.afirst()
            if option:
                global_prompt = option.global_prompt
            else:
                global_prompt = ""
            cache.aset(cache_key, global_prompt)
        return global_prompt
