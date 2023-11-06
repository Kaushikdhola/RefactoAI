from django.db import models

from account.models.account import UserAccount
from account.models.repository import Repository
from core.models.base import BaseModel


class Branch(BaseModel):
    """Model/Manager for Branches"""

    branch_id = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    user = models.ForeignKey(UserAccount, on_delete=models.CASCADE)
    repository = models.ForeignKey(Repository, on_delete=models.CASCADE)

    class Meta:
        db_table = "Branch"
