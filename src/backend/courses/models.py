import uuid
import json
from django.utils.translation import gettext_lazy as _
from django.conf import settings
from django.db import models
from core.models import CoreModel
from tinymce.models import HTMLField
from adminsortable.models import SortableMixin
from users.models import UserLessonProgress
from django.core.exceptions import ObjectDoesNotExist


class Course(CoreModel):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    language = models.CharField(
        max_length=6,
        choices=settings.LANGUAGES,
        default='ru',
        help_text="Language of the course"
    )

    def __str__(self):
        return self.title

    class Meta:
        indexes = [
            models.Index(fields=['language'], name='course_language_idx'),
        ]


class Group(CoreModel, SortableMixin):
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    order = models.PositiveIntegerField(
        default=0, editable=False, db_index=True
    )

    def __str__(self):
        return self.title

    @property
    def language(self) -> str:
        return self.course.language

    class Meta:
        ordering = ['order']
        indexes = [
            # Быстрая фильтрация групп по курсу и языку
            models.Index(fields=['course', 'order'], name='group_course_order_idx'),
        ]


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

    @property
    def language(self) -> str:
        return self.group.language

    class Meta:
        ordering = ['order']
        indexes = [
            # Быстрая фильтрация модулей по группе
            models.Index(fields=['group', 'order'], name='module_group_order_idx'),
        ]


class Lesson(CoreModel, SortableMixin):
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True, db_index=True)
    module = models.ForeignKey(Module, on_delete=models.CASCADE)
    title = models.CharField(max_length=255, help_text="the special character `$` will be replaced by a sequence number")
    description = models.TextField(blank=True, null=True)
    lesson_en = models.ForeignKey(
        'self',
        on_delete=models.CASCADE,
        blank=True,
        null=True,
        help_text="English version of the lesson. If empty, the lesson will be without a prompt.",
    )
    duration = models.CharField(
        max_length=50, blank=True, null=True, default="15 min"
    )
    # prompt = models.TextField(
    #     blank=True,
    #     null=True,
    #     help_text="Prompt for ChatGPT. If empty, the lesson will be without a prompt.",
    # )
    is_free = models.BooleanField(
        default=False,
        help_text="If True, the lesson will be available for free.",
    )
    order = models.PositiveIntegerField(
        default=0, editable=False, db_index=True
    )

    def __str__(self):
        return self.title

    @property
    def language(self) -> str:
        return self.module.language

    class Meta:
        ordering = ['order']
        indexes = [
            # Комбинированный индекс для next_lesson запросов в представлениях
            models.Index(fields=['module', 'order'], name='lesson_module_order_idx'),
            # Индекс для быстрого доступа по is_free (фильтрация бесплатных уроков)
            models.Index(fields=['is_free'], name='lesson_is_free_idx'),
            # Индекс для языковых версий
            models.Index(fields=['lesson_en'], name='lesson_english_version_idx'),
        ]

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

    async def aget_prompt(self, user) -> str:
        """
        Return a JSON string with the user's lesson progress status,
        including separate previous, current, and next content blocks.
        """
        # Асинхронно получаем все текстовые блоки этого урока в порядке
        all_blocks = []
        async for blk in ContentBlock.objects.filter(
            lesson=self,
            block_type='text'
        ).order_by('order'):
            all_blocks.append(blk)

        # Определяем order текущего блока по прогрессу пользователя
        try:
            progress = await UserLessonProgress.objects \
                .select_related('last_seen_block') \
                .aget(user=user, lesson=self)
            current_order = (
                progress.last_seen_block.order
                if progress.last_seen_block is not None
                else (all_blocks[0].order if all_blocks else 0)
            )
        except UserLessonProgress.DoesNotExist:
            current_order = all_blocks[0].order if all_blocks else 0

        # Ищем индекс текущего блока в списке all_blocks
        orders = [b.order for b in all_blocks]
        try:
            idx = orders.index(current_order)
        except ValueError:
            idx = 0

        # Выбираем предыдущий, текущий и следующий блоки (или None)
        prev_blk = all_blocks[idx-1] if idx-1 >= 0 else None
        curr_blk = all_blocks[idx] if 0 <= idx < len(all_blocks) else None
        next_blk = all_blocks[idx+1] if idx+1 < len(all_blocks) else None

        # Формируем словарь с тремя блоками
        result = {
            "previous_block": {
                "content_html": prev_blk.content_html or ""
            } if prev_blk else None,
            "current_block": {
                "content_html": curr_blk.content_html or ""
            } if curr_blk else None,
            "next_block": {
                "content_html": next_blk.content_html or ""
            } if next_blk else None,
        }

        return json.dumps(result, ensure_ascii=False)


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

    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True, db_index=True)
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
        indexes = [
            # Критически важный индекс для запросов в представлениях
            models.Index(fields=['lesson', 'order'], name='content_block_lesson_order_idx'),
            # Быстрый поиск по типу блока (важно для фильтрации в представлениях)
            models.Index(fields=['block_type'], name='content_block_type_idx'),
            # Составной индекс для фильтрации по типу блока в пределах урока
            models.Index(fields=['lesson', 'block_type', 'order'], name='lesson_block_type_order_idx'),
        ]

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
