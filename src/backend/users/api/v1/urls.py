from rest_framework.routers import DefaultRouter
from django.urls import path, include
from users.api.v1 import views

router = DefaultRouter()

# Removing the automatic creation of the root path
router.include_root_view = False

router.register(r'profile', views.UserReadOnlyViewSet, basename='user-profile')
# router.register(r'progress', UpdateProgressView, basename='user-progress')

urlpatterns = [
    path('', include(router.urls)),
    path('get_tokens/', views.GetTokensAPIView.as_view(), name='get_tokens'),
    path('progress/update/', views.UpdateProgressView.as_view(), name='update-progress'),
    path('progress/lesson/<uuid:lesson_uuid>/', views.GetProgressAPIView.as_view(), name='get-progress'),
    path('email/register/request/', views.EmailRegistrationRequestView.as_view(), name='email_register_request'),
    path('email/register/', views.EmailRegistrationView.as_view(), name='email_register'),
]
