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


# class TestInputWidget(forms.Textarea):
#     template_name = 'widgets/test_input_widget.html'

#     def format_value(self, value):
#         if value is None:
#             return ''
#         if isinstance(value, dict):
#             return json.dumps(value, indent=4, ensure_ascii=False)
#         return value


class GroupsInlain(SortableStackedInline, NonrelatedStackedInline):
    model = Group
    fields = [
        "title",
        "description"
    ]
    show_change_link = True
    verbose_name_plural = _("Groups")
    # template = "custom_admin/content_editor.html"
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
        # "course",
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
                    # "course",
                    "group",
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
    fake_field = forms.CharField(
        widget=forms.Textarea, required=False, label="Fake Field"
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
        "description",
    )
    search_fields = ("title",)
    inlines = (ContenBlockInlain,)
    # list_filter = ()
    readonly_fields = ("uuid",)
    # change_fields = ()

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
                    "fake_field",
                    *CoreAdmin.base_fields,
                )
            }
        ),
    )

    def save_model(self, request, obj, form, change):
        # Get the value from the fake field
        fake_field_value = form.cleaned_data.get('fake_field')

        # Process the value and save it to the appropriate fields
        if fake_field_value:
            # Example processing: save the value to the description field
            blocks_data: dict = process_lesson_to_json(
                text=fake_field_value
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
        "content_html",
        "content_text",
        "content_json"
    )
    search_fields = ("block_type",)
    # list_filter = ()
    # readonly_fields = ()
    # change_fields = ()

    fieldsets = (
        (
            _("General"), {
                "fields": (
                    "block_type",
                    "lesson",
                    "content_html",
                    "content_text",
                    "content_json",
                    *CoreAdmin.base_fields,
                )
            }
        ),
    )
