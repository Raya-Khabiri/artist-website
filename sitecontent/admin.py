from django.contrib import admin

from .models import SiteSettings


@admin.register(SiteSettings)
class SiteSettingsAdmin(admin.ModelAdmin):
    readonly_fields = ("updated_at",)

    fieldsets = (
        (
            "Hero section",
            {
                "fields": (
                    "hero_title",
                    "hero_acronym",
                    "hero_statement",
                    "hero_image",
                    "hero_image_alt",
                    "hero_button_text",
                    "hero_button_link",
                ),
            },
        ),
        (
            "Artist process video",
            {
                "fields": (
                    "process_video_title",
                    "process_video",
                    "process_video_poster",
                ),
            },
        ),
        (
            "About the artist",
            {
                "fields": (
                    "artist_name",
                    "artist_origin",
                    "artist_location",
                    "artist_profession",
                    "artist_image",
                    "artist_biography",
                ),
            },
        ),
        (
            "Contact information",
            {
                "fields": (
                    "contact_email",
                    "phone",
                    "instagram_url",
                    "facebook_url",
                ),
            },
        ),
        (
            "Footer",
            {
                "fields": ("copyright_text",),
            },
        ),
        (
            "System information",
            {
                "classes": ("collapse",),
                "fields": ("updated_at",),
            },
        ),
    )

    def has_add_permission(self, request):
        # Prevent creating more than one SiteSettings record.
        if SiteSettings.objects.exists():
            return False

        return super().has_add_permission(request)

    def has_delete_permission(self, request, obj=None):
        # Prevent accidental deletion of the site settings.
        return False
