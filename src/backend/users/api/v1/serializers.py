from users.models import CourseUser
from rest_framework import serializers
from users.models import UserLessonProgress
from rest_framework_simplejwt.tokens import RefreshToken
from users import utils
from django.utils import timezone
from django.conf import settings
from django.utils.translation import gettext_lazy as _
from rest_framework.exceptions import ValidationError
from mail.tasks import send_verify_email_task
from mail.models import Mail
from users import enums


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseUser
        fields = [
            'id',
            'username',
            'email',
            'first_name',
            'last_name',
            'is_active',
            'date_joined'
        ]
        read_only_fields = [
            'id',
            'username',
            'email',
            'is_active',
            'date_joined'
        ]


class UserLessonProgressSerializer(serializers.ModelSerializer):
    last_seen_block_uuid = serializers.UUIDField(source='last_seen_block.uuid')

    class Meta:
        model = UserLessonProgress
        fields = ['last_seen_block_uuid']


class BlockUUIDSerializer(serializers.ModelSerializer):
    last_seen_block_uuid = serializers.UUIDField(source='last_seen_block.uuid', read_only=True)

    class Meta:
        model = UserLessonProgress
        fields = ['last_seen_block_uuid']


class EmailRegistrationRequestSerializer(serializers.Serializer):
    email = serializers.EmailField(write_only=True)

    def validate(self, attrs):
        user = CourseUser.objects.filter(
            email__iexact=attrs['email'].lower()
        ).first()
        if user:
            raise ValidationError(_('User already registered'))
        return attrs

    def create(self, validated_data):
        email_candidate = validated_data.get('email').lower()

        # Check if the email is already sent

        code = utils.generate_verification_code()
        utils.set_verification_code_for_registration(
            code, enums.UserSecurityCode.VERIFY_EMAIL,
            email_candidate
        )
        print(f"CODE: {code}")
        # send_verify_email_task(email=email_candidate, code=code)
        return validated_data


class EmailRegistration(serializers.ModelSerializer):
    code_candidate = serializers.CharField(write_only=True)
    email = serializers.EmailField(write_only=True, required=True)
    password = serializers.CharField(write_only=True)
    access = serializers.CharField(read_only=True, required=False)
    refresh = serializers.CharField(read_only=True, required=False)
    username = serializers.CharField(
        write_only=True, required=True,
    )
    first_name = serializers.CharField(
        write_only=True, required=False, allow_blank=True
    )
    last_name = serializers.CharField(
        write_only=True, required=False, allow_blank=True
    )

    def validate(self, attrs):
        password_candidate = attrs['password']
        utils.is_valid_password(password_candidate)
        return attrs

    def create(self, validated_data: dict) -> CourseUser:
        password_candidate = validated_data['password']
        code_candidate = validated_data.pop('code_candidate', None)

        if not code_candidate or not password_candidate:
            raise ValidationError('not_all_fields_are_filled_correctly')

        validated_data["email"] = utils.get_verification_code(
            code_candidate, enums.UserSecurityCode.VERIFY_EMAIL
        )

        if not validated_data["email"]:
            raise ValidationError(_('wrong_code'))

        user = CourseUser(**validated_data)
        user.set_password(password_candidate)
        try:
            user.save()
        except Exception:
            raise ValidationError(_('Registration error'))

        user.last_login = timezone.now()
        user.is_email_verified = True
        user.save()
        refresh = RefreshToken.for_user(user)

        return {
            'access': str(refresh.access_token),
            'refresh': str(refresh),
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
