import uuid

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


def assign_unique_order_references(
    apps,
    schema_editor,
):
    Order = apps.get_model(
        "orders",
        "Order",
    )

    for order in Order.objects.all().iterator():
        order.reference = uuid.uuid4()

        order.save(
            update_fields=("reference",),
        )


class Migration(migrations.Migration):
    dependencies = [
        ("orders", "0001_initial"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AlterModelOptions(
            name="order",
            options={
                "ordering": ("-created_at",),
            },
        ),
        migrations.AddField(
            model_name="order",
            name="currency",
            field=models.CharField(
                default="GBP",
                max_length=3,
            ),
        ),
        migrations.AddField(
            model_name="order",
            name="customer",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=(django.db.models.deletion.PROTECT),
                related_name="orders",
                to=settings.AUTH_USER_MODEL,
            ),
        ),
        migrations.AddField(
            model_name="order",
            name="reference",
            field=models.UUIDField(
                editable=False,
                null=True,
            ),
        ),
        migrations.RunPython(
            assign_unique_order_references,
            migrations.RunPython.noop,
        ),
        migrations.AlterField(
            model_name="order",
            name="reference",
            field=models.UUIDField(
                default=uuid.uuid4,
                editable=False,
                unique=True,
            ),
        ),
        migrations.AddField(
            model_name="order",
            name="updated_at",
            field=models.DateTimeField(
                auto_now=True,
            ),
        ),
    ]
