from django.db import models

from account.models.account import UserAccount
from account.models.branch import Branch
from account.models.configuration import UserConfiguration
from account.models.repository import Repository
from core.models.base import BaseModel


class Commit_Configuration(BaseModel):
    source_branch = models.ForeignKey(Branch, on_delete=models.CASCADE)
    current_commit = models.IntegerField(default=0)
    user = models.ForeignKey(UserAccount, on_delete=models.CASCADE)
    repository = models.ForeignKey(Repository, on_delete=models.CASCADE)

    class Meta:
        db_table = "Commit_Configuration"

    @classmethod
    def configure_branches(cls, user_id, repo_id, branch_name):
        user_instance = UserAccount.objects.get(account_id=user_id)
        repository_instance = Repository.objects.get(
            repo_id=repo_id, user=user_instance
        )
        branch, created = Branch.objects.get_or_create(
            repository=repository_instance, name=branch_name, user=user_instance
        )
        commit_configuration, created = Commit_Configuration.objects.get_or_create(
            source_branch=branch, user=user_instance, repository=repository_instance
        )
        return commit_configuration

    @classmethod
    def update_current_commit(cls, user_id, repo_id, branch_name):
        user_instance = UserAccount.objects.get(account_id=user_id)
        repository_instance = Repository.objects.get(
            repo_id=repo_id, user=user_instance
        )
        source_branch = Branch.objects.get(
            user=user_instance, repository=repository_instance, name=branch_name
        )
        commit_configuration = Commit_Configuration.objects.get(
            user=user_instance,
            repository=repository_instance,
            source_branch=source_branch,
        )
        commit_configuration.current_commit = commit_configuration.current_commit + 1
        user_configuration = UserConfiguration.objects.get(user=user_instance)
        if commit_configuration.current_commit > user_configuration.commit_interval:
            commit_configuration.current_commit = 1
        commit_configuration.save()

    @classmethod
    def fetch_configured_branches(cls, user_id, repo_id):
        user_instance = UserAccount.objects.get(account_id=user_id)
        repo_instance = Repository.objects.get(repo_id=repo_id, user=user_instance)
        configs = cls.objects.filter(repository=repo_instance, user=user_instance)
        configured_branches = []
        for config in configs:
            configured_branches.append(config.source_branch.name)
        return configured_branches
