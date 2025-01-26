from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import ModuleReadOnlyViewSet, LessonContentBlocksViewSet

router = DefaultRouter()

# Removing the automatic creation of the root path
router.include_root_view = False

router.register(r'modules', ModuleReadOnlyViewSet, basename='module')
router.register(
    r'courses/(?P<course_id>\d+)/modules/(?P<module_id>\d+)/lessons/(?P<lesson_id>\d+)/content-blocks', LessonContentBlocksViewSet, basename='lesson-content-blocks')

urlpatterns = [
    path('', include(router.urls)),
]
