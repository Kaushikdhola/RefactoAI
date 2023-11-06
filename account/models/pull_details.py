from django.db import models

from account.models import UserAccount
from core.models.base import BaseModel


class Pull_details(BaseModel):

    """Model/Manager for Pull details"""

    pull_id = models.IntegerField()
    Repo_name = models.CharField(max_length=255)
    author = models.ForeignKey(
        UserAccount, on_delete=models.CASCADE, to_field="user_name"
    )
    title = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "Pull_details"
