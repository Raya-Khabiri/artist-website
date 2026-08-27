from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

User = get_user_model()


class AccountAuthenticationTests(APITestCase):
    def setUp(self):
        self.password = "StrongTestPass_2026!"

        self.user = User.objects.create_user(
            username="existing-user",
            email="existing@example.com",
            first_name="Existing",
            last_name="User",
            password=self.password,
        )

    def test_user_can_register_with_email(self):
        response = self.client.post(
            reverse("accounts:register"),
            {
                "email": "new@example.com",
                "first_name": "New",
                "last_name": "Customer",
                "password": self.password,
                "password_confirm": self.password,
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
        )

        user = User.objects.get(
            email="new@example.com",
        )

        self.assertTrue(
            user.check_password(self.password),
        )

        self.assertNotIn(
            "password",
            response.data,
        )

    def test_duplicate_email_is_rejected(self):
        response = self.client.post(
            reverse("accounts:register"),
            {
                "email": "EXISTING@example.com",
                "first_name": "Duplicate",
                "last_name": "User",
                "password": self.password,
                "password_confirm": self.password,
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

    def test_user_can_login_with_email(self):
        response = self.client.post(
            reverse("accounts:login"),
            {
                "email": self.user.email,
                "password": self.password,
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

        self.assertIn(
            "access",
            response.data,
        )

        self.assertIn(
            "refresh",
            response.data,
        )

        self.assertEqual(
            response.data["user"]["email"],
            self.user.email,
        )

    def test_invalid_password_is_rejected(self):
        response = self.client.post(
            reverse("accounts:login"),
            {
                "email": self.user.email,
                "password": "WrongPassword_2026!",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_401_UNAUTHORIZED,
        )
