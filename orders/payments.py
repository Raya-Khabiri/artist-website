from decimal import Decimal, ROUND_HALF_UP

import stripe
from django.conf import settings

from .models import Order

from django.db import transaction
from django.utils import timezone


def price_to_minor_units(value: Decimal) -> int:
    return int(
        (value * Decimal("100")).quantize(
            Decimal("1"),
            rounding=ROUND_HALF_UP,
        )
    )


def create_checkout_session(
    order: Order,
):
    stripe.api_key = settings.STRIPE_SECRET_KEY

    frontend_url = settings.FRONTEND_URL.rstrip("/")

    line_items = []

    for item in order.items.select_related("artwork").all():
        product_type = item.get_product_type_display()

        line_items.append(
            {
                "price_data": {
                    "currency": order.currency.lower(),
                    "unit_amount": price_to_minor_units(
                        item.unit_price,
                    ),
                    "product_data": {
                        "name": item.artwork.title,
                        "description": product_type,
                    },
                },
                "quantity": item.quantity,
            }
        )

    session = stripe.checkout.Session.create(
        mode="payment",
        customer_email=order.customer_email,
        client_reference_id=str(order.reference),
        line_items=line_items,
        metadata={
            "order_id": str(order.pk),
            "order_reference": str(order.reference),
        },
        payment_intent_data={
            "metadata": {
                "order_id": str(order.pk),
                "order_reference": str(order.reference),
            },
        },
        success_url=(
            f"{frontend_url}/checkout/success" "?session_id={CHECKOUT_SESSION_ID}"
        ),
        cancel_url=(f"{frontend_url}/checkout" "?payment=cancelled"),
        idempotency_key=f"checkout-order-{order.reference}",
    )

    order.stripe_checkout_session_id = session.id

    order.save(
        update_fields=(
            "stripe_checkout_session_id",
            "updated_at",
        )
    )

    return session


@transaction.atomic
def mark_order_as_paid(session):
    session_id = session.get("id")

    try:
        order = Order.objects.select_for_update().get(
            stripe_checkout_session_id=session_id,
        )
    except Order.DoesNotExist:
        return None

    if order.status == "paid":
        return order

    if session.get("payment_status") != "paid":
        return order

    expected_amount = price_to_minor_units(
        order.total_price,
    )

    received_amount = session.get(
        "amount_total",
    )

    received_currency = (session.get("currency") or "").upper()

    if (
        received_amount != expected_amount
        or received_currency != order.currency.upper()
    ):
        raise ValueError("Stripe payment amount or currency does not match the order.")

    order.status = "paid"
    order.stripe_payment_intent_id = session.get("payment_intent") or ""
    order.paid_at = timezone.now()

    order.save(
        update_fields=(
            "status",
            "stripe_payment_intent_id",
            "paid_at",
            "updated_at",
        )
    )

    return order


@transaction.atomic
def cancel_expired_order(session):
    session_id = session.get("id")

    try:
        order = (
            Order.objects.select_for_update()
            .prefetch_related("items__artwork")
            .get(
                stripe_checkout_session_id=session_id,
            )
        )
    except Order.DoesNotExist:
        return None

    if order.status != "pending":
        return order

    for item in order.items.all():
        artwork = item.artwork

        if item.product_type == "original":
            artwork.original_available = True
            artwork.sale_status = "available"

            artwork.save(
                update_fields=(
                    "original_available",
                    "sale_status",
                    "updated_at",
                )
            )
        else:
            artwork.stock += item.quantity
            artwork.print_available = True

            artwork.save(
                update_fields=(
                    "stock",
                    "print_available",
                    "updated_at",
                )
            )

    order.status = "cancelled"

    order.save(
        update_fields=(
            "status",
            "updated_at",
        )
    )

    return order


def retrieve_checkout_session(
    session_id: str,
):
    stripe.api_key = settings.STRIPE_SECRET_KEY

    session = stripe.checkout.Session.retrieve(
        session_id,
    )

    return session.to_dict()
