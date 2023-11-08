from django.contrib.auth import logout
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.renderers import JSONRenderer

from account.models.account import UserAccount
from account.models.branch import Branch
from account.models.configuration import UserConfiguration
from account.models.repository import Repository
from account.models.source_configuration import SourceConfiguration
from account.models.target_configuration import TargetConfiguration
from account.proxies.github_account import GitHubAccount
from core.utils.base_view import BaseView
from core.utils.exceptions import ValidationError


class GitHubConfigurationView(BaseView):
    model = GitHubAccount

    # todo: Dhruvik - use this function to fetch configuration details for front-end
    def get(self, request, *args, **kwargs):
        """fetching user configurations"""
        user_id = request.session.get("user_id")
        user_instance = UserAccount.objects.get(account_id=user_id)
        user_configuration = UserConfiguration.objects.get(user=user_instance)

        branches_in_repositories = self.model.fetch_repositories(user_id=user_id)
        for branches_in_repository in branches_in_repositories:
            repo_instance = Repository.objects.get_or_create(
                user=user_instance,
                repo_id=branches_in_repository.get("repo_id"),
                name=branches_in_repository.get("name"),
                url=branches_in_repository.get("url"),
            )
            configured_branches = SourceConfiguration.fetch_configured_branches(
                user_id=user_id, repo_id=branches_in_repository.get("repo_id")
            )
            for branch in branches_in_repository.get("source_branches"):
                if branch.get("name") in configured_branches:
                    branch["is_selected"] = True
                else:
                    branch["is_selected"] = False
            target_branch = TargetConfiguration.fetch_configuration(
                user_id=user_id, repo_id=branches_in_repository.get("repo_id")
            )
            # checking if configuration is set
            if target_branch is not None:
                branches_in_repository["target_branch"] = target_branch.name
            else:
                branches_in_repository["target_branch"] = ""
        return JsonResponse(
            {
                "repositories": branches_in_repositories,
                "commit_interval": user_configuration.commit_interval,
                "max_lines": user_configuration.max_lines,
            }
        )

    # todo: Dhruvik - use this function to update configuration details
    def post(self, request, *args, **kwargs):
        """adding user configurations"""
        user_id = request.session.get("user_id")
        configs = request.data
        commit_interval = configs.get("commit_interval")
        max_lines = configs.get("max_lines")
        self.validate_configuration(
            max_lines=max_lines, commit_interval=commit_interval
        )
        UserConfiguration.update_configuration(
            commit_interval=commit_interval, max_lines=max_lines, user_id=user_id
        )
        for repo in configs.get("repositories"):
            source_branches = repo.get("source_branches")
            names = []
            for branch in source_branches:
                names.append(branch.get("name"))
                commit_configuration = SourceConfiguration.configure_branch(
                    user_id=user_id,
                    repo_id=repo.get("repo_id"),
                    branch_name=branch.get("name"),
                )
            target_branch = repo.get("target_branch")
            names.append(target_branch.get("name"))
            target_instance = TargetConfiguration.add_configuration(
                user_id=user_id,
                repo_id=repo.get("repo_id"),
                target_branch=target_branch.get("name"),
            )
            Branch.cleanup(user_id=user_id, names=names, repo_id=repo.get("repo_id"))
        return HttpResponse("Successfully Updated")

    @classmethod
    def validate_configuration(cls, max_lines, commit_interval):
        """validating configurations"""
        if not max_lines > 0:
            raise ValidationError(
                "The maximum number of lines cannot be less than zero."
            )
        if not commit_interval > 0:
            raise ValidationError("The commit interval cannot be less than zero")
