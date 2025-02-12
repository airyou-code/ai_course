from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import ChatMessageViewSet

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
]
