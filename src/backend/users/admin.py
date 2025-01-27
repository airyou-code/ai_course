from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.utils.translation import gettext_lazy as _
from users.models import CourseUser


@admin.register(CourseUser)
class CourseUserAdmin(UserAdmin):
    list_display = (
        "username",
        "email",
        "has_active_subscription",
        "type_subscription",
        "is_staff",
    )
    fieldsets = (
        (_("Personal info"), {"fields": ("first_name", "last_name", "email")}),
        (
            _("Permissions"),
            {
                "fields": (
                    "is_active",
                    "is_staff",
                    "is_superuser",
                    "groups",
                    "user_permissions",
                ),
            },
        ),
        (_("Important dates"), {"fields": ("last_login", "date_joined")}),
        (None, {"fields": ("username", "password")}),
    )
