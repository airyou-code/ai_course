from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import UserViewSet, UserRegistrViewSet

router = DefaultRouter()

# Removing the automatic creation of the root path
router.include_root_view = False

# router.register(r'profile', UserViewSet, basename='user-profile')


urlpatterns = [
    path("profile/", UserViewSet.as_view({"get": "retrieve", "patch": "update"}), name="profile"),
    path("profile/registration", UserRegistrViewSet.as_view({"post": "create"}), name="registration"),
]
