from django.db import models
from django.utils.text import slugify


class Category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(
        max_length=120,
        unique=True,
        blank=True,
    )

    class Meta:
        verbose_name_plural = "Categories"
        ordering = ["name"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)

        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Technique(models.Model):
    name = models.CharField(
        max_length=100,
        unique=True,
    )

    slug = models.SlugField(
        max_length=120,
        unique=True,
        blank=True,
    )

    class Meta:
        ordering = ["name"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)

        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Artwork(models.Model):
    class SaleStatus(models.TextChoices):
        AVAILABLE = "available", "Available"
        SOLD = "sold", "Sold"
        RESERVED = "reserved", "Reserved"
        NOT_FOR_SALE = "not_for_sale", "Not for sale"

    title = models.CharField(max_length=200)

    slug = models.SlugField(
        max_length=220,
        unique=True,
        blank=True,
    )

    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="artworks",
    )

    technique = models.ForeignKey(
        Technique,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="artworks",
    )

    short_description = models.CharField(
        max_length=300,
        blank=True,
        help_text="Short text used on gallery cards.",
    )

    description = models.TextField(blank=True)

    main_image = models.ImageField(
        upload_to="artworks/main/",
    )

    main_image_alt = models.CharField(
        max_length=200,
        blank=True,
        help_text="Describe the artwork for accessibility and SEO.",
    )

    original_price = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        null=True,
        blank=True,
    )

    print_price = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        null=True,
        blank=True,
    )

    currency = models.CharField(
        max_length=3,
        default="GBP",
    )

    show_price = models.BooleanField(
        default=True,
        help_text="Disable this to hide prices from the public website.",
    )

    sale_status = models.CharField(
        max_length=20,
        choices=SaleStatus.choices,
        default=SaleStatus.AVAILABLE,
    )

    original_available = models.BooleanField(default=True)
    print_available = models.BooleanField(default=True)

    stock = models.PositiveIntegerField(default=1)

    size = models.CharField(
        max_length=100,
        blank=True,
    )

    width_mm = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="Artwork width in millimetres.",
    )

    height_mm = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="Artwork height in millimetres.",
    )

    medium = models.CharField(
        max_length=100,
        blank=True,
    )

    year = models.PositiveIntegerField(
        null=True,
        blank=True,
    )

    is_featured = models.BooleanField(default=False)

    is_published = models.BooleanField(
        default=True,
        help_text="Only published artworks appear on the website.",
    )

    display_order = models.PositiveIntegerField(
        default=0,
        help_text="Lower numbers appear first.",
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = [
            "display_order",
            "-created_at",
        ]

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.title) or "artwork"
            slug = base_slug
            counter = 1

            while Artwork.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1

            self.slug = slug

        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


class ArtworkImage(models.Model):
    artwork = models.ForeignKey(
        Artwork,
        related_name="images",
        on_delete=models.CASCADE,
    )

    image = models.ImageField(
        upload_to="artworks/gallery/",
    )

    alt_text = models.CharField(
        max_length=200,
        blank=True,
    )

    display_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["display_order", "id"]

    def __str__(self):
        return f"Image for {self.artwork.title}"
