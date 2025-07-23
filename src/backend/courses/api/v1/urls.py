from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    GroupReadOnlyViewSet,
    LessonContentBlocksViewSet,
    LessonNextContentBlocksViewSet,
)

router = DefaultRouter()

# Removing the automatic creation of the root path
router.include_root_view = False

router.register(r"modules", GroupReadOnlyViewSet, basename="module")
router.register(
    r"lessons/(?P<lesson_uuid>[0-9a-f-]{36})/content-blocks",
    LessonContentBlocksViewSet,
    basename="lesson-content-blocks",
)
router.register(
    r"lessons/(?P<lesson_uuid>[0-9a-f-]{36})/next-blocks",
    LessonNextContentBlocksViewSet,
    basename="lesson-next-blocks",
)

urlpatterns = [
    path("", include(router.urls)),
]
