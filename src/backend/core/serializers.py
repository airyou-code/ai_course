from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers


class CoreSerializer(serializers.ModelSerializer):
    pass


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Custom serializer that ensures token payload
    is tied to the user's primary key, not email.
    """
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Add any extra claims if нужно
        token['user_id'] = user.id
        # Не включаем email в обязательные для проверки поля
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        # Возвращаем e-mail отдельно, если он нужен на фронте
        data['email'] = self.user.email
        return data