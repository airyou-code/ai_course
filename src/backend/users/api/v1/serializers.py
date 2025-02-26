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
        
        # Fields that dont change
        read_only_fields = [
            'id',
            'is_active',
            'date_joined'
        ]
        
class UserRegistrSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseUser
        fields = [
            'username',
            'password',
            'email',
            'first_name',
            'last_name',
        ]
