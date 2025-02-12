from django.contrib import admin
from .models import Chat, ChatMessage

class ChatMessageInline(admin.TabularInline):
    model = ChatMessage
    fields = ("role", "content", "created_at")
    readonly_fields = ("role", "content", "created_at",)
    extra = 0

@admin.register(Chat)
class ChatAdmin(admin.ModelAdmin):
    list_display = ("content_block", "user", "created_at")
    list_filter = ("user", "created_at")
    search_fields = ("user__username", "content_block__uuid")
    readonly_fields = ("content_block", "user", "created_at")
    inlines = [ChatMessageInline]
    date_hierarchy = "created_at"
    ordering = ("-created_at",)

@admin.register(ChatMessage)
class ChatMessageAdmin(admin.ModelAdmin):
    list_display = ("id", "chat", "role", "short_content", "created_at")
    list_filter = ("role", "chat__user", "created_at")
    search_fields = ("chat__user__username", "content")
    date_hierarchy = "created_at"
    ordering = ("-created_at",)

    def short_content(self, obj):
        return obj.content[:50] + ("..." if len(obj.content) > 50 else "")
    short_content.short_description = "Content"
