from users.models import CourseUser
from rest_framework import viewsets, permissions
from .serializers import UserSerializer
# from rest_framework.authentication import SessionAuthentication
from rest_framework_simplejwt.authentication import JWTAuthentication


class UserReadOnlyViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [
        JWTAuthentication,
        # SessionAuthentication
    ]

    def get_queryset(self):
        return CourseUser.objects.filter(id=self.request.user.id)
