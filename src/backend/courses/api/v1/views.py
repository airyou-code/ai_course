from courses.models import Module
from rest_framework import viewsets, permissions
from .serializers import ModuleSerializer
# from rest_framework.authentication import SessionAuthentication
from rest_framework_simplejwt.authentication import JWTAuthentication


class ModuleReadOnlyViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ModuleSerializer
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get_queryset(self):
        return Module.objects.prefetch_related('lesson_set')
