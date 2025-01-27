from django.db import models
from core.models import CoreModel
from django.utils.translation import gettext_lazy as _
from django.contrib.auth import get_user_model
from datetime import timedelta, datetime


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
