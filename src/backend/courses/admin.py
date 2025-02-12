from django import forms
from django.utils.translation import gettext_lazy as _
from django.contrib import admin
from django.db import models
from core.widgets import JSONEditorWidget

from nonrelated_inlines.admin import NonrelatedStackedInline
from adminsortable.admin import SortableAdmin
from adminsortable.admin import SortableStackedInline
from .utils import process_lesson_to_json

from courses.models import Course, ContentBlock, Lesson, Module, Group
from core.admin import CoreAdmin


class GroupsInlain(SortableStackedInline, NonrelatedStackedInline):
    model = Group
    fields = [
        "title",
        "description"
    ]
    show_change_link = True
    verbose_name_plural = _("Groups")
    extra = 0

    def get_form_queryset(self, obj):
        return Group.objects.filter(course=obj)

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
    inlines = (GroupsInlain,)

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


class ModulesInlain(SortableStackedInline, NonrelatedStackedInline):
    model = Module
    fields = [
        "title",
        "description"
    ]
    show_change_link = True
    verbose_name_plural = _("Modules")
    extra = 0

    def get_form_queryset(self, obj):
        return Module.objects.filter(group=obj)

    def save_new_instance(self, parent, instance):
        instance.group = parent
        instance.save()


@admin.register(Group)
class GroupAdmin(SortableAdmin, CoreAdmin):
    list_display = (
        "title",
        "course",
        "description",
    )
    search_fields = ("title",)
    list_filter = ("course",)
    inlines = (ModulesInlain,)

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
        "group",
        "course",
        "description",
    )
    search_fields = ("title",)
    list_filter = ("group__course", "group")
    inlines = (LessonsInlain,)

    fieldsets = (
        (
            _("General"), {
                "fields": (
                    "title",
                    "group",
                    "description",
                    *CoreAdmin.base_fields,
                )
            }
        ),
    )

    def course(self, obj):
        return obj.group.course if obj.group else None
    course.short_description = 'Course'


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

    formfield_overrides = {
        models.JSONField: {
            "widget": JSONEditorWidget(
                attrs={"style": "margin-bottom:30px;height:350px;width:100%;"}
            )
        },
    }

    def get_form_queryset(self, obj):
        return ContentBlock.objects.filter(lesson=obj)

    def save_new_instance(self, parent, instance):
        instance.lesson = parent
        instance.save()


class LessonAdminForm(forms.ModelForm):
    content_blocks_gen = forms.CharField(
        widget=forms.Textarea, required=False,
        label="Content block gen"
    )

    class Meta:
        model = Lesson
        fields = '__all__'


@admin.register(Lesson)
class LessonAdmin(SortableAdmin, CoreAdmin):
    form = LessonAdminForm
    list_display = (
        "title",
        "module",
        "group",
        "course",
        "description",
    )
    search_fields = ("title",)
    list_filter = (
        "module",
        "module__group",
        "module__group__course",
    )
    inlines = (ContenBlockInlain,)
    readonly_fields = ("uuid",)

    fieldsets = (
        (
            _("General"), {
                "fields": (
                    "title",
                    "module",
                    "is_locked",
                    "is_free",
                    "duration",
                    "description",
                    "uuid",
                    "content_blocks_gen",
                    *CoreAdmin.base_fields,
                )
            }
        ),
    )

    def group(self, obj):
        return obj.module.group if obj.module else None
    group.short_description = 'Group'

    def course(self, obj):
        return obj.module.group.course if obj.module and obj.module.group else None
    course.short_description = 'Course'

    def save_model(self, request, obj, form, change):
        content_blocks_gen_value = form.cleaned_data.get('content_blocks_gen')

        if content_blocks_gen_value:
            blocks_data: dict = process_lesson_to_json(
                text=content_blocks_gen_value
            ).get('blocks', [])
            for block_data in blocks_data:
                ContentBlock.objects.create(
                    lesson=obj, **block_data
                )

        super().save_model(request, obj, form, change)


@admin.register(ContentBlock)
class ContentBlockAdmin(SortableAdmin, CoreAdmin):
    list_display = (
        "block_type",
        "lesson",
        "module",
        "group",
        "course",
        # "content_html",
        # "content_text",
        # "content_json"
    )
    search_fields = ("block_type",)
    list_filter = ("lesson", "lesson__module", "lesson__module__group")
    readonly_fields = ("uuid",)

    fieldsets = (
        (
            _("General"), {
                "fields": (
                    "block_type",
                    "lesson",
                    "uuid",
                    "content_html",
                    "content_text",
                    "content_json",
                    *CoreAdmin.base_fields,
                )
            }
        ),
    )

    def module(self, obj):
        return obj.lesson.module if obj.lesson else None
    module.short_description = 'Module'

    def group(self, obj):
        return obj.lesson.module.group if obj.lesson and obj.lesson.module else None
    group.short_description = 'Group'

    def course(self, obj):
        return obj.lesson.module.group.course if obj.lesson and obj.lesson.module and obj.lesson.module.group else None
    course.short_description = 'Course'
