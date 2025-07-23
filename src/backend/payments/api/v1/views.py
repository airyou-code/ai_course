import base64
import hashlib
import hmac
from decimal import Decimal

import requests
from django.conf import settings
from django.contrib.auth import get_user_model
from django.utils.decorators import method_decorator
from django.utils.translation import gettext_lazy as _
from django.views.decorators.csrf import csrf_exempt
from rest_framework import generics, permissions, status
from rest_framework.authentication import SessionAuthentication
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication

from payments.api.v1.serializers import ProductSerializer
from payments.models import CloudPaymentOptions, CloudPaymentTransaction, Product

User = get_user_model()


class CloudPaymentOptionsAPIView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [JWTAuthentication, SessionAuthentication]

    def get(self, request, *args, **kwargs):
        user = request.user
        options = CloudPaymentOptions.objects.all().first()
        if not options:
            return Response(
                {"detail": _("No payment options available.")},
                status=status.HTTP_404_NOT_FOUND,
            )
        product = options.get_product()
        if not product:
            return Response(
                {"detail": _("No product available for payment options.")},
                status=status.HTTP_404_NOT_FOUND,
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
    authentication_classes = [JWTAuthentication, SessionAuthentication]

    def get(self, request, *args, **kwargs):
        options = CloudPaymentOptions.objects.all().first()
        if not options:
            return Response(
                {"detail": _("No payment options available.")},
                status=status.HTTP_404_NOT_FOUND,
            )
        product = options.get_product()
        if not product:
            return Response(
                {"detail": _("No product available for payment options.")},
                status=status.HTTP_404_NOT_FOUND,
            )
        serializer = self.get_serializer(product)
        return Response(serializer.data, status=status.HTTP_200_OK)


@method_decorator(csrf_exempt, name="dispatch")
class CloudPaymentsWebhookView(GenericAPIView):
    """
    Handle CloudPayments webhook: verify HMAC signature, fetch transaction details
    from CloudPayments API and persist full transaction data to our DB.
    """

    # Отключаем аутентификацию и права доступа, т. к. запрос идёт от CloudPayments
    authentication_classes = []
    permission_classes = []

    def post(self, request, *args, **kwargs):
        # 1) Проверяем HMAC-подпись тела запроса
        raw_body = request.body  # байты исходного JSON
        signature = request.META.get("HTTP_CONTENT_HMAC", "")
        secret = settings.CLOUDPAYMENTS_SECRET.encode("utf-8")
        digest = hmac.new(secret, raw_body, digestmod=hashlib.sha256).digest()
        expected_signature = base64.b64encode(digest).decode("utf-8")

        if not hmac.compare_digest(expected_signature, signature):
            return Response(
                {"detail": "Invalid signature"}, status=status.HTTP_400_BAD_REQUEST
            )
        # 2) Берём TransactionId из пришедших данных
        payload = request.data or {}
        tx_id = payload.get("TransactionId")
        if not tx_id:
            return Response(
                {"detail": "Missing TransactionId"}, status=status.HTTP_400_BAD_REQUEST
            )

        # 3) Запрашиваем полные данные по транзакции у CloudPayments
        try:
            verify_resp = requests.post(
                "https://api.cloudpayments.ru/payments/get",
                auth=(settings.CLOUDPAYMENTS_PUBLIC_ID, settings.CLOUDPAYMENTS_SECRET),
                json={"TransactionId": tx_id},
                timeout=10,
            )
            verify_resp.raise_for_status()
        except requests.RequestException as e:
            return Response(
                {"detail": f"Error fetching transaction info: {e}"},
                status=status.HTTP_502_BAD_GATEWAY,
            )

        model = verify_resp.json().get("Model") or {}
        # Проверяем, что транзакция действительно подтверждена
        status_str = model.get("Status")
        if status_str not in ("Completed", "Confirmed"):
            # просто отвечаем «ок», но не даём доступ
            return Response({"code": 0})

        # 4) Сопоставляем invoiceId → наш продукт
        inv_id = model.get("InvoiceId", "")
        try:
            product = Product.objects.get(uuid=inv_id)
        except Product.DoesNotExist:
            return Response(
                {"detail": "Unknown product"}, status=status.HTTP_400_BAD_REQUEST
            )

        # 5) Проверяем сумму/валюту на соответствие
        amount = Decimal(str(model.get("Amount", 0)))
        currency = model.get("Currency")
        if amount != product.price or currency != product.currency:
            # фиксируем попытку несоответствия
            return Response(
                {"detail": "Amount or currency mismatch"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # 6) Определяем пользователя (по Email из модели)
        user_email = model.get("Email")
        try:
            user = User.objects.get(email=user_email)
        except User.DoesNotExist:
            return Response(
                {"detail": "User not found"}, status=status.HTTP_400_BAD_REQUEST
            )

        # 7) Сохраняем или обновляем транзакцию
        trans, _ = CloudPaymentTransaction.objects.update_or_create(
            transaction_id=model["TransactionId"],
            defaults={
                "user": user,
                "invoice_id": inv_id,
                "product": product,
                "amount": amount,
                "currency": currency,
                "status": status_str.upper(),
                "card_type": model.get("CardType"),
                "ip_address": model.get("IpAddress"),
                "raw_data": model,
            },
        )

        # 8) Если успешно — даём доступ к продукту
        if trans.is_success():
            product.apply(user)

        # 9) Отправляем CloudPayments требуемый ответ
        return Response({"code": 0})
