from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    ArtworkManagementViewSet,
    ArtworkViewSet,
    CategoryViewSet,
    TechniqueViewSet,
    ArtworkImageManagementViewSet,
)

router = DefaultRouter()

router.register(
    "manage/artworks",
    ArtworkManagementViewSet,
    basename="artwork-management",
)

router.register(
    "manage/images",
    ArtworkImageManagementViewSet,
    basename="artwork-image-management",
)

router.register(
    "artworks",
    ArtworkViewSet,
    basename="artwork",
)

router.register(
    "categories",
    CategoryViewSet,
    basename="category",
)

router.register(
    "techniques",
    TechniqueViewSet,
    basename="technique",
)

urlpatterns = [
    path("", include(router.urls)),
]
