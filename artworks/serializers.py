from rest_framework import serializers
from .models import Artwork, Category, ArtworkImage, Technique


class ArtworkImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ArtworkImage
        fields = ["id", "image", "alt_text"]


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name", "slug"]


class TechniqueSerializer(serializers.ModelSerializer):
    class Meta:
        model = Technique
        fields = [
            "id",
            "name",
            "slug",
        ]


class ArtworkSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    technique = TechniqueSerializer(read_only=True)
    images = ArtworkImageSerializer(many=True, read_only=True)

    class Meta:
        model = Artwork
        fields = "__all__"


class ArtworkManagementSerializer(serializers.ModelSerializer):
    images = ArtworkImageSerializer(
        many=True,
        read_only=True,
    )

    technique_name = serializers.CharField(
        write_only=True,
        required=False,
        allow_blank=True,
        max_length=100,
    )

    technique_display = serializers.CharField(
        source="technique.name",
        read_only=True,
        default="",
    )

    class Meta:
        model = Artwork
        fields = "__all__"
        read_only_fields = (
            "created_at",
            "updated_at",
        )

    def get_or_create_technique(self, name):
        normalised_name = " ".join(name.strip().split())

        if not normalised_name:
            return None

        existing_technique = Technique.objects.filter(
            name__iexact=normalised_name,
        ).first()

        if existing_technique:
            return existing_technique

        return Technique.objects.create(
            name=normalised_name,
        )

    def create(self, validated_data):
        technique_name = validated_data.pop(
            "technique_name",
            "",
        )

        if technique_name:
            validated_data["technique"] = self.get_or_create_technique(
                technique_name,
            )

        return super().create(validated_data)

    def update(self, instance, validated_data):
        if "technique_name" in validated_data:
            technique_name = validated_data.pop(
                "technique_name",
            )

            validated_data["technique"] = self.get_or_create_technique(
                technique_name,
            )

        return super().update(
            instance,
            validated_data,
        )
