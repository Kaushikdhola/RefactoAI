import json

import requests
from django.conf import settings
from django.middleware.csrf import rotate_token

from account.models.account import UserAccount
from account.models.branch import Branch
from account.models.configuration import UserConfiguration
from account.models.repository import Repository
from account.models.target_configuration import TargetConfiguration
from core.utils.exceptions import ValidationError


class GitHubAccount(UserAccount):
    """
    A proxy class representing a GitHub account,
    inheriting from the UserAccount model/manager.
    """

    ACCESS_TOKEN_URL = "https://github.com/login/oauth/access_token"

    class Meta:
        proxy = True

    @classmethod
    def fetch_access_token(cls, code):
        """fetches and returns access token from github"""
        if not code:
            raise ValidationError("OAuth code not provided")

        token_payload = {
            "client_id": settings.GITHUB_CLIENT_ID,
            "client_secret": settings.GITHUB_APP_SECRET,
            "code": code,
        }
        response = requests.post(
            cls.ACCESS_TOKEN_URL,
            headers={"Accept": "application/json", "scope": "repo"},
            data=token_payload,
        )
        response_payload = response.json()
        return response_payload.get("access_token")

    @classmethod
    def fetch_user_data(cls, token):
        """fetches user data from access token provided"""
        user_url = "https://api.github.com/user"
        headers = {"Accept": "application/json", "Authorization": f"Bearer {token}"}
        response = requests.get(user_url, headers=headers)
        return response.json()

    @classmethod
    def prepare_configurations(cls, user_id):
        """creates default configuration when new account is created"""
        UserConfiguration.objects.create(
            user_id=user_id, commit_interval=5, max_lines=30
        )

    @classmethod
    def create_account(cls, user, token):
        """creates account and configurations along with it"""
        account_id = user.get("id")
        update_values = {
            "account_id": account_id,
            "access_token": token,
            "email": user.get("email"),
            "user_name": user.get("login"),
            "name": user.get("name"),
            "company": user.get("company"),
            "account_type": "GitHub",
        }
        if instance := UserAccount.objects.filter(account_id=account_id).first():
            instance.set_values(update_values)
            instance.save()
        else:
            instance = UserAccount.objects.create(**update_values)
            cls.prepare_configurations(instance.id)

    @classmethod
    def prepare_session(cls, request, user):
        """prepares session for the current user login"""
        user_id = user.get("id")
        user_instance = UserAccount.objects.get(account_id=user_id)
        rotate_token(request=request)
        request.session["isLoggedIn"] = True
        request.session["user_id"] = user_id
        request.session.save()
        request.session.set_expiry(settings.SESSION_EXPIRY)

    @classmethod
    def authorize(cls, code, request):
        """authorizes and user creation"""
        token = cls.fetch_access_token(code=code)
        user = cls.fetch_user_data(token=token)
        cls.create_account(user=user, token=token)
        Repository.prepare_repositories(user=user, token=token)
        cls.prepare_session(request=request, user=user)

    @classmethod
    def fetch_repositories(cls, user_id):
        """fetching repository details related to the user"""
        user_instance = UserAccount.objects.get(account_id=user_id)
        repos = Repository.objects.filter(user=user_instance)
        all_repos_data = []
        for repo in repos:
            branches = Branch.fetch_branches(user_id, repo)
            repo_data = {
                "repo_id": repo.repo_id,
                "name": repo.name,
                "url": repo.url,
                "source_branches": branches,
                "target_branches": branches,
            }
            all_repos_data.append(repo_data)
        return all_repos_data

    # todo:Kenil - use this function to get refactor configurations
    @classmethod
    def fetch_configurations(cls, user_id):
        """fetching configuration details related to the user"""
        user_instance = UserAccount.objects.get(account_id=user_id)
        configuration_instance = UserConfiguration.getConfiguration(user_id)

        repositories = Repository.objects.filter(user=user_instance)
        repository_details = []
        for repository in repositories:
            repo_id = repository.repo_id
            commit_configurations = UserAccount.objects.filter(
                repository=repository, user=user_instance
            )
            branch_details = []
            for commit_configuration in commit_configurations:
                source_branch = commit_configuration.source_branch
                branch_name = source_branch.name
                commit_number = commit_configuration.current_commit
                branch_details.append(
                    {"name": branch_name, "commit_number": commit_number}
                )
            target_configuration = TargetConfiguration.objects.get(
                user=user_instance, repository=repository
            )
            target_branch = target_configuration.target_branch
            repository_details.append(
                {
                    "repo_id": repo_id,
                    "name": repository.name,
                    "url": repository.url,
                    "source_branches": branch_details,
                    "target_branch": target_branch.name,
                }
            )
        return {
            "user_id": user_id,
            "commit_interval": configuration_instance.commit_interval,
            "max_lines": configuration_instance.max_lines,
            "repositories": repository_details,
        }
