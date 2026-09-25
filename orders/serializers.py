from rest_framework import serializers

from .models import Order, OrderItem

from decimal import Decimal

from django.db import transaction

from artworks.models import Artwork


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


class CheckoutItemInputSerializer(
    serializers.Serializer,
):
    artwork_id = serializers.IntegerField(
        min_value=1,
    )

    product_type = serializers.ChoiceField(
        choices=OrderItem.TYPE_CHOICES,
    )

    quantity = serializers.IntegerField(
        min_value=1,
        max_value=20,
    )


class CheckoutCreateSerializer(
    serializers.Serializer,
):
    items = CheckoutItemInputSerializer(
        many=True,
        allow_empty=False,
    )

    customer_phone = serializers.CharField(
        max_length=30,
        required=False,
        allow_blank=True,
    )

    address_line_1 = serializers.CharField(
        max_length=250,
    )

    address_line_2 = serializers.CharField(
        max_length=250,
        required=False,
        allow_blank=True,
    )

    city = serializers.CharField(
        max_length=120,
    )

    postcode = serializers.CharField(
        max_length=20,
    )

    country_code = serializers.CharField(
        min_length=2,
        max_length=2,
        default="GB",
    )

    note = serializers.CharField(
        required=False,
        allow_blank=True,
        max_length=1000,
    )

    def validate_items(self, items):
        selected_products = set()

        for item in items:
            key = (
                item["artwork_id"],
                item["product_type"],
            )

            if key in selected_products:
                raise serializers.ValidationError(
                    "Duplicate cart items are not allowed."
                )

            selected_products.add(key)

        return items

    def create(self, validated_data):
        request = self.context["request"]
        user = request.user

        item_data = validated_data.pop("items")
        country_code = validated_data.pop(
            "country_code",
            "GB",
        ).upper()

        address_parts = [
            validated_data["address_line_1"],
            validated_data.get(
                "address_line_2",
                "",
            ),
            validated_data["city"],
            validated_data["postcode"],
            country_code,
        ]

        formatted_address = "\n".join(part for part in address_parts if part)

        customer_name = user.get_full_name().strip() or user.email or user.username

        with transaction.atomic():
            prepared_items = []
            total_price = Decimal("0.00")

            for item in item_data:
                try:
                    artwork = Artwork.objects.select_for_update().get(
                        pk=item["artwork_id"],
                        is_published=True,
                    )
                except Artwork.DoesNotExist:
                    raise serializers.ValidationError(
                        {
                            "items": (
                                "One of the selected artworks " "is unavailable."
                            ),
                        }
                    )

                product_type = item["product_type"]

                quantity = item["quantity"]

                if product_type == "original":
                    if quantity != 1:
                        raise serializers.ValidationError(
                            {
                                "items": (
                                    "An original artwork can " "only have quantity 1."
                                ),
                            }
                        )

                    if (
                        not artwork.original_available
                        or artwork.original_price is None
                        or artwork.sale_status != "available"
                    ):
                        raise serializers.ValidationError(
                            {
                                "items": (
                                    f'The original "{artwork.title}" '
                                    "is not available."
                                ),
                            }
                        )

                    unit_price = artwork.original_price

                    artwork.original_available = False
                    artwork.sale_status = "sold"

                    artwork.save(
                        update_fields=(
                            "original_available",
                            "sale_status",
                            "updated_at",
                        )
                    )

                else:
                    if (
                        not artwork.print_available
                        or artwork.print_price is None
                        or artwork.stock < quantity
                    ):
                        raise serializers.ValidationError(
                            {
                                "items": (
                                    f'Prints of "{artwork.title}" '
                                    "are not available in the "
                                    "requested quantity."
                                ),
                            }
                        )

                    unit_price = artwork.print_price

                    artwork.stock -= quantity

                    if artwork.stock == 0:
                        artwork.print_available = False

                    artwork.save(
                        update_fields=(
                            "stock",
                            "print_available",
                            "updated_at",
                        )
                    )

                total_price += unit_price * quantity

                prepared_items.append(
                    {
                        "artwork": artwork,
                        "product_type": (product_type),
                        "quantity": quantity,
                        "unit_price": unit_price,
                    }
                )

            order = Order.objects.create(
                customer=user,
                customer_name=customer_name,
                customer_email=user.email,
                customer_phone=validated_data.get(
                    "customer_phone",
                    "",
                ),
                address=formatted_address,
                address_line_1=validated_data["address_line_1"],
                address_line_2=validated_data.get(
                    "address_line_2",
                    "",
                ),
                city=validated_data["city"],
                postcode=validated_data["postcode"],
                country_code=country_code,
                note=validated_data.get(
                    "note",
                    "",
                ),
                status="pending",
                total_price=total_price,
                currency="GBP",
            )

            OrderItem.objects.bulk_create(
                [
                    OrderItem(
                        order=order,
                        **prepared_item,
                    )
                    for prepared_item in prepared_items
                ]
            )

        return order

    def to_representation(self, instance):
        return OrderManagementSerializer(
            instance,
            context=self.context,
        ).data
