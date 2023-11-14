from django.db import models
from django.utils import timezone

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

    @classmethod
    def update_configuration(cls, user_id, commit_interval, max_lines):
        """updating the user specific configurations like max_lines and commit_interval"""
        user_account = UserAccount.objects.get(account_id=user_id)
        user_configuration = UserConfiguration.objects.get(user=user_account)
        user_configuration.max_lines = max_lines
        user_configuration.commit_interval = commit_interval
        user_configuration.updated_at = timezone.now()
        user_configuration.save()
