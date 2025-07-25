import uuid

from django.conf import settings
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from rest_framework import serializers
from rest_framework.exceptions import Throttled, ValidationError
from rest_framework_simplejwt.tokens import RefreshToken

from courses.models import Lesson
from mail.models import Mail
from mail.tasks import send_password_reset_link_email_task, send_verify_email_task
from users import enums, utils
from users.models import CourseUser, UserLessonProgress, UserReview


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseUser
        fields = [
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "is_active",
            "is_has_full_access",
            "language",
            "date_joined",
        ]
        read_only_fields = [
            "id",
            "email",
            "is_active",
            "is_has_full_access",
            "date_joined",
        ]


class UserPasswordChangeSerializer(serializers.ModelSerializer):
    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        user = self.context["request"].user
        if not user.check_password(attrs["old_password"]):
            raise ValidationError(_("Old password is incorrect"))
        utils.is_valid_password(attrs["new_password"])
        return attrs

    def update(self, instance, validated_data):
        instance.set_password(validated_data["new_password"])
        instance.save()
        return instance

    class Meta:
        model = CourseUser
        fields = ["old_password", "new_password"]


class UserLessonProgressSerializer(serializers.ModelSerializer):
    last_seen_block_uuid = serializers.UUIDField(source="last_seen_block.uuid")

    class Meta:
        model = UserLessonProgress
        fields = ["last_seen_block_uuid"]


class BlockUUIDSerializer(serializers.ModelSerializer):
    last_seen_block_uuid = serializers.UUIDField(
        source="last_seen_block.uuid", read_only=True
    )

    class Meta:
        model = UserLessonProgress
        fields = ["last_seen_block_uuid"]


class EmailRegistrationRequestSerializer(serializers.Serializer):
    email = serializers.EmailField(write_only=True)

    def validate(self, attrs):
        user = CourseUser.objects.filter(email__iexact=attrs["email"].lower()).first()
        if user:
            raise ValidationError(_("User already registered"))
        return attrs

    def create(self, validated_data):
        email_candidate = validated_data.get("email").lower()

        # Check if the email is already sent

        is_mail_sended = Mail.objects.filter(
            email=email_candidate,
            is_send=True,
            created_at__gte=timezone.now() - timezone.timedelta(seconds=15),
        ).exists()

        if is_mail_sended:
            raise Throttled(detail=_("Email already sent"))

        code = utils.generate_verification_code()
        utils.set_verification_code_for_registration(
            code, enums.UserSecurityCode.VERIFY_EMAIL, email_candidate
        )
        if settings.FAKE_SEND_EMAIL:
            print(f"CODE: {code}")
        else:
            send_verify_email_task(email=email_candidate, code=code)
        return validated_data


class EmailChangeRequestSerializer(serializers.Serializer):
    email = serializers.EmailField(write_only=True)

    def validate(self, attrs):
        user = CourseUser.objects.filter(email__iexact=attrs["email"].lower()).first()
        if user:
            raise ValidationError(_("User already registered"))
        return attrs

    def create(self, validated_data):
        email_candidate = validated_data.get("email").lower()

        # Check if the email is already sent

        is_mail_sended = Mail.objects.filter(
            email=email_candidate,
            is_send=True,
            created_at__gte=timezone.now() - timezone.timedelta(seconds=15),
        ).exists()

        if is_mail_sended:
            raise Throttled(detail=_("Email already sent"))

        code = utils.generate_verification_code()
        utils.set_verification_code_for_registration(
            code, enums.UserSecurityCode.VERIFY_EMAIL, email_candidate
        )
        if settings.FAKE_SEND_EMAIL:
            print(f"CODE: {code}")
        else:
            send_verify_email_task.delay(email=email_candidate, code=code)
        return validated_data


class EmailChangeSerializer(serializers.Serializer):
    code_candidate = serializers.CharField(write_only=True)
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())

    def validate(self, attrs):
        code_candidate = attrs["code_candidate"]

        if not code_candidate:
            raise ValidationError("not_all_fields_are_filled_correctly")

        attrs["email"] = utils.get_verification_code(
            code_candidate, enums.UserSecurityCode.VERIFY_EMAIL
        )

        if not attrs["email"]:
            raise ValidationError(_("Wrong code"))

        return attrs

    def create(self, validated_data):
        user = validated_data.pop("user")
        user.email = validated_data["email"]
        user.save()
        return user


