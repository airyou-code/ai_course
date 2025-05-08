from django.utils.translation import gettext_lazy as _
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings
from datetime import datetime


class CourseUser(AbstractUser):
    LANGUAGE_CHOICES = (
        ('ru', _('Russian')),
        ('en', _('English')),
        ('cz', _('Czech')),
    )

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    email = models.EmailField(
        _('email address'),
        unique=True,
        help_text=_('User email address, used as login and must be unique')
    )

    language = models.CharField(
        max_length=2,
        choices=LANGUAGE_CHOICES,
        default='ru',
        verbose_name=_('Preferred Language')
    )

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


class UserLessonProgress(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    lesson = models.ForeignKey('courses.Lesson', on_delete=models.CASCADE)
    last_seen_block = models.ForeignKey('courses.ContentBlock', on_delete=models.CASCADE)
    procent_progress = models.IntegerField(default=0)
    is_completed = models.BooleanField(default=False)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('user', 'lesson')
