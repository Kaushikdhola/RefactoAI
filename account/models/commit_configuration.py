from django.db import models

from account.models.repository import Repository
from account.models.branch import Branch
from account.models.account import UserAccount
from account.models.configuration import UserConfiguration
from core.models.base import BaseModel

class Commit_Configuration(BaseModel):
    source_branch = models.ForeignKey(Branch, on_delete=models.CASCADE)
    current_commit = models.IntegerField(default=0)
    user = models.ForeignKey(UserAccount, on_delete=models.CASCADE)
    repository = models.ForeignKey(Repository,on_delete=models.CASCADE)

    class Meta:
        db_table = "Commit_Configuration"
    
    @classmethod
    def configure_branches(cls,request,repo_id,branch_name):
        user_id = request.session["user_id"]
        user_instance = UserAccount.getUser(user_id)
        repository_instance = Repository.getRepository(repo_id=repo_id,user_id=user_id)
        branch, created = Branch.objects.get_or_create(repository=repository_instance, name=branch_name,user=user_instance)
        commit_configuration, created = cls.objects.get_or_create(source_branch=branch,user=user_instance,repository=repository_instance)
        return commit_configuration

    @classmethod
    def update_commit(cls,user_id,repo_id,branch_name):
        user_instance = UserAccount.getUser(user_id)
        repository_instance = Repository.getRepository(repo_id=repo_id,user_id=user_id)
        source_branch = Branch.objects.get(user=user_instance,repository=repository_instance,name=branch_name)
        commit_configuration = cls.objects.get(user=user_instance,repository=repository_instance,source_branch=source_branch)
        commit_configuration.current_commit = commit_configuration.current_commit + 1
        user_configuration = UserConfiguration.objects.get(user=user_instance)
        if commit_configuration.current_commit > user_configuration.commit_interval:
            commit_configuration.current_commit = 1
        commit_configuration.save()