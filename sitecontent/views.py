from rest_framework import generics
from rest_framework.parsers import (
    FormParser,
    MultiPartParser,
)
from rest_framework.permissions import IsAdminUser

from .models import SiteSettings
from .serializers import SiteSettingsSerializer


class SiteSettingsAPIView(
    generics.RetrieveAPIView,
):
    serializer_class = SiteSettingsSerializer

    def get_object(self):
        return SiteSettings.objects.first()


class SiteSettingsManagementAPIView(
    generics.RetrieveUpdateAPIView,
):
    serializer_class = SiteSettingsSerializer

    permission_classes = (IsAdminUser,)

    parser_classes = (
        MultiPartParser,
        FormParser,
    )

    def get_object(self):
        settings, _created = SiteSettings.objects.get_or_create(
            pk=1,
        )

        return settings
