from rest_framework import serializers
from .models import Artwork, Category, ArtworkImage


class ArtworkImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ArtworkImage
        fields = ["id", "image", "alt_text"]


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name", "slug"]


class ArtworkSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    images = ArtworkImageSerializer(many=True, read_only=True)

    class Meta:
        model = Artwork
        fields = "__all__"