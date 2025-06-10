from rest_framework.routers import DefaultRouter
from django.urls import path, include, re_path
from .views import LLMTokensReStreamView

# Removing the automatic creation of the root path

urlpatterns = [
    re_path(r'content-blocks/(?P<content_block_uuid>[0-9a-f-]{36})/ai-chat/stream', LLMTokensReStreamView.as_view(), name='openrouter_stream'),
]
