from django.urls import path, include
from users.api.v1 import views

urlpatterns = [
    path('profile/', views.UserAPIView.as_view(), name='user-profile'),
    path('profile/password/change/', views.UserPasswordChangeAPIView.as_view(), name='user-password-change'),
    # path('get_tokens/', views.GetTokensAPIView.as_view(), name='get_tokens'),
    path('progress/update/', views.UpdateProgressView.as_view(), name='update-progress'),
    path('progress/lesson/<uuid:lesson_uuid>/', views.GetProgressAPIView.as_view(), name='get-progress'),
    path('email/register/request/', views.EmailRegistrationRequestView.as_view(), name='email_register_request'),
    path('email/register/', views.EmailRegistrationView.as_view(), name='email_register'),
    path('email/change/request/', views.UserEmailChangeRequestAPIView.as_view(), name='email_change_request'),
    path('email/change/', views.UserEmailChangeAPIView.as_view(), name='email_change'),
]
