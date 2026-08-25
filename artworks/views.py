from django.db.models import (
    DecimalField,
    ExpressionWrapper,
    F,
    Q,
)
from rest_framework import viewsets

from .models import Artwork, Category, Technique
from .serializers import (
    ArtworkSerializer,
    CategorySerializer,
    TechniqueSerializer,
)


class ArtworkViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ArtworkSerializer
    lookup_field = "slug"

    def get_queryset(self):
        queryset = (
            Artwork.objects.select_related(
                "category",
                "technique",
            )
            .prefetch_related("images")
            .filter(is_published=True)
            .annotate(
                size_area=ExpressionWrapper(
                    F("width_mm") * F("height_mm"),
                    output_field=DecimalField(
                        max_digits=20,
                        decimal_places=4,
                    ),
                )
            )
        )

        category = self.request.query_params.get("category")
        technique = self.request.query_params.get("technique")
        featured = self.request.query_params.get("featured")
        available = self.request.query_params.get("available")
        ordering = self.request.query_params.get("ordering")

        if category:
            queryset = queryset.filter(
                category__slug=category,
            )

        if technique:
            queryset = queryset.filter(
                technique__slug=technique,
            )

        if featured == "true":
            queryset = queryset.filter(
                is_featured=True,
            )

        if available == "true":
            queryset = queryset.filter(
                Q(original_available=True) | Q(print_available=True)
            )

        allowed_orderings = {
            "newest": "-created_at",
            "oldest": "created_at",
            "year_desc": "-year",
            "year_asc": "year",
            "price_asc": "original_price",
            "price_desc": "-original_price",
            "size_asc": F("size_area").asc(
                nulls_last=True,
            ),
            "size_desc": F("size_area").desc(
                nulls_last=True,
            ),
        }

        if ordering in allowed_orderings:
            queryset = queryset.order_by(
                allowed_orderings[ordering],
                "display_order",
                "id",
            )

        return queryset


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    lookup_field = "slug"


class TechniqueViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Technique.objects.all()
    serializer_class = TechniqueSerializer
    lookup_field = "slug"
