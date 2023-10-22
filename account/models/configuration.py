from django.db import models

from core.models.base import BaseModel


class UserConfiguration(models.Model):
    """Model/Manager for service configurations"""

    id = models.UUIDField(primary_key=True)
    commit_interval = models.IntegerField()
    max_lines = models.IntegerField()
    created_at = models.DateTimeField(auto_now=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "UserConfiguration"
