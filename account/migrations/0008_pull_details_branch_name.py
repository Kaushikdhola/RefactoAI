# Generated by Django 4.1 on 2023-11-06 16:34

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("account", "0007_alter_pull_details_pull_id"),
    ]

    operations = [
        migrations.AddField(
            model_name="pull_details",
            name="branch_name",
            field=models.CharField(default="", max_length=255),
        ),
    ]