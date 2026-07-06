from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ArtworkViewSet, CategoryViewSet

router = DefaultRouter()
router.register(r'artworks', ArtworkViewSet)
router.register(r'categories', CategoryViewSet)

urlpatterns = [
    path('', include(router.urls)),
]