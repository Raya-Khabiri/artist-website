import logging

import stripe
from django.db import transaction
from rest_framework import status
from rest_framework.response import Response

from django.conf import settings
from django.shortcuts import get_object_or_404

from rest_framework import (
    generics,
    mixins,
    viewsets,
)
from rest_framework.permissions import (
    AllowAny,
    IsAdminUser,
    IsAuthenticated,
)

from rest_framework.views import APIView

from .models import Order
from .serializers import (
    CheckoutCreateSerializer,
    OrderManagementSerializer,
)
from .payments import (
    cancel_expired_order,
    create_checkout_session,
    mark_order_as_paid,
    retrieve_checkout_session,
)


class OrderManagementViewSet(
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    viewsets.GenericViewSet,
):
    serializer_class = OrderManagementSerializer

    permission_classes = (IsAdminUser,)

    http_method_names = (
        "get",
        "patch",
        "head",
        "options",
    )

    def get_queryset(self):
        queryset = (
            Order.objects.select_related(
                "customer",
            )
            .prefetch_related(
                "items__artwork",
            )
            .all()
        )

        status = self.request.query_params.get("status")

        allowed_statuses = {choice[0] for choice in Order.STATUS_CHOICES}

        if status in allowed_statuses:
            queryset = queryset.filter(
                status=status,
            )

        return queryset


class CheckoutCreateAPIView(
    generics.CreateAPIView,
):
    serializer_class = CheckoutCreateSerializer
    permission_classes = (IsAuthenticated,)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(
            data=request.data,
        )

        serializer.is_valid(
            raise_exception=True,
        )

        try:
            with transaction.atomic():
                order = serializer.save()

                checkout_session = create_checkout_session(order)

        except stripe.StripeError:
            logging.exception("Stripe Checkout session creation failed.")

            return Response(
                {
                    "detail": ("Unable to start payment. " "Please try again."),
                },
                status=status.HTTP_502_BAD_GATEWAY,
            )

        order_data = OrderManagementSerializer(
            order,
            context=self.get_serializer_context(),
        ).data

        return Response(
            {
                "order": order_data,
                "checkout_url": checkout_session.url,
            },
            status=status.HTTP_201_CREATED,
        )


class CheckoutConfirmationAPIView(
    APIView,
):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        session_id = request.query_params.get(
            "session_id",
            "",
        ).strip()

        if not session_id.startswith("cs_"):
            return Response(
                {
                    "detail": ("Invalid checkout session."),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        order = get_object_or_404(
            Order.objects.prefetch_related(
                "items__artwork",
            ),
            customer=request.user,
            stripe_checkout_session_id=session_id,
        )

        try:
            session = retrieve_checkout_session(
                session_id,
            )
        except stripe.StripeError:
            logging.exception("Unable to retrieve Stripe Checkout session.")

            return Response(
                {
                    "detail": ("Unable to verify payment."),
                },
                status=status.HTTP_502_BAD_GATEWAY,
            )

        metadata_order_id = session.get("metadata", {}).get(
            "order_id",
        )

        if metadata_order_id != str(order.pk):
            return Response(
                {
                    "detail": ("Checkout session does not " "match this order."),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if session.get("payment_status") == "paid":
            try:
                mark_order_as_paid(
                    session,
                )
            except ValueError:
                logging.warning("Stripe payment does not match the order.")

                return Response(
                    {
                        "detail": ("Payment does not match " "the order."),
                    },
                    status=(status.HTTP_400_BAD_REQUEST),
                )

            order.refresh_from_db()

        order_data = OrderManagementSerializer(
            order,
            context={
                "request": request,
            },
        ).data

        return Response(
            {
                "order": order_data,
                "payment_status": session.get(
                    "payment_status",
                ),
            },
            status=status.HTTP_200_OK,
        )


class StripeWebhookAPIView(APIView):
    authentication_classes = ()
    permission_classes = (AllowAny,)

    def post(self, request):
        webhook_secret = settings.STRIPE_WEBHOOK_SECRET

        if not webhook_secret:
            return Response(
                {
                    "detail": ("Stripe webhook is not configured."),
                },
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        signature = request.headers.get(
            "Stripe-Signature",
            "",
        )

        try:
            event = stripe.Webhook.construct_event(
                payload=request.body,
                sig_header=signature,
                secret=webhook_secret,
            )
        except ValueError:
            return Response(
                {
                    "detail": "Invalid webhook payload.",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        except stripe.SignatureVerificationError:
            return Response(
                {
                    "detail": "Invalid webhook signature.",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        event_type = event["type"]
        session_object = event["data"]["object"]

        session = (
            session_object.to_dict()
            if hasattr(
                session_object,
                "to_dict",
            )
            else session_object
        )

        try:
            if event_type in (
                "checkout.session.completed",
                "checkout.session.async_payment_succeeded",
            ):
                mark_order_as_paid(
                    session,
                )

            elif event_type == "checkout.session.expired":
                cancel_expired_order(
                    session,
                )

        except ValueError:
            logging.exception("Stripe webhook order validation failed.")

            return Response(
                {
                    "detail": ("Payment does not match the order."),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            {
                "received": True,
            },
            status=status.HTTP_200_OK,
        )
