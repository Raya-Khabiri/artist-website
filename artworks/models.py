from django.db import models
from django.utils.text import slugify


class Category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=120, unique=True, blank=True)

    class Meta:
        verbose_name_plural = "Categories"

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Artwork(models.Model):
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, unique=True, blank=True)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True)

    description = models.TextField()
    main_image = models.ImageField(upload_to="artworks/main/")

    original_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    print_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    original_available = models.BooleanField(default=True)
    print_available = models.BooleanField(default=True)

    stock = models.PositiveIntegerField(default=1)

    size = models.CharField(max_length=100, blank=True)
    medium = models.CharField(max_length=100, blank=True)
    year = models.PositiveIntegerField(null=True, blank=True)

    is_featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


class ArtworkImage(models.Model):
    artwork = models.ForeignKey(Artwork, related_name="images", on_delete=models.CASCADE)
    image = models.ImageField(upload_to="artworks/gallery/")
    alt_text = models.CharField(max_length=200, blank=True)

    def __str__(self):
        return f"Image for {self.artwork.title}"