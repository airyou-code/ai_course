from django.contrib import admin
from django.db import models
from core.widgets import JSONEditorWidget
from .models import Chat, ChatMessage, Option

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


@admin.register(Option)
class OptionAdmin(admin.ModelAdmin):
    list_display = ("id",)

    formfield_overrides = {
        models.JSONField: {
            "widget": JSONEditorWidget(
                attrs={"style": "margin-bottom:30px;height:350px;width:100%;"}
            )
        },
    }
