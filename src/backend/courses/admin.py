from django.utils.translation import gettext_lazy as _
from django.contrib import admin
from django.db import models
from django_json_widget.widgets import JSONEditorWidget

from nonrelated_inlines.admin import NonrelatedStackedInline
from adminsortable.admin import SortableAdmin
from adminsortable.admin import SortableStackedInline

from courses.models import Course, ContentBlock, Lesson, Module
from core.admin import CoreAdmin


class ModulesInlain(SortableStackedInline, NonrelatedStackedInline):
    model = Module
    fields = [
        "title",
        "description"
    ]
    show_change_link = True
    verbose_name_plural = _("Modules")
    # template = "custom_admin/content_editor.html"
    extra = 0

    def get_form_queryset(self, obj):
        return Module.objects.filter(course=obj)

    def save_new_instance(self, parent, instance):
        instance.course = parent
        instance.save()


@admin.register(Course)
class CourseAdmin(SortableAdmin, CoreAdmin):
    list_display = (
        "title",
        "description",
    )
    search_fields = ("title",)
    inlines = (ModulesInlain,)
    # list_filter = ()
    # readonly_fields = ()
    # change_fields = ()

    fieldsets = (
        (
            _("General"), {
                "fields": (
                    "title",
                    "description",
                    *CoreAdmin.base_fields,
                )
            }
        ),
    )


class LessonsInlain(SortableStackedInline, NonrelatedStackedInline):
    model = Lesson
    fields = [
        "title",
        "description",
        "is_locked",
        "is_free",
        "duration",
    ]
    show_change_link = True
    verbose_name_plural = _("Lessons")
    # template = "custom_admin/content_editor.html"
    extra = 0

    def get_form_queryset(self, obj):
        return Lesson.objects.filter(module=obj)

    def save_new_instance(self, parent, instance):
        instance.module = parent
        instance.save()


@admin.register(Module)
class ModuleAdmin(SortableAdmin, CoreAdmin):
    list_display = (
        "title",
        "course",
        "description",
    )
    search_fields = ("title",)
    inlines = (LessonsInlain,)
    # list_filter = ()
    # readonly_fields = ()
    # change_fields = ()

    fieldsets = (
        (
            _("General"), {
                "fields": (
                    "title",
                    "course",
                    "description",
                    *CoreAdmin.base_fields,
                )
            }
        ),
    )


class ContenBlockInlain(SortableStackedInline, NonrelatedStackedInline):
    model = ContentBlock
    fields = [
        "block_type",
        "content_html",
        "content_text",
        "content_json"
    ]
    verbose_name_plural = _("Content")
    template = "custom_admin/content_editor.html"
    extra = 0

    # formfield_overrides = {
    #     models.JSONField: {
    #         "widget": JSONEditorWidget(
    #             # attrs={"style": "height:200px;width:100%;position:relative;z-index:1;display:flex;"}
    #         )
    #     },
    # }

    def get_form_queryset(self, obj):
        return ContentBlock.objects.filter(lesson=obj)

    def save_new_instance(self, parent, instance):
        instance.lesson = parent
        instance.save()


@admin.register(Lesson)
class LessonAdmin(SortableAdmin, CoreAdmin):
    list_display = (
        "title",
        "module",
        "description",
    )
    search_fields = ("title",)
    inlines = (ContenBlockInlain,)
    # list_filter = ()
    # readonly_fields = ()
    # change_fields = ()

    fieldsets = (
        (
            _("General"), {
                "fields": (
                    "title",
                    "module",
                    "is_locked",
                    "duration",
                    "description",
                    *CoreAdmin.base_fields,
                )
            }
        ),
    )