class EmailRegistration(serializers.ModelSerializer):
    code_candidate = serializers.CharField(write_only=True)
    email = serializers.EmailField(write_only=True, required=True)
    password = serializers.CharField(write_only=True)
    access = serializers.CharField(read_only=True, required=False)
    refresh = serializers.CharField(read_only=True, required=False)
    username = serializers.CharField(
        write_only=True,
        required=True,
    )
    first_name = serializers.CharField(
        write_only=True, required=False, allow_blank=True
    )
    last_name = serializers.CharField(write_only=True, required=False, allow_blank=True)

    def validate(self, attrs):
        password_candidate = attrs["password"]
        utils.is_valid_password(password_candidate)
        return attrs

    def create(self, validated_data: dict) -> CourseUser:
        password_candidate = validated_data["password"]
        code_candidate = validated_data.pop("code_candidate", None)

        if not code_candidate or not password_candidate:
            raise ValidationError("not_all_fields_are_filled_correctly")

        validated_data["email"] = utils.get_verification_code(
            code_candidate, enums.UserSecurityCode.VERIFY_EMAIL
        )

        if not validated_data["email"]:
            raise ValidationError(_("Wrong code"))

        user = CourseUser(**validated_data)
        user.set_password(password_candidate)
        try:
            user.save()
        except Exception:
            raise ValidationError(_("Registration error"))

        user.last_login = timezone.now()
        user.is_email_verified = True
        user.save()
        refresh = RefreshToken.for_user(user)

        return {
            "access": str(refresh.access_token),
            "refresh": str(refresh),
        }

    class Meta:
        model = CourseUser
        fields = (
            "code_candidate",
            "email",
            "password",
            "access",
            "refresh",
            "username",
            "first_name",
            "last_name",
        )


class UserReviewSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    lesson = serializers.UUIDField(required=True)

    class Meta:
        model = UserReview
        fields = [
            "user",
            "lesson",
            "text",
            "interesting",
            "useful",
            "created_at",
        ]
        read_only_fields = [
            "created_at",
        ]

    def create(self, validated_data):
        lesson_uuid = validated_data.pop("lesson")

        try:
            lesson = Lesson.objects.get(uuid=lesson_uuid)
        except Lesson.DoesNotExist:
            raise serializers.ValidationError(_("Invalid lesson uuid"))

        review = UserReview.objects.create(lesson=lesson, **validated_data)
        return review


class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField(write_only=True)

    def validate(self, attrs):
        user = CourseUser.objects.filter(email__iexact=attrs["email"].lower()).first()
        if not user:
            raise ValidationError(_("User with this email does not exist"))
        attrs["user"] = user
        return attrs

    def create(self, validated_data):
        user = validated_data["user"]
        # Генерируем токен (uuid4)
        token = str(uuid.uuid4())
        # Сохраняем токен в redis
        utils.set_verification_code(
            token, enums.UserSecurityCode.RESET_PASSWORD, str(user.uuid)
        )
        # Формируем ссылку
        reset_link = f"{settings.FRONTEND_URL}/reset-password/{token}"
        # Отправляем email
        if settings.FAKE_SEND_EMAIL:
            print("FAKE_SEND_EMAIL", settings.FAKE_SEND_EMAIL)
            print(f"RESET_LINK: {reset_link}")
        else:
            send_password_reset_link_email_task.delay(user.email, reset_link)
        return {"email": user.email}


class PasswordResetConfirmSerializer(serializers.Serializer):
    token = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        token = attrs["token"]
        new_password = attrs["new_password"]
        # Проверяем токен
        redis_user_uuid = utils.get_verification_code(
            token, enums.UserSecurityCode.RESET_PASSWORD
        )
        if not redis_user_uuid:
            raise ValidationError(_("Invalid or expired token"))

        utils.is_valid_password(new_password)
        attrs["user"] = CourseUser.objects.filter(uuid=redis_user_uuid).first()
        if not attrs["user"]:
            raise ValidationError(_("User not found"))
        return attrs

    def create(self, validated_data):
        user = validated_data["user"]
        new_password = validated_data["new_password"]
        token = validated_data["token"]
        # Меняем пароль
        user.set_password(new_password)
        user.save()
        # Удаляем токен
        utils.delete_used_code(token, enums.UserSecurityCode.RESET_PASSWORD)
        return user
