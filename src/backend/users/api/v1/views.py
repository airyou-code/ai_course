from users.models import CourseUser
from rest_framework import viewsets, permissions
from rest_framework import mixins       # я не знаю что я делаю:(
from .serializers import UserSerializer
# from rest_framework.authentication import SessionAuthentication
from rest_framework_simplejwt.authentication import JWTAuthentication


class UserViewSet(
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    viewsets.GenericViewSet
):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [
        JWTAuthentication,
        # SessionAuthentication
    ]

    def get_queryset(self):
        return CourseUser.objects.filter(id=self.request.user.id)
