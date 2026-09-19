from django.urls import reverse
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
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

        response = self.client.get(reverse("artwork-list"))

        self.assertEqual(response.status_code, 200)

        returned_slugs = [item["slug"] for item in response.data]

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
        paintings = Category.objects.create(name="Paintings")

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
            [item["slug"] for item in response.data],
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
            [item["slug"] for item in response.data],
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
            [item["slug"] for item in response.data],
            [newer.slug, older.slug],
        )


class ArtworkManagementAPITests(APITestCase):
    def setUp(self):
        user_model = get_user_model()

        self.regular_user = user_model.objects.create_user(
            username="regular_customer",
            email="test.customer@example.com",
            password="StrongTestPass_2026!",
            first_name="Regular",
            last_name="Customer",
        )

        self.staff_user = user_model.objects.create_user(
            username="studio_artist",
            email="khabiri.raya@gmail.com",
            password="raya1384",
            first_name="Studio",
            last_name="Artist",
            is_staff=True,
        )

        self.list_url = reverse(
            "artwork-management-list",
        )

    def test_anonymous_user_cannot_access_management_api(self):
        response = self.client.get(
            self.list_url,
        )

        self.assertEqual(
            response.status_code,
            401,
        )

    def test_regular_user_cannot_access_management_api(self):
        self.client.force_authenticate(
            user=self.regular_user,
        )

        response = self.client.get(
            self.list_url,
        )

        self.assertEqual(
            response.status_code,
            403,
        )

    def test_staff_user_can_access_management_api(self):
        Artwork.objects.create(
            title="Private studio draft",
            main_image="artworks/main/private.jpg",
            is_published=False,
        )

        self.client.force_authenticate(
            user=self.staff_user,
        )

        response = self.client.get(
            self.list_url,
        )

        self.assertEqual(
            response.status_code,
            200,
        )
