from django.utils.translation import gettext_lazy as _
from django.contrib import admin

from nonrelated_inlines.admin import NonrelatedStackedInline
from adminsortable.admin import SortableAdmin
from adminsortable.admin import SortableStackedInline

from cources.models import Course, ContentBlock
from core.admin import CoreAdmin


class ContenBlockInlain(SortableStackedInline, NonrelatedStackedInline):
    model = ContentBlock
    fields = ["content"]
    verbose_name_plural = _("Content")
    template = "custom_admin/content_editor.html"
    extra = 0

    def get_form_queryset(self, obj):
        return ContentBlock.objects.filter(course=obj)

    def save_new_instance(self, parent, instance):
        instance.course = parent
        instance.save()


# Register your models here.
@admin.register(Course)
class CourseAdmin(SortableAdmin, CoreAdmin):
    list_display = (
        "title",
        "description",
    )
    inlines = (ContenBlockInlain,)
    search_fields = ("title",)
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
