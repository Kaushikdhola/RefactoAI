from django.db import models

from account.models.account import UserAccount
from account.models.branch import Branch
from account.models.repository import Repository
from core.models.base import BaseModel


class Refactor(BaseModel):
    target_branch = models.ForeignKey(
        Branch,
        null=True,
        blank=True,
        on_delete=models.CASCADE,
        related_name="target_branch",
    )
    repository = models.ForeignKey(Repository, on_delete=models.CASCADE)
    user = models.ForeignKey(UserAccount, on_delete=models.CASCADE)

    class Meta:
        db_table = "Refactor"

    @classmethod
    def create_refactor(cls, user_id, repo_id, target_branch):
        user_account = UserAccount.objects.get(account_id=user_id)
        repo = Repository.objects.get(repo_id=repo_id, user=user_account)
        branch, created = Branch.objects.get_or_create(
            repository=repo, name=target_branch, user=user_account
        )
        refactor, created = Refactor.objects.get_or_create(
            user=user_account, repository=repo
        )
        refactor.target_branch = branch
        refactor.save()

    @classmethod
    def fetch_target(cls, user_id, repo_id):
        user_instance = UserAccount.objects.get(account_id=user_id)
        repo_instance = Repository.objects.get(repo_id=repo_id, user=user_instance)
        refactoring_target = Refactor.objects.get(
            user=user_instance, repository=repo_instance
        )
        return refactoring_target.target_branch.name
