from django.contrib import admin
from core.admin import CoreAdmin
from .models import SubscriptionType, Subscription


@admin.register(SubscriptionType)
class SubscriptionTypeAdmin(CoreAdmin):
    list_display = (
        'name',
        'price',
        'duration_type',
        'duration_value',
    )
    fieldsets = (
        (None, {
            'fields': (
                'name',
                'price',
                'duration_type',
                'duration_value',
            )
        }),
    )


@admin.register(Subscription)
class SubscriptionAdmin(CoreAdmin):
    list_display = (
        'user',
        'subscription_type',
        'purchase_date',
        'start_date',
        'end_date',
    )
    readonly_fields = (
        'purchase_date',

    )
    fieldsets = (
        (None, {
            'fields': (
                'user',
                'subscription_type',
                'start_date',
                'end_date',
                'purchase_date',
            )
        }),
        ('Meta Data', {
            'fields': (
                *CoreAdmin.base_fields,
            )
        }),
    )
