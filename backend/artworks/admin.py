from django.contrib import admin

from .models import Artwork, ArtworkImage, Technique

from django import forms


class ArtworkImageInline(admin.TabularInline):
    model = ArtworkImage
    extra = 1

    fields = (
        "image",
        "alt_text",
        "display_order",
    )

    ordering = ("display_order",)


@admin.register(Technique)
class TechniqueAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "slug",
    )

    search_fields = ("name",)

    prepopulated_fields = {
        "slug": ("name",),
    }


class ArtworkAdminForm(forms.ModelForm):
    class Meta:
        model = Artwork
        fields = "__all__"

    def clean(self):
        cleaned_data = super().clean()

        sale_status = cleaned_data.get("sale_status")
        original_available = cleaned_data.get("original_available")
        print_available = cleaned_data.get("print_available")
        stock = cleaned_data.get("stock")
        original_price = cleaned_data.get("original_price")
        print_price = cleaned_data.get("print_price")

        if sale_status == Artwork.SaleStatus.SOLD and original_available:
            self.add_error(
                "original_available",
                "A sold original cannot be marked as available.",
            )

        if original_available and stock == 0:
            self.add_error(
                "stock",
                "Stock must be at least 1 when the original is available.",
            )

        if original_available and original_price is None:
            self.add_error(
                "original_price",
                "Enter an original price when the original is available.",
            )

        if print_available and print_price is None:
            self.add_error(
                "print_price",
                "Enter a print price when prints are available.",
            )

        return cleaned_data


@admin.register(Artwork)
class ArtworkAdmin(admin.ModelAdmin):
    form = ArtworkAdminForm

    list_display = (
        "title",
        "technique",
        "sale_status",
        "original_price",
        "currency",
        "stock",
        "is_featured",
        "is_published",
        "display_order",
        "updated_at",
    )

    list_filter = (
        "sale_status",
        "technique",
        "is_featured",
        "is_published",
        "original_available",
        "print_available",
        "currency",
        "year",
    )

    search_fields = (
        "title",
        "short_description",
        "description",
        "medium",
        "size",
        "technique__name",
    )

    readonly_fields = (
        "created_at",
        "updated_at",
    )

    prepopulated_fields = {
        "slug": ("title",),
    }

    ordering = (
        "display_order",
        "-created_at",
    )

    list_editable = (
        "sale_status",
        "stock",
        "is_featured",
        "is_published",
        "display_order",
    )

    fieldsets = (
        (
            "Basic information",
            {
                "fields": (
                    "title",
                    "slug",
                    "short_description",
                    "description",
                ),
            },
        ),
        (
            "Artwork image",
            {
                "fields": (
                    "main_image",
                    "main_image_alt",
                ),
            },
        ),
        (
            "Artwork details",
            {
                "fields": (
                    "year",
                    "technique",
                    "size",
                    "width_mm",
                    "height_mm",
                ),
            },
        ),
        (
            "Pricing",
            {
                "fields": (
                    "original_price",
                    "print_price",
                    "currency",
                    "show_price",
                ),
            },
        ),
        (
            "Availability",
            {
                "fields": (
                    "sale_status",
                    "original_available",
                    "print_available",
                    "stock",
                ),
            },
        ),
        (
            "Website display",
            {
                "fields": (
                    "is_featured",
                    "is_published",
                    "display_order",
                ),
            },
        ),
        (
            "System information",
            {
                "classes": ("collapse",),
                "fields": (
                    "created_at",
                    "updated_at",
                ),
            },
        ),
    )

    inlines = [
        ArtworkImageInline,
    ]
