from rest_framework import viewsets
from .models import Artwork, Category
from .serializers import ArtworkSerializer, CategorySerializer


class ArtworkViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Artwork.objects.all()
    serializer_class = ArtworkSerializer
    lookup_field = "slug"


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    lookup_field = "slug"