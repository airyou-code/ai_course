from rest_framework.viewsets import ModelViewSet
from django_filters.rest_framework import DjangoFilterBackend
from .filters import TaskFilter
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import (JWTAuthentication,)
from rest_framework.authentication import (
    SessionAuthentication, BasicAuthentication,
)

from .serializers import TaskSerializer
from .models import Task


class TaskPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100


class TaskAPIView(ModelViewSet):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication, SessionAuthentication]

    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    filter_backends = [DjangoFilterBackend]
    pagination_class = TaskPagination
    filterset_class = TaskFilter

    def get_queryset(self):
        user = self.request.user
        if user.is_anonymous:
            return Task.objects.none()
        return Task.objects.filter(user=user)
