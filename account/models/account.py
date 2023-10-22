import uuid

from django.db import models

from core.models.base import BaseModel


class UserAccount(models.Model):
    """Model/Manager for service accounts"""

    GitHub = "GitHub"
    GitLab = "GitLab"

    ACCOUNT_TYPES = ((GitHub, "github"), (GitLab, "gitlab"))

    id = models.UUIDField(primary_key=True, default=uuid.uuid4)

    account_id = models.CharField(max_length=255, unique=True)
    access_token = models.CharField(max_length=255)
    email = models.CharField(max_length=255)
    account_type = models.CharField(
        choices=ACCOUNT_TYPES, default="GitHub", max_length=255
    )
    user_name = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    company = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now=True)
    updated_at = models.DateTimeField()

    class Meta:
        db_table = "UserAccount"
