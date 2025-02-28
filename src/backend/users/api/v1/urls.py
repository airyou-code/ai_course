from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import UserReadOnlyViewSet, UpdateProgressView, GetProgressAPIView

router = DefaultRouter()

# Removing the automatic creation of the root path
router.include_root_view = False

router.register(r'profile', UserReadOnlyViewSet, basename='user-profile')
# router.register(r'progress', UpdateProgressView, basename='user-progress')

urlpatterns = [
    path('', include(router.urls)),
    path('progress/update/', UpdateProgressView.as_view(), name='update-progress'),
    path('progress/lesson/<uuid:lesson_uuid>/', GetProgressAPIView.as_view(), name='get-progress'),
]
