from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import Conversation, Message

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

        self.assertEqual(
            response.data["user"]["full_name"],
            "Existing User",
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

    def test_staff_unread_count_only_includes_customer_messages(self):
        create_response = self.client.post(
            "/api/accounts/conversations/",
            {
                "subject": "Unread notification",
                "message": "A new customer message.",
            },
            format="json",
        )

        conversation_id = create_response.data["id"]

        artist = User.objects.create_user(
            username="notification-artist",
            email="notification-artist@example.com",
            password="StrongTestPass_2026!",
            is_staff=True,
        )

        self.client.force_authenticate(
            user=artist,
        )

        self.client.post(
            f"/api/accounts/conversations/{conversation_id}/messages/",
            {
                "body": "Artist response",
            },
            format="json",
        )

        response = self.client.get(
            "/api/accounts/messages/unread-count/",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

        self.assertEqual(
            response.data["unread_count"],
            1,
        )

    def test_opening_conversation_marks_other_users_messages_as_read(self):
        create_response = self.client.post(
            "/api/accounts/conversations/",
            {
                "subject": "Read notification",
                "message": "Please read this message.",
            },
            format="json",
        )

        conversation_id = create_response.data["id"]

        customer_message = Message.objects.get(
            conversation_id=conversation_id,
            sender=self.user,
        )

        self.assertIsNone(
            customer_message.read_at,
        )

        artist = User.objects.create_user(
            username="reading-artist",
            email="reading-artist@example.com",
            password="StrongTestPass_2026!",
            is_staff=True,
        )

        self.client.force_authenticate(
            user=artist,
        )

        response = self.client.get(
            f"/api/accounts/conversations/{conversation_id}/",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

        customer_message.refresh_from_db()

        self.assertIsNotNone(
            customer_message.read_at,
        )

        unread_response = self.client.get(
            "/api/accounts/messages/unread-count/",
        )

        self.assertEqual(
            unread_response.data["unread_count"],
            0,
        )

    def test_customer_details_are_only_visible_to_staff(self):
        self.user.first_name = "Raya"
        self.user.last_name = "Customer"
        self.user.save(
            update_fields=[
                "first_name",
                "last_name",
            ]
        )

        create_response = self.client.post(
            "/api/accounts/conversations/",
            {
                "subject": "Private customer details",
                "message": "Please keep my details private.",
            },
            format="json",
        )

        conversation_id = create_response.data["id"]

        customer_response = self.client.get(
            f"/api/accounts/conversations/{conversation_id}/"
        )

        self.assertEqual(
            customer_response.status_code,
            200,
        )
        self.assertNotIn(
            "email",
            customer_response.data["customer"],
        )
        self.assertNotIn(
            "first_name",
            customer_response.data["customer"],
        )
        self.assertNotIn(
            "last_name",
            customer_response.data["customer"],
        )

        artist = User.objects.create_user(
            username="details-artist",
            email="artist-details@example.com",
            password="StrongTestPass_2026!",
            is_staff=True,
        )

        self.client.force_authenticate(
            user=artist,
        )

        artist_response = self.client.get(
            f"/api/accounts/conversations/{conversation_id}/"
        )

        self.assertEqual(
            artist_response.status_code,
            200,
        )
        self.assertEqual(
            artist_response.data["customer"]["first_name"],
            "Raya",
        )
        self.assertEqual(
            artist_response.data["customer"]["last_name"],
            "Customer",
        )
        self.assertEqual(
            artist_response.data["customer"]["email"],
            self.user.email,
        )
