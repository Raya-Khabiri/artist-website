from django.urls import path

from .views import (
    ConversationDetailAPIView,
    ConversationListCreateAPIView,
    LoginAPIView,
    RegisterAPIView,
    MessageCreateAPIView,
)

app_name = "accounts"


urlpatterns = [
    path(
        "register/",
        RegisterAPIView.as_view(),
        name="register",
    ),
    path(
        "login/",
        LoginAPIView.as_view(),
        name="login",
    ),
    path(
        "conversations/",
        ConversationListCreateAPIView.as_view(),
        name="conversation-list",
    ),
    path(
        "conversations/<int:pk>/",
        ConversationDetailAPIView.as_view(),
        name="conversation-detail",
    ),
    path(
        "conversations/<int:conversation_id>/messages/",
        MessageCreateAPIView.as_view(),
        name="message-create",
    ),
]
