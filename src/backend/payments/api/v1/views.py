from django.utils.translation import gettext_lazy as _
from rest_framework import permissions, generics, status
from rest_framework.authentication import SessionAuthentication
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.response import Response
from payments.api.v1.serializers import ProductSerializer
from payments.models import CloudPaymentOptions


class CloudPaymentOptionsAPIView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [
        JWTAuthentication,
        SessionAuthentication
    ]

    def get(self, request, *args, **kwargs):
        user = request.user
        options = CloudPaymentOptions.objects.all().first()
        if not options:
            return Response(
                {"detail": _("No payment options available.")},
                status=status.HTTP_404_NOT_FOUND
            )
        product = options.get_product()
        if not product:
            return Response(
                {"detail": _("No product available for payment options.")},
                status=status.HTTP_404_NOT_FOUND
            )
        params: dict = options.get_params()
        params = {
            **params,
            "description": product.description,
            "amount": product.price,
            "currency": product.currency,
            "invoiceId": str(product.uuid),
            "accountId": user.uuid,
            "email": user.email,
            "language": "ru-RU",
        }
        return Response(params, status=status.HTTP_200_OK)


class ProductAPIView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ProductSerializer
    authentication_classes = [
        JWTAuthentication,
        SessionAuthentication
    ]

    def get(self, request, *args, **kwargs):
        options = CloudPaymentOptions.objects.all().first()
        if not options:
            return Response(
                {"detail": _("No payment options available.")},
                status=status.HTTP_404_NOT_FOUND
            )
        product = options.get_product()
        if not product:
            return Response(
                {"detail": _("No product available for payment options.")},
                status=status.HTTP_404_NOT_FOUND
            )
        serializer = self.get_serializer(product)
        return Response(serializer.data, status=status.HTTP_200_OK)