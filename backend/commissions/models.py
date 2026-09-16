from django.db import models

# Create your models here.
class CommissionRequest(models.Model):
    STATUS_CHOICES = [
        ("new", "New"),
        ("reviewing", "Reviewing"),
        ("accepted", "Accepted"),
        ("declined", "Declined"),
        ("completed", "Completed"),
    ]

    customer_name = models.CharField(max_length=150)
    email = models.EmailField()
    phone = models.CharField(max_length=30, blank=True)

    subject = models.CharField(max_length=200)
    description = models.TextField()

    preferred_size = models.CharField(max_length=100, blank=True)
    preferred_medium = models.CharField(max_length=100, blank=True)

    budget = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
    )

    deadline = models.DateField(null=True, blank=True)

    reference_image = models.ImageField(
        upload_to="commissions/references/",
        null=True,
        blank=True,
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="new",
    )

    created_at = models.DateTimeField(auto_now_add=True)