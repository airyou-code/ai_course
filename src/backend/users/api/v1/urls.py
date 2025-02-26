from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import UserViewSet     

router = DefaultRouter()

# Removing the automatic creation of the root path
router.include_root_view = False

router.register(r'profile', UserViewSet, basename='user-profile')

urlpatterns = [
    path('', include(router.urls)),
]
