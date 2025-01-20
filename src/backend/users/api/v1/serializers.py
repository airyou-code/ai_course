from users.models import CourseUser
from rest_framework import serializers


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
