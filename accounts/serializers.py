from uuid import uuid4

from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import (
    validate_password,
)
from django.utils.text import slugify
from rest_framework import serializers

from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.tokens import RefreshToken

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
