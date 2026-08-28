from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import Conversation

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

        def test_unauthenticated_user_cannot_view_conversations(self):
            response = self.client.get("/api/accounts/conversations/")
            self.assertEqual(response.status_code, 401)


class ConversationAPITests(APITestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(
            username="conversation-user",
            email="conversation@example.com",
            password="StrongTestPass_2026!",
        )
        self.client.force_authenticate(user=self.user)

    def test_customer_can_create_conversation_with_initial_message(self):
        response = self.client.post(
            "/api/accounts/conversations/",
            {
                "subject": "Question about an artwork",
                "message": "Is this artwork still available?",
            },
            format="json",
        )

        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data["subject"], "Question about an artwork")
        self.assertEqual(len(response.data["messages"]), 1)
        self.assertEqual(
            response.data["messages"][0]["body"],
            "Is this artwork still available?",
        )

    def test_customer_cannot_view_another_customers_conversation(self):
        create_response = self.client.post(
            "/api/accounts/conversations/",
            {
                "subject": "Private conversation",
                "message": "This message must remain private.",
            },
            format="json",
        )
        conversation_id = create_response.data["id"]

        another_user = get_user_model().objects.create_user(
            username="another-user",
            email="another@example.com",
            password="StrongTestPass_2026!",
        )
        self.client.force_authenticate(user=another_user)

        response = self.client.get(f"/api/accounts/conversations/{conversation_id}/")

        self.assertEqual(response.status_code, 404)

    def test_staff_can_view_and_reply_to_customer_conversation(self):
        create_response = self.client.post(
            "/api/accounts/conversations/",
            {
                "subject": "Artwork availability",
                "message": "Is this artwork available?",
            },
            format="json",
        )
        conversation_id = create_response.data["id"]

        artist = get_user_model().objects.create_user(
            username="artist-admin",
            email="artist@example.com",
            password="StrongTestPass_2026!",
            is_staff=True,
        )
        self.client.force_authenticate(user=artist)

        detail_response = self.client.get(
            f"/api/accounts/conversations/{conversation_id}/"
        )
        self.assertEqual(detail_response.status_code, 200)

        reply_response = self.client.post(
            f"/api/accounts/conversations/{conversation_id}/messages/",
            {"body": "Yes, this artwork is available."},
            format="json",
        )

        self.assertEqual(reply_response.status_code, 201)
        self.assertEqual(
            reply_response.data["body"],
            "Yes, this artwork is available.",
        )
        self.assertTrue(reply_response.data["sender"]["is_staff"])

    def test_cannot_send_message_to_closed_conversation(self):
        create_response = self.client.post(
            "/api/accounts/conversations/",
            {
                "subject": "Closed conversation",
                "message": "Initial message",
            },
            format="json",
        )
        conversation_id = create_response.data["id"]

        conversation = Conversation.objects.get(id=conversation_id)
        conversation.status = Conversation.Status.CLOSED
        conversation.save(update_fields=["status"])

        response = self.client.post(
            f"/api/accounts/conversations/{conversation_id}/messages/",
            {"body": "This message should not be accepted."},
            format="json",
        )

        self.assertEqual(response.status_code, 400)

    def test_authenticated_user_can_view_current_profile(self):
        response = self.client.get("/api/accounts/me/")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["id"], self.user.id)
        self.assertFalse(response.data["is_staff"])

    def test_unauthenticated_user_cannot_view_current_profile(self):
        self.client.force_authenticate(user=None)

        response = self.client.get("/api/accounts/me/")

        self.assertEqual(response.status_code, 401)
