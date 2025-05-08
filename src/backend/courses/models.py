import uuid
from django.db import models
from core.models import CoreModel
from tinymce.models import HTMLField
from adminsortable.models import SortableMixin
from users.models import UserLessonProgress


class Course(CoreModel):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.title


class Group(CoreModel, SortableMixin):
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    order = models.PositiveIntegerField(
        default=0, editable=False, db_index=True
    )

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['order']


class Module(CoreModel, SortableMixin):
    # course = models.ForeignKey(Course, on_delete=models.CASCADE)
    group = models.ForeignKey(Group, on_delete=models.CASCADE, null=True, blank=True)
    title = models.CharField(max_length=255, help_text="the special character `$` will be replaced by a sequence number")
    description = models.TextField(blank=True, null=True)
    order = models.PositiveIntegerField(
        default=0, editable=False, db_index=True
    )

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['order']


class Lesson(CoreModel, SortableMixin):
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    module = models.ForeignKey(Module, on_delete=models.CASCADE)
    title = models.CharField(max_length=255, help_text="the special character `$` will be replaced by a sequence number")
    description = models.TextField(blank=True, null=True)
    duration = models.CharField(
        max_length=50, blank=True, null=True, default="15 min"
    )
    prompt = models.TextField(
        blank=True,
        null=True,
        help_text="Prompt for ChatGPT. If empty, the lesson will be without a prompt.",
    )
    is_free = models.BooleanField(
        default=False,
        help_text="If True, the lesson will be available for free.",
    )
    order = models.PositiveIntegerField(
        default=0, editable=False, db_index=True
    )

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['order']

    def get_progress(self, user):
        progress = UserLessonProgress.objects.filter(
            user=user, lesson=self
        ).first()
        if not progress:
            return 0
        return progress.procent_progress
    
    def is_completed(self, user):
        is_completed = UserLessonProgress.objects.filter(
            user=user, lesson=self, is_completed=True
        ).exists()
        return is_completed


class ContentBlock(CoreModel, SortableMixin):
    TYPE_CHOICES = [
        ('none', 'None'),
        ('text', 'Html Text Block'),
        ('output_dialog', 'Html Output Dialog'),
        ('button_next', 'Button (Next Lesson)'),
        ('button_continue', 'Button (Continue)'),
        ('choices_field', 'Choices Field'),
        ('test', 'Test'),
        ('input_gpt', 'Input to Chat GPT'),
    ]
    TEST_TEMPLATE: dict = {
        "question": "What is the main purpose of this course?",
        "options": [
            "options 1",
            "options 2",
            "options 3",
            "options 4",
        ],
        "correctAnswer": 2,
        "right_feedback": "The main purpose is to understand basic concepts!",
        "wrong_feedback": "The main purpose is to understand basic concepts!"
    }

    CHOICES_FIELD_TEMPLATE: dict = {
        "options": [
            "Option 1",
        ]
    }

    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    content_html = HTMLField(blank=True, null=True)
    content_text = models.TextField(blank=True, null=True)
    content_json = models.JSONField(default=dict, blank=True)
    block_type = models.CharField(
        max_length=30,
        choices=TYPE_CHOICES,
        default='none',
    )
    order = models.PositiveIntegerField(
        default=0, editable=False, db_index=True
    )

    class Meta:
        ordering = ['order']

    def __str__(self):
        return str(self.uuid)

    def save(self, *args, **kwargs):
        if not self.content_json:
            if self.block_type == 'test':
                self.content_json = self.TEST_TEMPLATE
            elif self.block_type == 'choices_field':
                self.content_json = self.CHOICES_FIELD_TEMPLATE
        super().save(*args, **kwargs)


class Access(models.Model):
    """
    A named bundle of lessons that can be granted as a unit.
    """
    name = models.CharField(
        max_length=255,
        help_text="Название пакета доступа"
    )
    description = models.TextField(
        blank=True,
        null=True,
        help_text="Описание того, что входит в пакет"
    )
    lessons = models.ManyToManyField(
        'Lesson',
        related_name='access_bundles',
        help_text="Какие уроки включает этот пакет"
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        help_text="Когда пакет был создан"
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        help_text="Когда пакет был в последний раз обновлён"
    )

    class Meta:
        verbose_name = 'Access Bundle'
        verbose_name_plural = 'Access Bundles'
        ordering = ['name']

    def __str__(self):
        return self.name