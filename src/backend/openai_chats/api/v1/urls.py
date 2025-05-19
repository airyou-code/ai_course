from rest_framework.routers import DefaultRouter
from django.urls import path, include, re_path
from .views import ChatMessageViewSet, LLMTokensReStreamView

router = DefaultRouter()

# Removing the automatic creation of the root path
router.include_root_view = False

router.register(
    r'content-blocks/(?P<content_block_uuid>[0-9a-f-]{36})/ai-chat/messages',
    ChatMessageViewSet,
    basename='chat-messages'
)

urlpatterns = [
    path('', include(router.urls)),
    re_path(r'content-blocks/(?P<content_block_uuid>[0-9a-f-]{36})/ai-chat/stream', LLMTokensReStreamView.as_view(), name='openrouter_stream'),
]
