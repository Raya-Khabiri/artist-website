from django.urls import reverse
from rest_framework.test import APITestCase

from .models import Artwork, Category


class PublicArtworkAPITests(APITestCase):
    def create_artwork(self, **overrides):
        values = {
            "title": "Published artwork",
            "main_image": "artworks/main/test.jpg",
            "is_published": True,
            "original_available": True,
            "print_available": False,
            "stock": 1,
            "original_price": "100.00",
            "year": 2025,
        }

        values.update(overrides)

        return Artwork.objects.create(**values)

    def test_unpublished_artworks_are_hidden(self):
        published = self.create_artwork()

        self.create_artwork(
            title="Private draft",
            is_published=False,
        )

        response = self.client.get(
            reverse("artwork-list")
        )

        self.assertEqual(response.status_code, 200)

        returned_slugs = [
            item["slug"]
            for item in response.data
        ]

        self.assertEqual(
            returned_slugs,
            [published.slug],
        )

    def test_unpublished_artwork_detail_returns_404(self):
        draft = self.create_artwork(
            title="Private detail",
            is_published=False,
        )

        response = self.client.get(
            reverse(
                "artwork-detail",
                kwargs={"slug": draft.slug},
            )
        )

        self.assertEqual(response.status_code, 404)

    def test_category_filter(self):
        paintings = Category.objects.create(
            name="Paintings"
        )

        selected = self.create_artwork(
            title="Selected painting",
            category=paintings,
        )

        self.create_artwork(
            title="Uncategorised work",
        )

        response = self.client.get(
            reverse("artwork-list"),
            {"category": paintings.slug},
        )

        self.assertEqual(response.status_code, 200)

        self.assertEqual(
            [
                item["slug"]
                for item in response.data
            ],
            [selected.slug],
        )

    def test_available_filter(self):
        available = self.create_artwork(
            title="Available original",
        )

        self.create_artwork(
            title="Unavailable original",
            original_available=False,
            print_available=False,
            stock=0,
        )

        response = self.client.get(
            reverse("artwork-list"),
            {"available": "true"},
        )

        self.assertEqual(response.status_code, 200)

        self.assertEqual(
            [
                item["slug"]
                for item in response.data
            ],
            [available.slug],
        )

    def test_year_desc_ordering(self):
        older = self.create_artwork(
            title="Older work",
            year=2020,
        )

        newer = self.create_artwork(
            title="Newer work",
            year=2026,
        )

        response = self.client.get(
            reverse("artwork-list"),
            {"ordering": "year_desc"},
        )

        self.assertEqual(response.status_code, 200)

        self.assertEqual(
            [
                item["slug"]
                for item in response.data
            ],
            [newer.slug, older.slug],
        )