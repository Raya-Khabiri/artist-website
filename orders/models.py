from django.db import models
from artworks.models import Artwork
from uuid import uuid4

from django.conf import settings
from django.db import models

from artworks.models import Artwork


class Order(models.Model):
    reference = models.UUIDField(
        default=uuid4,
        editable=False,
        unique=True,
    )

    customer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="orders",
        on_delete=models.PROTECT,
        blank=True,
        null=True,
    )

    customer_name = models.CharField(max_length=150)
    customer_email = models.EmailField()
    customer_phone = models.CharField(max_length=30, blank=True)

    address = models.TextField(blank=True)

    address_line_1 = models.CharField(
        max_length=250,
        blank=True,
    )

    address_line_2 = models.CharField(
        max_length=250,
        blank=True,
    )

    city = models.CharField(
        max_length=120,
        blank=True,
    )

    postcode = models.CharField(
        max_length=20,
        blank=True,
    )

    country_code = models.CharField(
        max_length=2,
        default="GB",
    )
    note = models.TextField(blank=True)

    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("paid", "Paid"),
        ("processing", "Processing"),
        ("shipped", "Shipped"),
        ("completed", "Completed"),
        ("cancelled", "Cancelled"),
    ]

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="pending",
    )

    total_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0,
    )

    currency = models.CharField(
        max_length=3,
        default="GBP",
    )

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    class Meta:
        ordering = ("-created_at",)

    def __str__(self):
        return f"Order {self.reference}"


class OrderItem(models.Model):
    TYPE_CHOICES = [
        ("original", "Original"),
        ("print", "Print"),
    ]

    order = models.ForeignKey(
        Order,
        related_name="items",
        on_delete=models.CASCADE,
    )

    artwork = models.ForeignKey(
        Artwork,
        on_delete=models.PROTECT,
    )

    product_type = models.CharField(
        max_length=20,
        choices=TYPE_CHOICES,
    )

    quantity = models.PositiveIntegerField(default=1)

    unit_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
    )
