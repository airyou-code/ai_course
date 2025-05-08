from django.contrib import admin
from core.admin import CoreAdmin
from .models import SubscriptionType, Subscription, Product, CloudPaymentTransaction
from django.utils.translation import gettext_lazy as _


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    """
    Admin for Product model.
    """
    list_display = (
        'name',
        'price',
        'currency',
        'is_active',
        'created_at',
        'updated_at',
    )
    list_filter = ('is_active', 'currency')
    search_fields = ('name', 'description')
    readonly_fields = ('created_at', 'updated_at',)


@admin.register(CloudPaymentTransaction)
class CloudPaymentTransactionAdmin(admin.ModelAdmin):
    """
    Admin for CloudPaymentTransaction model.
    """
    list_display = (
        'transaction_id',
        'user',
        'product',
        'amount',
        'currency',
        'status',
        'created_at',
        'updated_at',
    )
    list_filter = ('status', 'currency', 'created_at')
    search_fields = (
        'transaction_id',
        'invoice_id',
        'user__username',
        'user__email',
    )
    readonly_fields = (
        'created_at',
        'updated_at',
        'raw_data',
    )
    raw_id_fields = ('user', 'product',)


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
