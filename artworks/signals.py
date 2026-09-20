from django.db import transaction
from django.db.models.signals import (
    post_delete,
    pre_save,
)
from django.dispatch import receiver

from .models import Artwork, ArtworkImage


def schedule_file_deletion(field_file):
    if not field_file or not field_file.name:
        return

    storage = field_file.storage
    file_name = field_file.name

    transaction.on_commit(lambda: storage.delete(file_name))


@receiver(pre_save, sender=Artwork)
def delete_replaced_main_image(
    sender,
    instance,
    **kwargs,
):
    if not instance.pk:
        return

    previous = sender.objects.filter(pk=instance.pk).only("main_image").first()

    if not previous or not previous.main_image:
        return

    old_name = previous.main_image.name
    new_name = instance.main_image.name if instance.main_image else ""

    if old_name == new_name:
        return

    file_is_shared = (
        sender.objects.exclude(pk=instance.pk).filter(main_image=old_name).exists()
    )

    if not file_is_shared:
        schedule_file_deletion(
            previous.main_image,
        )


@receiver(post_delete, sender=Artwork)
def delete_artwork_main_image(
    sender,
    instance,
    **kwargs,
):
    if not instance.main_image:
        return

    file_is_shared = sender.objects.filter(
        main_image=instance.main_image.name,
    ).exists()

    if not file_is_shared:
        schedule_file_deletion(
            instance.main_image,
        )


@receiver(pre_save, sender=ArtworkImage)
def delete_replaced_gallery_image(
    sender,
    instance,
    **kwargs,
):
    if not instance.pk:
        return

    previous = sender.objects.filter(pk=instance.pk).only("image").first()

    if not previous or not previous.image:
        return

    old_name = previous.image.name
    new_name = instance.image.name if instance.image else ""

    if old_name == new_name:
        return

    file_is_shared = (
        sender.objects.exclude(pk=instance.pk).filter(image=old_name).exists()
    )

    if not file_is_shared:
        schedule_file_deletion(
            previous.image,
        )


@receiver(post_delete, sender=ArtworkImage)
def delete_gallery_image(
    sender,
    instance,
    **kwargs,
):
    if not instance.image:
        return

    file_is_shared = sender.objects.filter(
        image=instance.image.name,
    ).exists()

    if not file_is_shared:
        schedule_file_deletion(
            instance.image,
        )
