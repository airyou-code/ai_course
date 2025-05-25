import uuid
from django.db import models
from django.conf import settings
from core.models import CoreModel
from django.utils.translation import gettext_lazy as _
from django.contrib.auth import get_user_model
from datetime import timedelta, datetime


class Product(models.Model):
    """
    Represents a purchasable product that grants access to lessons.
    """
    uuid = models.UUIDField(
        default=uuid.uuid4,
        editable=False,
        unique=True,
        help_text="Unique identifier for the product"
    )
    name = models.CharField(
        max_length=255,
        help_text="Human-readable title of the product"
    )
    description = models.TextField(
        blank=True,
        null=True,
        help_text="Optional detailed description"
    )
    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=999999.99,
        help_text="Product price"
    )
    currency = models.CharField(
        max_length=3,
        default='USD',
        help_text="ISO-4217 currency code"
    )
    is_active = models.BooleanField(
        default=True,
        help_text="Флаг, доступен ли продукт для покупки"
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        help_text="Когда продукт был создан"
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        help_text="Когда продукт был в последний раз обновлён"
    )

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Product'
        verbose_name_plural = 'Products'

    def __str__(self):
        return self.name

    def apply(self, user):
        """
        Grant the given user access to all non-free lessons
        belonging to the product's courses.
        """
        pass


class CloudPaymentTransaction(models.Model):
    """
    Stores information about a CloudPayments transaction and webhook callbacks.
    """
    STATUS_CHOICES = [
        ('AUTHORIZED', 'Authorized'),
        ('CONFIRMED', 'Confirmed'),
        ('DECLINED', 'Declined'),
        ('REFUNDED', 'Refunded'),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='cloudpayments_transactions'
    )
    transaction_id = models.CharField(
        max_length=255,
        unique=True,
        help_text="CloudPayments TransactionId"
    )
    invoice_id = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        help_text="Your own order/invoice identifier (InvoiceId)"
    )
    product = models.ForeignKey(
        Product,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name='transactions',
        help_text="Product associated with the transaction"
    )
    amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        help_text="Transaction amount"
    )
    currency = models.CharField(
        max_length=3,
        default='RUB',
        help_text="ISO-4217 currency code"
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='AUTHORIZED',
        help_text="Current status of the transaction"
    )
    card_type = models.CharField(
        max_length=50,
        blank=True,
        null=True,
        help_text="Тип карты (Visa, MasterCard и т.п.)"
    )
    ip_address = models.GenericIPAddressField(
        blank=True,
        null=True,
        help_text="IP-адрес клиента на момент оплаты"
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        help_text="Дата и время создания записи"
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        help_text="Дата и время последнего обновления записи"
    )
    raw_data = models.JSONField(
        default=dict,
        blank=True,
        help_text="Полный JSON-ответ от CloudPayments"
    )

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'CloudPayments Transaction'
        verbose_name_plural = 'CloudPayments Transactions'

    def __str__(self):
        return f"{self.transaction_id} ({self.status})"

    def is_success(self):
        """
        Return True if the transaction has been confirmed.
        """
        return self.status == 'CONFIRMED'


class CloudPaymentOptions(models.Model):
    params = models.JSONField(
        default=dict,
        blank=True,
        help_text="Настройки CloudPayments, например, public_key, secret_key и т.д."
    )

    def get_params(self):
        """
        Returns the CloudPayments parameters as a dictionary.
        """
        return self.params

    def get_product(self):
        """
        Returns the product associated with this CloudPaymentOptions.
        """
        return Product.objects.filter(is_active=True).first()


class SubscriptionType(CoreModel):
    DURATION_CHOICES = [
        ('subscription', 'Subscription'),
        ('lifetime', 'Lifetime'),
    ]

    name = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    duration_type = models.CharField(max_length=12, choices=DURATION_CHOICES)
    # Only for subscription type
    duration_value = models.PositiveIntegerField(
        null=True, blank=True, help_text=_("Number of months")
    )

    def __str__(self):
        return self.name

    def get_duration(self):
        if self.duration_type == 'subscription':
            return timedelta(days=30 * self.duration_value)
        elif self.duration_type == 'lifetime':
            return None  # Lifetime subscription has no end date

    class Meta:
        verbose_name = _("Subscription Type")
        verbose_name_plural = _("Subscription Types")


class Subscription(CoreModel):
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)
    subscription_type = models.ForeignKey(
        SubscriptionType, on_delete=models.CASCADE
    )
    purchase_date = models.DateTimeField(auto_now_add=True)
    start_date = models.DateTimeField(null=True, blank=True)
    end_date = models.DateTimeField(null=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.start_date:
            last_subscription = Subscription.objects.filter(
                user=self.user
            ).order_by('-end_date').first()
            if last_subscription and (
                last_subscription.end_date > datetime.now()
            ):
                self.start_date = last_subscription.end_date
            else:
                self.start_date = datetime.now()

        if not self.end_date:
            if self.subscription_type.duration_type == 'subscription':
                duration = self.subscription_type.get_duration()
                if duration:
                    self.end_date = self.start_date + duration
            elif self.subscription_type.duration_type == 'lifetime':
                self.end_date = datetime.max  # Set to maximum possible date

        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.subscription_type.name}"

    class Meta:
        verbose_name = _("Subscription")
        verbose_name_plural = _("Subscriptions")
