import copy

from django.conf import settings
from django.middleware.csrf import rotate_token

from account.models.account import UserAccount
from account.models.branch import Branch
from account.models.configuration import UserConfiguration
from account.models.repository import Repository
from account.models.source_configuration import SourceConfiguration
from account.models.target_configuration import TargetConfiguration
from account.serializers.serializer import UserAccountSerializer
from core.utils.exceptions import ValidationError
from core.utils.requests import fetch


class GitHubAccount(UserAccount):
    """
    A proxy class representing a GitHub account,
    inheriting from the UserAccount model/manager.
    """

    ACCESS_TOKEN_URL = "https://github.com/login/oauth/access_token"

    class Meta:
        proxy = True

    @classmethod
    def fetch_access_token(cls, oauth_code):
        """
        Fetches and returns access token from GitHub.

        Args:
        - oauth_code: str, the OAuth code provided by GitHub.

        Returns:
        - str, the access token.
        """
        if not oauth_code:
            raise ValidationError("OAuth code not provided")

        token_payload = {
            "client_id": settings.GITHUB_CLIENT_ID,
            "client_secret": settings.GITHUB_APP_SECRET,
            "code": oauth_code,
        }
        status, response = fetch(
            method="POST",
            url=cls.ACCESS_TOKEN_URL,
            headers={"Accept": "application/json", "scope": "repo"},
            payload=token_payload,
        )
        return response.get("access_token")

    @classmethod
    def fetch_user_data(cls, access_token):
        """
        Fetches user data from the access token provided.

        Args:
        - access_token: str, the access token provided by GitHub.

        Returns:
        - dict, the user data.
        """
        user_url = "https://api.github.com/user"
        headers = {
            "Accept": "application/json",
            "Authorization": f"Bearer {access_token}",
        }
        status, response = fetch(method="GET", url=user_url, headers=headers)
        return response

    @classmethod
    def prepare_configurations(cls, user_id):
        """
        Creates default configuration when new account is created.

        Args:
        - user_id: int, the ID of the user.
        """
        UserConfiguration.objects.create(
            user_id=user_id, commit_interval=5, max_lines=30
        )

    @classmethod
    def create_account(cls, user_data, access_token):
        """
        Creates account and configurations along with it.

        Args:
        - user_data: dict, the user data.
        - access_token: str, the access token provided by GitHub.
        """
        account_id = user_data.get("id")
        update_values = {
            "account_id": account_id,
            "access_token": access_token,
            "email": user_data.get("email"),
            "user_name": user_data.get("login"),
            "name": user_data.get("name"),
            "company": user_data.get("company"),
            "account_type": "GitHub",
        }
        if instance := UserAccount.objects.filter(account_id=account_id).first():
            instance.set_values(update_values)
            instance.save()
        else:
            instance = UserAccount.objects.create(**update_values)
            cls.prepare_configurations(instance.id)

    @classmethod
    def prepare_session(cls, request, user_data):
        """
        Prepares session for the current user login.

        Args:
        - request: HttpRequest, the HTTP request object.
        - user_data: dict, the user data.
        """
        user_id = user_data.get("id")
        user_instance = UserAccount.objects.get(account_id=user_id)
        rotate_token(request=request)

        request.session["isLoggedIn"] = True
        request.session["user_id"] = user_id
        request.session["user"] = UserAccountSerializer(user_instance).data
        request.session["avatar_url"] = user_data.get("avatar_url")
        request.session.save()
        request.session.set_expiry(settings.SESSION_EXPIRY)

    @classmethod
    def fetch_repositories(cls, user_id):
        """fetching repository details related to the user"""
        user_instance = UserAccount.objects.get(account_id=user_id)
        repos = Repository.objects.filter(user=user_instance)
        all_repos_data = []
        for repo in repos:
            branches = Branch.fetch_branches(user_id, repo)
            branches_copy = copy.deepcopy(branches)
            repo_data = {
                "repo_id": repo.repo_id,
                "name": repo.name,
                "url": repo.url,
                "source_branches": branches,
                "target_branches": branches_copy,
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
            # fetching source configurations
            source_configurations = SourceConfiguration.objects.filter(
                repository=repository, user=user_instance
            )
            branch_details = []
            for source_configuration in source_configurations:
                source_branch = source_configuration.source_branch
                branch_name = source_branch.name
                commit_number = source_configuration.current_commit
                branch_details.append(
                    {"name": branch_name, "commit_number": commit_number}
                )
            # fetching target configurations
            target_configuration = TargetConfiguration.objects.get(
                user=user_instance, repository=repository
            )
            target_branch = target_configuration.target_branch
            # appending repo configs inside repository_details
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

    @classmethod
    def authorize(cls, oauth_code, request):
        """
        Authorizes and creates user.

        Args:
        - oauth_code: str, the OAuth code provided by GitHub.
        - request: HttpRequest, the HTTP request object.
        """
        access_token = cls.fetch_access_token(oauth_code=oauth_code)
        user_data = cls.fetch_user_data(access_token=access_token)
        cls.create_account(user_data=user_data, access_token=access_token)
        Repository.prepare_repositories(user=user_data, token=access_token)
        cls.prepare_session(request=request, user_data=user_data)
