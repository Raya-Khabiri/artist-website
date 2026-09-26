from uuid import uuid4

from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import (
    validate_password,
)
from django.utils.text import slugify
from rest_framework import serializers

from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.tokens import RefreshToken

from django.db import transaction

from .models import Conversation, Message

User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        trim_whitespace=False,
    )

    password_confirm = serializers.CharField(
        write_only=True,
        trim_whitespace=False,
    )

    class Meta:
        model = User

        fields = (
            "id",
            "email",
            "first_name",
            "last_name",
            "password",
            "password_confirm",
        )

        read_only_fields = ("id",)

        extra_kwargs = {
            "email": {
                "required": True,
            },
            "first_name": {
                "required": True,
            },
            "last_name": {
                "required": True,
            },
        }

    def validate_email(self, value):
        email = value.strip().lower()

        if User.objects.filter(
            email__iexact=email,
        ).exists():
            raise serializers.ValidationError(
                "An account with this email already exists."
            )

        return email

    def validate(self, attrs):
        password = attrs.get("password")
        password_confirm = attrs.pop(
            "password_confirm",
            None,
        )

        if password != password_confirm:
            raise serializers.ValidationError(
                {
                    "password_confirm": ("Passwords do not match."),
                }
            )

        validate_password(password)

        return attrs

    def create(self, validated_data):
        email = validated_data.pop("email")
        password = validated_data.pop("password")

        username_base = (
            slugify(
                email.split("@")[0],
            )[:100]
            or "user"
        )

        username = f"{username_base}-" f"{uuid4().hex[:8]}"

        return User.objects.create_user(
            username=username,
            email=email,
            password=password,
            **validated_data,
        )


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()

    password = serializers.CharField(
        write_only=True,
        trim_whitespace=False,
    )

    def validate(self, attrs):
        email = attrs["email"].strip().lower()
        password = attrs["password"]

        user = User.objects.filter(
            email__iexact=email,
        ).first()

        if user is None or not user.check_password(password):
            raise AuthenticationFailed("Invalid email or password.")

        if not user.is_active:
            raise AuthenticationFailed("This account is inactive.")

        refresh = RefreshToken.for_user(user)

        return {
            "user": {
                "id": user.id,
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "is_staff": user.is_staff,
            },
            "access": str(
                refresh.access_token,
            ),
            "refresh": str(refresh),
        }


class UserSummarySerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = (
            "id",
            "full_name",
            "is_staff",
        )

    def get_full_name(self, obj):
        return obj.get_full_name() or "User"


class CustomerDetailsSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = User

        fields = (
            "id",
            "first_name",
            "last_name",
            "full_name",
            "email",
            "is_staff",
        )

        read_only_fields = fields

    def get_full_name(self, obj):
        return obj.get_full_name() or obj.email or "User"


class MessageSerializer(serializers.ModelSerializer):
    sender = UserSummarySerializer(
        read_only=True,
    )

    class Meta:
        model = Message

        fields = (
            "id",
            "sender",
            "body",
            "read_at",
            "created_at",
        )

        read_only_fields = fields


class ConversationSerializer(serializers.ModelSerializer):
    customer = serializers.SerializerMethodField()

    assigned_artist = UserSummarySerializer(
        read_only=True,
    )

    messages = MessageSerializer(
        many=True,
        read_only=True,
    )

    unread_count = serializers.SerializerMethodField()

    class Meta:
        model = Conversation

        fields = (
            "id",
            "subject",
            "status",
            "customer",
            "assigned_artist",
            "messages",
            "unread_count",
            "created_at",
            "updated_at",
        )

        read_only_fields = fields

    def get_unread_count(self, obj):
        return getattr(
            obj,
            "unread_count",
            0,
        )

    def get_customer(self, obj):
        request = self.context.get("request")

        if request and request.user.is_authenticated and request.user.is_staff:
            return CustomerDetailsSerializer(
                obj.customer,
                context=self.context,
            ).data

        return UserSummarySerializer(
            obj.customer,
            context=self.context,
        ).data


class ConversationCreateSerializer(
    serializers.Serializer,
):
    subject = serializers.CharField(
        max_length=200,
    )

    message = serializers.CharField(
        max_length=5000,
        trim_whitespace=True,
    )

    def validate_subject(self, value):
        subject = value.strip()

        if not subject:
            raise serializers.ValidationError("Subject cannot be empty.")

        return subject

    def validate_message(self, value):
        message = value.strip()

        if not message:
            raise serializers.ValidationError("Message cannot be empty.")

        return message

    @transaction.atomic
    def create(self, validated_data):
        request = self.context["request"]

        conversation = Conversation.objects.create(
            customer=request.user,
            subject=validated_data["subject"],
        )

        Message.objects.create(
            conversation=conversation,
            sender=request.user,
            body=validated_data["message"],
        )

        return conversation


class MessageCreateSerializer(
    serializers.Serializer,
):
    body = serializers.CharField(
        max_length=5000,
        trim_whitespace=True,
    )

    def validate_body(self, value):
        body = value.strip()

        if not body:
            raise serializers.ValidationError("Message cannot be empty.")

        return body

    def validate(self, attrs):
        conversation = self.context["conversation"]

        if conversation.status == Conversation.Status.CLOSED:
            raise serializers.ValidationError(
                {
                    "conversation": ("This conversation is closed."),
                }
            )

        return attrs

    @transaction.atomic
    def create(self, validated_data):
        request = self.context["request"]

        conversation = self.context["conversation"]

        message = Message.objects.create(
            conversation=conversation,
            sender=request.user,
            body=validated_data["body"],
        )

        conversation.save(
            update_fields=[
                "updated_at",
            ],
        )

        return message
