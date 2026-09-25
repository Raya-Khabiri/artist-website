from django.urls import (
    include,
    path,
)
from rest_framework.routers import DefaultRouter

from .views import (
    CheckoutCreateAPIView,
    OrderManagementViewSet,
)

router = DefaultRouter()

router.register(
    "manage/orders",
    OrderManagementViewSet,
    basename="order-management",
)


urlpatterns = [
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
