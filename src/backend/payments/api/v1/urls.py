from django.urls import path

from payments.api.v1 import views

urlpatterns = [
    path(
        "params/",
        views.CloudPaymentOptionsAPIView.as_view(),
        name="cloud-payment-options",
    ),
    path("product/", views.ProductAPIView.as_view(), name="product-details"),
    path(
        "transaction/",
        views.CloudPaymentsWebhookView.as_view(),
        name="cloud-payment-transaction",
    ),
]
