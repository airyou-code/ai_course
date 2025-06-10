from payments.models import Product
from rest_framework import serializers


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = [
            'uuid',
            'name',
            'description',
            'price',
            'currency',
        ]
        read_only_fields = ['uuid']
