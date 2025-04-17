from users.models import CourseUser
from rest_framework import viewsets, permissions, generics, status
from .serializers import UserSerializer, UserLessonProgressSerializer, BlockUUIDSerializer
from users.api.v1 import serializers
from courses.models import Lesson, ContentBlock
from rest_framework.authentication import SessionAuthentication
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.response import Response
from users.models import UserLessonProgress

from rest_framework_simplejwt.tokens import RefreshToken


class UserReadOnlyViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [
        JWTAuthentication,
        # SessionAuthentication
    ]

    def get_queryset(self):
        return CourseUser.objects.filter(id=self.request.user.id)


class UpdateProgressView(generics.UpdateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    queryset = UserLessonProgress.objects.all()
    serializer_class = UserLessonProgressSerializer

    def update(self, request, *args, **kwargs):
        block_uuid = request.data.get('last_seen_block_uuid')
        content_block = ContentBlock.objects.filter(uuid=block_uuid).first()

        UserLessonProgress.objects.update_or_create(
            user=request.user, lesson=content_block.lesson,
            defaults={'last_seen_block': content_block}
        )
        return Response(status=status.HTTP_200_OK)


class GetProgressAPIView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = BlockUUIDSerializer

    def get(self, request, lesson_uuid, *args, **kwargs):
        try:
            lesson = Lesson.objects.get(uuid=lesson_uuid)
        except Lesson.DoesNotExist:
            return Response({"error": "Lesson not found."}, status=status.HTTP_404_NOT_FOUND)

        progress = UserLessonProgress.objects.filter(user=request.user, lesson=lesson).first()
        if not progress or not progress.last_seen_block:
            return Response({"error": "Progress not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = self.get_serializer(progress)
        return Response(serializer.data, status=status.HTTP_200_OK)


class GetTokensAPIView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [SessionAuthentication]

    def get(self, request, *args, **kwargs):
        user = request.user
        refresh = RefreshToken.for_user(user)

        return Response({
            'access_token': str(refresh.access_token),
            'refresh_token': str(refresh),
        })


class EmailRegistrationRequestView(generics.CreateAPIView):
    serializer_class = serializers.EmailRegistrationRequestSerializer


class EmailRegistrationView(generics.CreateAPIView):
    serializer_class = serializers.EmailRegistration
