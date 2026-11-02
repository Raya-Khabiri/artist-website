from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.test import APITestCase

from artworks.models import Artwork

from .models import Order, OrderItem

from unittest.mock import Mock, patch


class OrderManagementAPITests(
    APITestCase,
):
    def setUp(self):
        user_model = get_user_model()

        self.customer = user_model.objects.create_user(
            username="order_customer",
            email="customer@example.com",
            password="StrongTestPassword123!",
            first_name="Test",
            last_name="Customer",
        )

        self.staff_user = user_model.objects.create_user(
            username="order_artist",
            email="artist@example.com",
            password="StrongStaffPassword123!",
            is_staff=True,
        )

        self.artwork = Artwork.objects.create(
            title="Ordered artwork",
            main_image=("artworks/main/ordered.jpg"),
            original_price="500.00",
            currency="GBP",
            is_published=True,
        )

        self.order = Order.objects.create(
            customer=self.customer,
            customer_name="Test Customer",
            customer_email=("customer@example.com"),
            address="10 Test Street, London",
            status="paid",
            total_price="500.00",
            currency="GBP",
        )

        OrderItem.objects.create(
            order=self.order,
            artwork=self.artwork,
            product_type="original",
            quantity=1,
            unit_price="500.00",
        )

        self.list_url = reverse(
            "order-management-list",
        )

        self.detail_url = reverse(
            "order-management-detail",
            kwargs={
                "pk": self.order.pk,
            },
        )

    def test_anonymous_user_cannot_access_orders(
        self,
    ):
        response = self.client.get(
            self.list_url,
        )

        self.assertEqual(
            response.status_code,
            401,
        )

    def test_regular_user_cannot_access_orders(
        self,
    ):
        self.client.force_authenticate(
            user=self.customer,
        )

        response = self.client.get(
            self.list_url,
        )

        self.assertEqual(
            response.status_code,
            403,
        )

    def test_staff_user_can_view_orders(
        self,
    ):
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

        self.assertEqual(
            len(response.data),
            1,
        )

        self.assertEqual(
            response.data[0]["customer_email"],
            "customer@example.com",
        )

        self.assertEqual(
            len(response.data[0]["items"]),
            1,
        )

    def test_staff_user_can_update_only_status(
        self,
    ):
        self.client.force_authenticate(
            user=self.staff_user,
        )

        response = self.client.patch(
            self.detail_url,
            {
                "status": "processing",
                "total_price": "1.00",
                "customer_email": ("changed@example.com"),
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            200,
            response.data,
        )

        self.order.refresh_from_db()

        self.assertEqual(
            self.order.status,
            "processing",
        )

        self.assertEqual(
            str(self.order.total_price),
            "500.00",
        )

        self.assertEqual(
            self.order.customer_email,
            "customer@example.com",
        )

    def test_order_cannot_be_deleted_from_api(
        self,
    ):
        self.client.force_authenticate(
            user=self.staff_user,
        )

        response = self.client.delete(
            self.detail_url,
        )

        self.assertEqual(
            response.status_code,
            405,
        )

        self.assertTrue(
            Order.objects.filter(
                pk=self.order.pk,
            ).exists()
        )


class CheckoutAPITests(APITestCase):
    def setUp(self):
        user_model = get_user_model()

        self.customer = user_model.objects.create_user(
            username="checkout_customer",
            email="buyer@example.com",
            password="StrongTestPassword123!",
            first_name="Checkout",
            last_name="Customer",
        )

        self.checkout_url = reverse(
            "checkout-create",
        )

    def create_artwork(self, **overrides):
        values = {
            "title": "Checkout artwork",
            "main_image": ("artworks/main/checkout.jpg"),
            "is_published": True,
            "sale_status": "available",
            "original_available": True,
            "print_available": False,
            "original_price": "750.00",
            "currency": "GBP",
            "stock": 1,
        }

        values.update(overrides)

        return Artwork.objects.create(**values)

    def checkout_payload(
        self,
        artwork,
        product_type="original",
        quantity=1,
    ):
        return {
            "items": [
                {
                    "artwork_id": artwork.id,
                    "product_type": product_type,
                    "quantity": quantity,
                },
            ],
            "customer_email": "buyer@example.com",
            "customer_phone": "",
            "address_line_1": "10 Test Street",
            "address_line_2": "",
            "city": "London",
            "postcode": "SW1A 1AA",
            "country_code": "GB",
            "note": "Please handle with care.",
            "total_price": "1.00",
        }

    def test_anonymous_user_cannot_checkout(
        self,
    ):
        artwork = self.create_artwork()

        response = self.client.post(
            self.checkout_url,
            self.checkout_payload(artwork),
            format="json",
        )

        self.assertEqual(
            response.status_code,
            401,
        )

        self.assertEqual(
            Order.objects.count(),
            0,
        )

    @patch("orders.views.create_checkout_session")
    def test_authenticated_user_can_order_original(
        self,
        create_checkout_session_mock,
    ):
        checkout_session = Mock()
        checkout_session.id = "cs_test_original"
        checkout_session.url = "https://checkout.stripe.com/test"

        create_checkout_session_mock.return_value = checkout_session

        artwork = self.create_artwork()

        self.client.force_authenticate(
            user=self.customer,
        )

        response = self.client.post(
            self.checkout_url,
            self.checkout_payload(artwork),
            format="json",
        )

        self.assertEqual(
            response.status_code,
            201,
            response.data,
        )

        self.assertEqual(
            response.data["checkout_url"],
            "https://checkout.stripe.com/test",
        )

        order = Order.objects.get()

        self.assertEqual(
            order.customer,
            self.customer,
        )

        self.assertEqual(
            order.customer_email,
            "buyer@example.com",
        )

        self.assertEqual(
            str(order.total_price),
            "750.00",
        )

        self.assertEqual(
            order.currency,
            "GBP",
        )

        self.assertEqual(
            order.status,
            "pending",
        )

        artwork.refresh_from_db()

        self.assertFalse(
            artwork.original_available,
        )

        self.assertEqual(
            artwork.sale_status,
            "sold",
        )

    def test_original_quantity_must_be_one(
        self,
    ):
        artwork = self.create_artwork()

        self.client.force_authenticate(
            user=self.customer,
        )

        response = self.client.post(
            self.checkout_url,
            self.checkout_payload(
                artwork,
                quantity=2,
            ),
            format="json",
        )

        self.assertEqual(
            response.status_code,
            400,
        )

        self.assertEqual(
            Order.objects.count(),
            0,
        )

        artwork.refresh_from_db()

        self.assertTrue(
            artwork.original_available,
        )

    @patch("orders.views.create_checkout_session")
    def test_print_order_uses_server_price_and_stock(
        self,
        create_checkout_session_mock,
    ):
        checkout_session = Mock()
        checkout_session.id = "cs_test_print"
        checkout_session.url = "https://checkout.stripe.com/test"

        create_checkout_session_mock.return_value = checkout_session

        artwork = self.create_artwork(
            title="Available print",
            original_available=False,
            original_price=None,
            print_available=True,
            print_price="25.00",
            stock=5,
        )

        self.client.force_authenticate(
            user=self.customer,
        )

        response = self.client.post(
            self.checkout_url,
            self.checkout_payload(
                artwork,
                product_type="print",
                quantity=2,
            ),
            format="json",
        )

        self.assertEqual(
            response.status_code,
            201,
            response.data,
        )

        self.assertEqual(
            response.data["checkout_url"],
            "https://checkout.stripe.com/test",
        )

        order = Order.objects.get()

        self.assertEqual(
            str(order.total_price),
            "50.00",
        )

        item = order.items.get()

        self.assertEqual(
            item.quantity,
            2,
        )

        self.assertEqual(
            str(item.unit_price),
            "25.00",
        )

        artwork.refresh_from_db()

        self.assertEqual(
            artwork.stock,
            3,
        )

    @patch("orders.views.retrieve_checkout_session")
    def test_customer_can_confirm_paid_checkout(
        self,
        retrieve_session_mock,
    ):
        artwork = self.create_artwork()

        order = Order.objects.create(
            customer=self.customer,
            customer_name="Checkout Customer",
            customer_email=self.customer.email,
            address="10 Test Street",
            status="pending",
            total_price="750.00",
            currency="GBP",
            stripe_checkout_session_id=("cs_test_paid"),
        )

        OrderItem.objects.create(
            order=order,
            artwork=artwork,
            product_type="original",
            quantity=1,
            unit_price="750.00",
        )

        retrieve_session_mock.return_value = {
            "id": "cs_test_paid",
            "payment_status": "paid",
            "amount_total": 75000,
            "currency": "gbp",
            "payment_intent": "pi_test_paid",
            "metadata": {
                "order_id": str(order.pk),
            },
        }

        self.client.force_authenticate(
            user=self.customer,
        )

        response = self.client.get(
            reverse(
                "checkout-confirm",
            ),
            {
                "session_id": ("cs_test_paid"),
            },
        )

        self.assertEqual(
            response.status_code,
            200,
            response.data,
        )

        self.assertEqual(
            response.data["payment_status"],
            "paid",
        )

        order.refresh_from_db()

        self.assertEqual(
            order.status,
            "paid",
        )

        self.assertEqual(
            order.stripe_payment_intent_id,
            "pi_test_paid",
        )

        self.assertIsNotNone(
            order.paid_at,
        )

    @patch("orders.views.retrieve_checkout_session")
    def test_checkout_confirmation_rejects_wrong_amount(
        self,
        retrieve_session_mock,
    ):
        artwork = self.create_artwork()

        order = Order.objects.create(
            customer=self.customer,
            customer_name="Checkout Customer",
            customer_email=self.customer.email,
            address="10 Test Street",
            status="pending",
            total_price="750.00",
            currency="GBP",
            stripe_checkout_session_id=("cs_test_wrong_amount"),
        )

        OrderItem.objects.create(
            order=order,
            artwork=artwork,
            product_type="original",
            quantity=1,
            unit_price="750.00",
        )

        retrieve_session_mock.return_value = {
            "id": "cs_test_wrong_amount",
            "payment_status": "paid",
            "amount_total": 100,
            "currency": "gbp",
            "payment_intent": ("pi_test_wrong_amount"),
            "metadata": {
                "order_id": str(order.pk),
            },
        }

        self.client.force_authenticate(
            user=self.customer,
        )

        response = self.client.get(
            reverse(
                "checkout-confirm",
            ),
            {
                "session_id": ("cs_test_wrong_amount"),
            },
        )

        self.assertEqual(
            response.status_code,
            400,
            response.data,
        )

        order.refresh_from_db()

        self.assertEqual(
            order.status,
            "pending",
        )

        self.assertIsNone(
            order.paid_at,
        )
