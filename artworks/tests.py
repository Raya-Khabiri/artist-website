from io import BytesIO

from PIL import Image
import base64

from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import (
    SimpleUploadedFile,
)
from django.urls import reverse
from rest_framework.test import APITestCase

from .models import (
    Artwork,
    ArtworkImage,
    Category,
    Technique,
)


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
            "currency": "GBP",
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

        self.assertEqual(
            response.status_code,
            200,
        )

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
                kwargs={
                    "slug": draft.slug,
                },
            )
        )

        self.assertEqual(
            response.status_code,
            404,
        )

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
            {
                "category": paintings.slug,
            },
        )

        self.assertEqual(
            response.status_code,
            200,
        )

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
            {
                "available": "true",
            },
        )

        self.assertEqual(
            response.status_code,
            200,
        )

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
            {
                "ordering": "year_desc",
            },
        )

        self.assertEqual(
            response.status_code,
            200,
        )

        self.assertEqual(
            [item["slug"] for item in response.data],
            [
                newer.slug,
                older.slug,
            ],
        )


class ArtworkManagementAPITests(APITestCase):
    def setUp(self):
        user_model = get_user_model()

        self.regular_user = user_model.objects.create_user(
            username="regular_customer",
            email="customer@example.com",
            password="StrongTestPassword123!",
            first_name="Regular",
            last_name="Customer",
        )

        self.staff_user = user_model.objects.create_user(
            username="studio_artist",
            email="artist@example.com",
            password="StrongStaffPassword123!",
            first_name="Studio",
            last_name="Artist",
            is_staff=True,
        )

        self.list_url = reverse(
            "artwork-management-list",
        )

    def test_anonymous_user_cannot_access_management_api(
        self,
    ):
        response = self.client.get(
            self.list_url,
        )

        self.assertEqual(
            response.status_code,
            401,
        )

    def test_regular_user_cannot_access_management_api(
        self,
    ):
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

    def test_staff_user_can_access_management_api(
        self,
    ):
        Artwork.objects.create(
            title="Private studio draft",
            main_image="artworks/main/private.jpg",
            is_published=False,
            currency="GBP",
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

    def test_staff_can_create_artwork_with_typed_technique(
        self,
    ):
        self.client.force_authenticate(
            user=self.staff_user,
        )

        image_content = base64.b64decode(
            "R0lGODlhAQABAIAAAAAAAP///" "ywAAAAAAQABAAACAUwAOw=="
        )

        image = SimpleUploadedFile(
            name="test-artwork.gif",
            content=image_content,
            content_type="image/gif",
        )

        response = self.client.post(
            self.list_url,
            {
                "title": "Typed technique artwork",
                "main_image": image,
                "technique_name": ("  Acrylic   on canvas  "),
                "currency": "GBP",
                "is_published": False,
            },
            format="multipart",
        )

        self.assertEqual(
            response.status_code,
            201,
            response.data,
        )

        artwork = Artwork.objects.get(
            title="Typed technique artwork",
        )

        self.assertIsNotNone(
            artwork.technique,
        )

        self.assertEqual(
            artwork.technique.name,
            "Acrylic on canvas",
        )

        self.assertEqual(
            Technique.objects.filter(
                name__iexact="Acrylic on canvas",
            ).count(),
            1,
        )


class ArtworkImageManagementAPITests(
    APITestCase,
):
    def setUp(self):
        user_model = get_user_model()

        self.regular_user = user_model.objects.create_user(
            username="image_customer",
            email="image-customer@example.com",
            password="StrongTestPassword123!",
        )

        self.staff_user = user_model.objects.create_user(
            username="image_artist",
            email="image-artist@example.com",
            password="StrongStaffPassword123!",
            is_staff=True,
        )

        self.artwork = Artwork.objects.create(
            title="Artwork with gallery",
            main_image="artworks/main/gallery-test.jpg",
            is_published=False,
            currency="GBP",
        )

        self.list_url = reverse(
            "artwork-image-management-list",
        )

    def create_test_image(self):
        image_buffer = BytesIO()

        Image.new(
            mode="RGB",
            size=(2, 2),
            color=(155, 28, 28),
        ).save(
            image_buffer,
            format="PNG",
        )

        image_buffer.seek(0)

        return SimpleUploadedFile(
            name="gallery-image.png",
            content=image_buffer.read(),
            content_type="image/png",
        )

    def test_anonymous_user_cannot_access_images(
        self,
    ):
        response = self.client.get(
            self.list_url,
        )

        self.assertEqual(
            response.status_code,
            401,
        )

    def test_regular_user_cannot_access_images(
        self,
    ):
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

    def test_staff_can_upload_gallery_image(
        self,
    ):
        self.client.force_authenticate(
            user=self.staff_user,
        )

        response = self.client.post(
            self.list_url,
            {
                "artwork": self.artwork.id,
                "image": self.create_test_image(),
                "alt_text": "Detailed artwork view",
                "display_order": 1,
            },
            format="multipart",
        )

        self.assertEqual(
            response.status_code,
            201,
            response.data,
        )

        gallery_image = ArtworkImage.objects.get(
            artwork=self.artwork,
        )

        self.assertEqual(
            gallery_image.alt_text,
            "Detailed artwork view",
        )

        self.assertEqual(
            gallery_image.display_order,
            1,
        )

    def test_staff_can_filter_images_by_artwork(
        self,
    ):
        other_artwork = Artwork.objects.create(
            title="Other artwork",
            main_image="artworks/main/other.jpg",
            is_published=False,
            currency="GBP",
        )

        selected_image = ArtworkImage.objects.create(
            artwork=self.artwork,
            image="artworks/gallery/selected.jpg",
            alt_text="Selected image",
        )

        ArtworkImage.objects.create(
            artwork=other_artwork,
            image="artworks/gallery/other.jpg",
            alt_text="Other image",
        )

        self.client.force_authenticate(
            user=self.staff_user,
        )

        response = self.client.get(
            self.list_url,
            {
                "artwork": self.artwork.id,
            },
        )

        self.assertEqual(
            response.status_code,
            200,
        )

        self.assertEqual(
            [item["id"] for item in response.data],
            [selected_image.id],
        )
