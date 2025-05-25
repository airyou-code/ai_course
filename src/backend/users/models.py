import uuid
from django.utils.translation import gettext_lazy as _
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings
from datetime import datetime


class CourseUser(AbstractUser):
    LANGUAGE_CHOICES = settings.LANGUAGES

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    email = models.EmailField(
        _('email address'),
        unique=True,
        help_text=_('User email address, used as login and must be unique')
    )
    access = models.ManyToManyField(
        'courses.Access',
        blank=True,
        related_name='users',
        help_text=_('Access to lessons')
    )

    language = models.CharField(
        max_length=6,
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

    def is_has_access(self, lesson) -> bool:
        """
        Check if the user has access to a specific lesson.
        """
        return self.access.filter(lessons=lesson).exists()


class UserLessonProgress(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    lesson = models.ForeignKey('courses.Lesson', on_delete=models.CASCADE)
    last_seen_block = models.ForeignKey('courses.ContentBlock', on_delete=models.CASCADE)
    procent_progress = models.IntegerField(default=0)
    is_completed = models.BooleanField(default=False)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('user', 'lesson')


class UserReview(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    lesson = models.ForeignKey('courses.Lesson', on_delete=models.CASCADE)
    text = models.TextField(blank=True, null=True, default="")
    useful = models.SmallIntegerField(default=0)
    interesting = models.SmallIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'lesson')
        verbose_name = _("User Review")
        verbose_name_plural = _("User Reviews")
