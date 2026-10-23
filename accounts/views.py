from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.db.models import Count, Q

from rest_framework import generics, status
from rest_framework.permissions import (
    AllowAny,
    IsAuthenticated,
)
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Conversation, Message
from .serializers import (
    ConversationCreateSerializer,
    ConversationSerializer,
    LoginSerializer,
    MessageCreateSerializer,
    MessageSerializer,
    RegisterSerializer,
    UserSummarySerializer,
)


class RegisterAPIView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [
        AllowAny,
    ]


class LoginAPIView(APIView):
    permission_classes = [
        AllowAny,
    ]

    def post(self, request):
        serializer = LoginSerializer(
            data=request.data,
        )

        serializer.is_valid(
            raise_exception=True,
        )

        return Response(
            serializer.validated_data,
        )



class ConversationQuerysetMixin:
    def get_queryset(self):
        queryset = (
            Conversation.objects.select_related(
                "customer",
                "assigned_artist",
            )
            .prefetch_related(
                "messages__sender",
            )
            .annotate(
                unread_count=Count(
                    "messages",
                    filter=(
                        Q(messages__read_at__isnull=True)
                        & ~Q(messages__sender=self.request.user)
                    ),
                    distinct=True,
                )
            )
            .order_by(
                "-unread_count",
                "-updated_at",
            )
        )

        if self.request.user.is_staff:
            return queryset

        return queryset.filter(
            customer=self.request.user,
        )


class UnreadMessageCountAPIView(APIView):
    permission_classes = [
        IsAuthenticated,
    ]

    def get(self, request):
        unread_messages = Message.objects.filter(
            read_at__isnull=True,
        )

        if request.user.is_staff:
            unread_messages = unread_messages.filter(
                sender__is_staff=False,
            )
        else:
            unread_messages = unread_messages.filter(
                conversation__customer=request.user,
                sender__is_staff=True,
            )

        return Response(
            {
                "unread_count": unread_messages.count(),
            }
        )


class ConversationListCreateAPIView(
    ConversationQuerysetMixin,
    generics.ListCreateAPIView,
):
    permission_classes = [
        IsAuthenticated,
    ]

    def get_serializer_class(self):
        if self.request.method == "POST":
            return ConversationCreateSerializer

        return ConversationSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(
            data=request.data,
        )

        serializer.is_valid(
            raise_exception=True,
        )

        conversation = serializer.save()

        output_serializer = ConversationSerializer(
            conversation,
            context=self.get_serializer_context(),
        )

        return Response(
            output_serializer.data,
            status=status.HTTP_201_CREATED,
        )


class ConversationDetailAPIView(
    ConversationQuerysetMixin,
    generics.RetrieveAPIView,
):
    serializer_class = ConversationSerializer

    permission_classes = [
        IsAuthenticated,
    ]

    def retrieve(self, request, *args, **kwargs):
        conversation = self.get_object()

        Message.objects.filter(
            conversation=conversation,
            read_at__isnull=True,
        ).exclude(
            sender=request.user,
        ).update(
            read_at=timezone.now(),
        )

        serializer = self.get_serializer(
            conversation,
        )

        return Response(serializer.data)


class MessageCreateAPIView(
    ConversationQuerysetMixin,
    APIView,
):
    permission_classes = [
        IsAuthenticated,
    ]

    def post(
        self,
        request,
        conversation_id,
    ):
        conversation = get_object_or_404(
            self.get_queryset(),
            pk=conversation_id,
        )

        serializer = MessageCreateSerializer(
            data=request.data,
            context={
                "request": request,
                "conversation": conversation,
            },
        )

        serializer.is_valid(
            raise_exception=True,
        )

        message = serializer.save()

        output_serializer = MessageSerializer(
            message,
        )

        return Response(
            output_serializer.data,
            status=status.HTTP_201_CREATED,
        )


class CurrentUserAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSummarySerializer(request.user)
        return Response(serializer.data)
