from rest_framework import (
    mixins,
    viewsets,
)
from rest_framework.permissions import IsAdminUser

from .models import Order
from .serializers import (
    OrderManagementSerializer,
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
