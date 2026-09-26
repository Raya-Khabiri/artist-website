from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    ConversationDetailAPIView,
    ConversationListCreateAPIView,
    LoginAPIView,
    RegisterAPIView,
    MessageCreateAPIView,
    CurrentUserAPIView,
    UnreadMessageCountAPIView,
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
        "messages/unread-count/",
        UnreadMessageCountAPIView.as_view(),
        name="unread-message-count",
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
    path(
        "me/",
        CurrentUserAPIView.as_view(),
        name="current-user",
    ),
    path(
        "token/refresh/",
        TokenRefreshView.as_view(),
        name="token-refresh",
    ),
]
