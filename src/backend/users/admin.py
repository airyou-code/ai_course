from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.utils.translation import gettext_lazy as _
from users.models import CourseUser, UserLessonProgress, UserReview


@admin.register(CourseUser)
class CourseUserAdmin(UserAdmin):
    list_display = (
        "username",
        "email",
        "has_active_subscription",
        "type_subscription",
        "is_staff",
    )
    filter_horizontal = (
        'access',
    )
    fieldsets = (
        (
            _("Personal info"), {
                "fields": (
                    "first_name",
                    "last_name",
                    "email",
                    "language",
                    "access",
                )
            }
        ),
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


@admin.register(UserLessonProgress)
class UserLessonProgressAdmin(admin.ModelAdmin):
    list_display = ("user", "lesson", "last_seen_block", "updated_at",)
    list_filter = ("lesson",)
    search_fields = ("user", "lesson",)


@admin.register(UserReview)
class UserReviewAdmin(admin.ModelAdmin):
    list_display = ("user", "lesson", "useful", "interesting", "created_at",)
    list_filter = ("lesson",)
    search_fields = ("user", "lesson",)
    ordering = ("-created_at",)
    readonly_fields = ("created_at",)
