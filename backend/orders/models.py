from django.db import models
from artworks.models import Artwork


class Order(models.Model):
    customer_name = models.CharField(max_length=150)
    customer_email = models.EmailField()
    customer_phone = models.CharField(max_length=30, blank=True)

    address = models.TextField(blank=True)
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

    created_at = models.DateTimeField(auto_now_add=True)


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