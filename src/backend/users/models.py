from django.utils.translation import gettext_lazy as _
from django.db import models
from django.contrib.auth.models import AbstractUser
from datetime import datetime

class CourseUser(AbstractUser):
    REQUIRED_FIELDS = ["email"]

    class Meta:
        verbose_name = _("User")
        verbose_name_plural = _("Users")

    @property
    def has_active_subscription(self):
        return self.subscription_set.filter(
            end_date__gte=datetime.now()
        ).exists()

    @property
    def type_subscription(self):
        return self.subscription_set.filter(
            end_date__gte=datetime.now()
        ).first()
