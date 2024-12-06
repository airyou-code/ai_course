from django.contrib.admin import (ModelAdmin,)
from django.contrib import admin
from .models import Task


# Register your models here.
@admin.register(Task)
class FirmwareAppAdmin(ModelAdmin):
    pass
