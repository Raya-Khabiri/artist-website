from django.db import migrations


def set_existing_currency_to_gbp(apps, schema_editor):
    Artwork = apps.get_model(
        "artworks",
        "Artwork",
    )

    Artwork.objects.filter(
        currency="CAD",
    ).update(
        currency="GBP",
    )


class Migration(migrations.Migration):

    dependencies = [
        (
            "artworks",
            "0007_alter_artwork_currency_alter_artwork_width_mm",
        ),
    ]

    operations = [
        migrations.RunPython(
            set_existing_currency_to_gbp,
            reverse_code=migrations.RunPython.noop,
        ),
    ]
