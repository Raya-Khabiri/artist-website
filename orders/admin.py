from django.contrib import admin

from .models import Order, OrderItem


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 1

    autocomplete_fields = ("artwork",)


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = (
        "reference",
        "customer_name",
        "customer_email",
        "status",
        "total_price",
        "currency",
        "created_at",
    )

    list_filter = (
        "status",
        "currency",
        "created_at",
    )

    search_fields = (
        "reference",
        "customer_name",
        "customer_email",
    )

    readonly_fields = (
        "reference",
        "created_at",
        "updated_at",
    )

    inlines = (OrderItemInline,)


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = (
        "order",
        "artwork",
        "product_type",
        "quantity",
        "unit_price",
    )

    autocomplete_fields = ("artwork",)
