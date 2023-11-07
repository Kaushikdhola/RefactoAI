import requests
import json
from django.conf import settings
from django.middleware.csrf import rotate_token

from account.models.account import UserAccount
from account.models.configuration import UserConfiguration
from account.models.repository import Repository
from account.models.branch import Branch
from account.models.commit_configuration import Commit_Configuration
from core.utils.exceptions import ValidationError


class GitHubConfigurations(Commit_Configuration):
    class Meta:
        proxy = True
    
    @classmethod
    def fetch_configurations(cls,request):
        user_id = request.session["user_id"]
        user_instance = UserAccount.getUser(user_id)
        configuration_instance = UserConfiguration.getConfiguration(user_id)
        repositories = Repository.getRepositories(user_id)
        repository_details = []
        for repository in repositories:
            repo_id = repository.repo_id
            commit_configurations = cls.objects.filter(repository=repository,user=user_instance)
            branch_details = []
            for commit_configuration in commit_configurations:
                source_branch = commit_configuration.source_branch
                branch_name = source_branch.name
                commit_number = commit_configuration.current_commit
                branch_details.append({"name":branch_name,"commit_number":commit_number})
            repository_details.append({"repo_id":repo_id,"branches":branch_details})
        return {"user_id":user_id,"commit_interval":configuration_instance.commit_interval, "max_lines":configuration_instance.max_lines,"repositories":repository_details}