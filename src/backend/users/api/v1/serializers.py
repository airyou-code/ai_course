from users.models import CourseUser
from rest_framework import serializers
from users.models import UserLessonProgress


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