from rest_framework import serializers

from payments.models import Product


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = [
            "uuid",
            "name",
            "description",
            "price",
            "currency",
        ]
        read_only_fields = ["uuid"]
