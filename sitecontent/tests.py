from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.test import APITestCase

from .models import SiteSettings


class SiteSettingsManagementAPITests(
    APITestCase,
):
    def setUp(self):
        user_model = get_user_model()

        self.regular_user = user_model.objects.create_user(
            username="site_customer",
            email="site-customer@example.com",
            password="StrongTestPassword123!",
        )

        self.staff_user = user_model.objects.create_user(
            username="site_artist",
            email="site-artist@example.com",
            password="StrongStaffPassword123!",
            is_staff=True,
        )

        self.settings = SiteSettings.objects.create(
            hero_title="EAMORA",
        )

        self.management_url = reverse(
            "site-settings-management",
        )

    def test_anonymous_user_cannot_access_management_api(
        self,
    ):
        response = self.client.get(
            self.management_url,
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
            self.management_url,
        )

        self.assertEqual(
            response.status_code,
            403,
        )

    def test_staff_user_can_access_management_api(
        self,
    ):
        self.client.force_authenticate(
            user=self.staff_user,
        )

        response = self.client.get(
            self.management_url,
        )

        self.assertEqual(
            response.status_code,
            200,
        )

        self.assertEqual(
            response.data["hero_title"],
            "EAMORA",
        )

    def test_staff_user_can_update_site_settings(
        self,
    ):
        self.client.force_authenticate(
            user=self.staff_user,
        )

        response = self.client.patch(
            self.management_url,
            {
                "hero_title": "Updated EAMORA",
                "contact_email": ("artist@example.com"),
            },
            format="multipart",
        )

        self.assertEqual(
            response.status_code,
            200,
            response.data,
        )

        self.settings.refresh_from_db()

        self.assertEqual(
            self.settings.hero_title,
            "Updated EAMORA",
        )

        self.assertEqual(
            self.settings.contact_email,
            "artist@example.com",
        )
