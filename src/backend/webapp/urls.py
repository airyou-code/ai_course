"""webapp URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

# from debug_toolbar.toolbar import debug_toolbar_urls
from django.contrib import admin
from django.urls import include, path
from django.views.generic import TemplateView

from .view import healthcheck

# from django.conf.urls.i18n import i18n_patterns

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("api.urls")),
    path("auth/", include("social_django.urls", namespace="social")),
    path(
        "robots.txt",
        TemplateView.as_view(
            template_name="robots/robots.txt", content_type="text/plain"
        ),
    ),
    path("live/healthcheck/", healthcheck),
    # path("live/healthcheck/migrations/", healthcheck_migrations),
]

# if settings.DEBUG:
#     urlpatterns = [
#         *urlpatterns,
#     ] + debug_toolbar_urls()
