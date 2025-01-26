from django.db import models
from core.models import CoreModel
from tinymce.models import HTMLField
from adminsortable.models import SortableMixin


class Course(CoreModel):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.title


class Module(CoreModel, SortableMixin):
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


class Lesson(CoreModel, SortableMixin):
    module = models.ForeignKey(Module, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    duration = models.CharField(
        max_length=50, blank=True, null=True, default="15 min"
    )
    is_free = models.BooleanField(default=False)
    is_locked = models.BooleanField(default=True)
    order = models.PositiveIntegerField(
        default=0, editable=False, db_index=True
    )

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['order']


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
        return self.title

    def save(self, *args, **kwargs):
        if not self.content_json:
            if self.block_type == 'test':
                self.content_json = self.TEST_TEMPLATE
            elif self.block_type == 'choices_field':
                self.content_json = self.CHOICES_FIELD_TEMPLATE
        super().save(*args, **kwargs)
