from django.db import models
from django.contrib.auth.models import User
from tinymce.models import HTMLField


class Task(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    description = HTMLField(blank=True, null=True)
    completed = models.BooleanField(default=False)
