from django.contrib import admin

from .models import Conversation, Message


class MessageInline(admin.TabularInline):
    model = Message
    extra = 1

    fields = (
        "sender",
        "body",
        "read_at",
        "created_at",
    )

    readonly_fields = ("created_at",)

    ordering = ("created_at",)


@admin.register(Conversation)
class ConversationAdmin(admin.ModelAdmin):
    list_display = (
        "subject",
        "customer",
        "assigned_artist",
        "status",
        "created_at",
        "updated_at",
    )

    list_filter = (
        "status",
        "created_at",
        "updated_at",
    )

    search_fields = (
        "subject",
        "customer__username",
        "customer__email",
    )

    readonly_fields = (
        "created_at",
        "updated_at",
    )

    ordering = ("-updated_at",)

    list_select_related = (
        "customer",
        "assigned_artist",
    )

    inlines = [
        MessageInline,
    ]


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = (
        "conversation",
        "sender",
        "created_at",
        "read_at",
    )

    list_filter = (
        "created_at",
        "read_at",
    )

    search_fields = (
        "conversation__subject",
        "sender__username",
        "sender__email",
        "body",
    )

    readonly_fields = ("created_at",)

    list_select_related = (
        "conversation",
        "sender",
    )
