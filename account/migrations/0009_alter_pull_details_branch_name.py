# Generated by Django 4.1 on 2023-11-06 16:34

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("account", "0008_pull_details_branch_name"),
    ]

    operations = [
        migrations.AlterField(
            model_name="pull_details",
            name="branch_name",
            field=models.CharField(max_length=255),
        ),
    ]