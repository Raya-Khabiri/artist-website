from django.db import models


class SiteSettings(models.Model):
    # Hero section
    hero_title = models.CharField(
        max_length=100,
        default="EAMORA",
    )

    hero_acronym = models.CharField(
        max_length=250,
        default="Eternal A Moment Once Remembered Again",
    )

    hero_statement = models.TextField(
        default=(
            "Art saves fleeting moments from disappearing, "
            "transforming them into eternal expressions "
            "that endure beyond time."
        ),
    )

    hero_image = models.ImageField(
        upload_to="site/hero/",
        blank=True,
        null=True,
    )

    hero_image_alt = models.CharField(
        max_length=200,
        blank=True,
        default="Featured EAMORA artwork",
    )

    hero_button_text = models.CharField(
        max_length=50,
        default="Explore Gallery",
    )

    hero_button_link = models.CharField(
        max_length=200,
        default="/gallery",
    )

    # Artist process video
    process_video = models.FileField(
        upload_to="site/process-video/",
        blank=True,
        null=True,
    )

    process_video_poster = models.ImageField(
        upload_to="site/process-video/posters/",
        blank=True,
        null=True,
    )

    process_video_title = models.CharField(
        max_length=150,
        default="Inside the Studio",
    )

    # Artist statement
    artist_statement_title = models.CharField(
        max_length=100,
        default="Artist Statement",
    )

    artist_statement = models.TextField(
        blank=True,
    )

    artist_image = models.ImageField(
        upload_to="site/artist/",
        blank=True,
        null=True,
    )

    # Contact information
    contact_email = models.EmailField(
        blank=True,
    )

    phone = models.CharField(
        max_length=30,
        blank=True,
    )

    instagram_url = models.URLField(
        blank=True,
    )

    facebook_url = models.URLField(
        blank=True,
    )

    copyright_text = models.CharField(
        max_length=200,
        default="EAMORA. All rights reserved.",
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    class Meta:
        verbose_name = "Site settings"
        verbose_name_plural = "Site settings"

    def save(self, *args, **kwargs):
        # Only one settings record should exist.
        self.pk = 1
        super().save(*args, **kwargs)

    def __str__(self):
        return "EAMORA Site Settings"
