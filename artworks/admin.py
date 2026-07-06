from django.contrib import admin
from .models import Artwork, Category, ArtworkImage


class ArtworkImageInline(admin.TabularInline):
    model = ArtworkImage
    extra = 1


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "slug")
    prepopulated_fields = {"slug": ("name",)}


@admin.register(Artwork)
class ArtworkAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "category",
        "original_price",
        "print_price",
        "stock",
        "original_available",
        "print_available",
        "is_featured",
        "created_at",
    )
    search_fields = ("title", "description")
    list_filter = ("category", "original_available", "print_available", "is_featured")
    prepopulated_fields = {"slug": ("title",)}
    inlines = [ArtworkImageInline]


@admin.register(ArtworkImage)
class ArtworkImageAdmin(admin.ModelAdmin):
    list_display = ("artwork", "alt_text")