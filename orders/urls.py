from django.urls import (
    include,
    path,
)
from rest_framework.routers import DefaultRouter

from .views import OrderManagementViewSet

router = DefaultRouter()

router.register(
    "manage/orders",
    OrderManagementViewSet,
    basename="order-management",
)

urlpatterns = [
    path("", include(router.urls)),
]
