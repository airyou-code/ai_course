from django.utils.translation import gettext_lazy as _
from django.contrib import admin

from nonrelated_inlines.admin import NonrelatedStackedInline

from cources.models import Course, ContentBlock
from core.admin import CoreAdmin


class FirmwareInlain(NonrelatedStackedInline):
    model = ContentBlock
    fields = ["content", "order"]
    verbose_name_plural = _("Content")
    template = "custom_admin/content_editor.html"
    extra = 0

    def get_form_queryset(self, obj):
        return ContentBlock.objects.filter(course=obj)
    
    def save_new_instance(self, parent, instance):
        instance.course = parent
        instance.order = 1
        instance.save()


# Register your models here.
@admin.register(Course)
class CourseAdmin(CoreAdmin):
    list_display = (
        "title",
        "description",
    )
    inlines = (FirmwareInlain,)
    search_fields = ("title",)
    # list_filter = ()
    # readonly_fields = ()
    # change_fields = ()

    fieldsets = (
        (
            _("Device"), {
                "fields": (
                    "title",
                    "description",
                    *CoreAdmin.base_fields,
                )
            }
        ),
    )
