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

        repositories_data = self.model.fetch_repositories(user_id=user_id)
        for each_repository in repositories_data:
            repo_instance = Repository.objects.get_or_create(
                user=user_instance,
                repo_id=each_repository.get("repo_id"),
                name=each_repository.get("name"),
                url=each_repository.get("url"),
            )
            configured_source_branches = SourceConfiguration.fetch_configured_branches(
                user_id=user_id, repo_id=each_repository.get("repo_id")
            )
            for source_branch in each_repository.get("source_branches"):
                if source_branch.get("name") in configured_source_branches:
                    source_branch["is_selected"] = True

            configured_target_branch = TargetConfiguration.fetch_configuration(
                user_id=user_id, repo_id=each_repository.get("repo_id")
            )
            # checking if configuration is set
            if configured_target_branch is not None:
                for source_branch in each_repository.get("target_branches"):
                    if source_branch.get("name") == configured_target_branch.name:
                        source_branch["is_selected"] = True

        return JsonResponse(
            {
                "repositories": repositories_data,
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
                if branch.get("is_selected") is True:
                    names.append(branch.get("name"))
                    commit_configuration = SourceConfiguration.configure_branch(
                        user_id=user_id,
                        repo_id=repo.get("repo_id"),
                        branch_name=branch.get("name"),
                    )
            target_branches = repo.get("target_branches")
            added = False
            for target_branch in target_branches:
                if target_branch.get("is_selected") is True:
                    if added is True:
                        raise ValidationError(
                            "Cannot select more than one target branch"
                        )
                    names.append(target_branch.get("name"))
                    target_instance = TargetConfiguration.add_configuration(
                        user_id=user_id,
                        repo_id=repo.get("repo_id"),
                        target_branch=target_branch.get("name"),
                    )
                    added = True
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
