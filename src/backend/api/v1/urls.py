from django.urls import include, path
from drf_spectacular.views import SpectacularRedocView, SpectacularSwaggerView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from core.views import healthcheck, healthcheck_migrations

from ..views import CustomSpectacularAPIView

app_name = "v1"

urlpatterns = [
    path("", include("users.api.v1.urls")),
    path("", include("courses.api.v1.urls")),
    path("", include("openai_chats.api.v1.urls")),
    path("payments/", include("payments.api.v1.urls")),
    path("token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path(
        "", SpectacularSwaggerView.as_view(url_name="api:v1:schema"), name="swagger-ui"
    ),
    path(
        "redoc/", SpectacularRedocView.as_view(url_name="api:v1:schema"), name="redoc"
    ),
    path("schema/", CustomSpectacularAPIView.as_view(api_version="v1"), name="schema"),
    path("live/healthcheck/", healthcheck),
    path("live/healthcheck/migrations/", healthcheck_migrations),
]
