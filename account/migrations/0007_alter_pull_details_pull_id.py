# Generated by Django 4.1 on 2023-11-06 16:32

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("account", "0006_alter_pull_details_pull_id"),
    ]

    operations = [
        migrations.AlterField(
            model_name="pull_details",
            name="pull_id",
            field=models.IntegerField(),
        ),
    ]
