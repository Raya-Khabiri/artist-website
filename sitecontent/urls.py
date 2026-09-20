from django.urls import path

from .views import (
    SiteSettingsAPIView,
    SiteSettingsManagementAPIView,
)

urlpatterns = [
    path(
        "manage/",
        SiteSettingsManagementAPIView.as_view(),
        name="site-settings-management",
    ),
    path(
        "",
        SiteSettingsAPIView.as_view(),
        name="site-settings",
    ),
]
