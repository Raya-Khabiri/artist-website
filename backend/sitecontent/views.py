from rest_framework import generics

from .models import SiteSettings
from .serializers import SiteSettingsSerializer


class SiteSettingsAPIView(generics.RetrieveAPIView):
    serializer_class = SiteSettingsSerializer

    def get_object(self):
        return SiteSettings.objects.first()