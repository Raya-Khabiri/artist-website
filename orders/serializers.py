from rest_framework import serializers

from .models import Order, OrderItem


class OrderItemSerializer(
    serializers.ModelSerializer,
):
    artwork_title = serializers.CharField(
        source="artwork.title",
        read_only=True,
    )

    artwork_slug = serializers.CharField(
        source="artwork.slug",
        read_only=True,
    )

    artwork_image = serializers.ImageField(
        source="artwork.main_image",
        read_only=True,
    )

    product_type_display = serializers.CharField(
        source="get_product_type_display",
        read_only=True,
    )

    class Meta:
        model = OrderItem

        fields = (
            "id",
            "artwork",
            "artwork_title",
            "artwork_slug",
            "artwork_image",
            "product_type",
            "product_type_display",
            "quantity",
            "unit_price",
        )

        read_only_fields = fields


class OrderManagementSerializer(
    serializers.ModelSerializer,
):
    items = OrderItemSerializer(
        many=True,
        read_only=True,
    )

    status_display = serializers.CharField(
        source="get_status_display",
        read_only=True,
    )

    class Meta:
        model = Order

        fields = (
            "id",
            "reference",
            "customer",
            "customer_name",
            "customer_email",
            "customer_phone",
            "address",
            "note",
            "status",
            "status_display",
            "total_price",
            "currency",
            "items",
            "created_at",
            "updated_at",
        )

        read_only_fields = (
            "id",
            "reference",
            "customer",
            "customer_name",
            "customer_email",
            "customer_phone",
            "address",
            "note",
            "status_display",
            "total_price",
            "currency",
            "items",
            "created_at",
            "updated_at",
        )
