from django.utils.translation import gettext_lazy as _
from django.db import models
# from core.models import CoreModel
from django.contrib.auth.models import AbstractUser
# Create your models here.


class CourseUser(AbstractUser):
    REQUIRED_FIELDS = ["email"]

    class Meta:
        verbose_name = _("User")
        verbose_name_plural = _("Users")
