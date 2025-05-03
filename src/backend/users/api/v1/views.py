from django.utils.translation import gettext_lazy as _
from users.models import CourseUser
from rest_framework import viewsets, permissions, generics, status
from .serializers import UserSerializer, UserPasswordChangeSerializer, UserLessonProgressSerializer, BlockUUIDSerializer
from users.api.v1 import serializers
from courses.models import Lesson, ContentBlock
from rest_framework.authentication import SessionAuthentication
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.response import Response
from rest_framework.exceptions import Throttled
from users.models import UserLessonProgress

from django_ratelimit.decorators import ratelimit
from django.utils.decorators import method_decorator

from rest_framework_simplejwt.tokens import RefreshToken


class UserAPIView(generics.GenericAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [
        JWTAuthentication,
        SessionAuthentication
    ]

    def get(self, request, *args, **kwargs):
        user = request.user
        serializer = self.get_serializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def patch(self, request, *args, **kwargs):
        user = request.user
        serializer = self.get_serializer(user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)


class UserPasswordChangeAPIView(generics.UpdateAPIView):
    serializer_class = UserPasswordChangeSerializer
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [
        JWTAuthentication,
        SessionAuthentication
    ]

    def get_object(self):
        return self.request.user



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

    @method_decorator(ratelimit(key='ip', rate='1/15s', method='POST', block=False))
    def post(self, request, *args, **kwargs):
        # Если лимит достигнут, бросаем Throttled — DRF поймает его и отработает через exception_handler
        if getattr(request, 'limited', False):
            # raise Exception("LOL")
            raise Throttled(
                detail=_("Too many attempts to register. Try again in 30 sec.")
                # wait=60
            )
        # Иначе продолжаем обычную логику CreateAPIView.post()
        return super().post(request, *args, **kwargs)


class EmailRegistrationView(generics.CreateAPIView):
    serializer_class = serializers.EmailRegistration

    @method_decorator(ratelimit(key='ip', rate='1/15s', method='POST', block=False))
    def post(self, request, *args, **kwargs):
        # Если лимит достигнут, бросаем Throttled — DRF поймает его и отработает через exception_handler
        if getattr(request, 'limited', False):
            raise Throttled(
                detail=_("Too many attempts to register. Try again in 30 sec.")
                # wait=60
            )
        # Иначе продолжаем обычную логику CreateAPIView.post()
        return super().post(request, *args, **kwargs)


class UserEmailChangeRequestAPIView(generics.CreateAPIView):
    serializer_class = serializers.EmailChangeRequestSerializer
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [
        JWTAuthentication,
        SessionAuthentication
    ]


class UserEmailChangeAPIView(generics.CreateAPIView):
    serializer_class = serializers.EmailChangeSerializer
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [
        JWTAuthentication,
        SessionAuthentication
    ]
