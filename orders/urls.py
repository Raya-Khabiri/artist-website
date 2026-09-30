from django.urls import (
    include,
    path,
)
from rest_framework.routers import DefaultRouter

from .views import (
    CheckoutCreateAPIView,
    OrderManagementViewSet,
    StripeWebhookAPIView,
    CheckoutConfirmationAPIView,
)

router = DefaultRouter()

router.register(
    "manage/orders",
    OrderManagementViewSet,
    basename="order-management",
)


urlpatterns = [
    path(
        "webhook/",
        StripeWebhookAPIView.as_view(),
        name="stripe-webhook",
    ),
    path(
        "checkout/confirm/",
        CheckoutConfirmationAPIView.as_view(),
        name="checkout-confirm",
    ),
    path(
        "checkout/",
        CheckoutCreateAPIView.as_view(),
        name="checkout-create",
    ),
    path(
        "",
        include(router.urls),
    ),
]
