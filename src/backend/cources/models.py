from django.db import models
from core.models import CoreModel
from tinymce.models import HTMLField
from adminsortable.models import SortableMixin


class Course(CoreModel):
    title = models.CharField(max_length=255)
    description = models.TextField()

    def __str__(self):
        return self.title


class ContentBlock(CoreModel, SortableMixin):
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    content = HTMLField(blank=True, null=True)
    order = models.PositiveIntegerField(default=0, editable=False, db_index=True)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.title
