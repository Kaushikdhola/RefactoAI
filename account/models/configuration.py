from django.db import models

from account.models.account import UserAccount
from core.models.base import BaseModel


class UserConfiguration(BaseModel):
    """Model/Manager for service configurations"""

    user = models.ForeignKey(UserAccount, on_delete=models.CASCADE)
    commit_interval = models.IntegerField()
    max_lines = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "UserConfiguration"
