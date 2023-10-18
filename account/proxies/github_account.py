import requests
from django.conf import settings
from django.middleware.csrf import rotate_token

from account.models.account import UserAccount
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
    def fetch_user_data(cls, token):
        """fetches user data from access token provided"""
        user_url = "https://api.github.com/user"
        headers = {"Accept": "application/json", "Authorization": f"Bearer {token}"}
        response = requests.get(user_url, headers=headers)
        return response.json()

    def prepare_session(self):
        """ """
        pass

    @classmethod
    def authorize(cls, code, request):
        """authorizes and user creation"""

        # get code from the frontend
        if not code:
            raise ValidationError("OAuth code not provided")

        token_payload = {
            "client_id": settings.GITHUB_CLIENT_ID,
            "client_secret": settings.GITHUB_APP_SECRET,
            "code": code,
        }

        # get access token from github api
        response = requests.post(
            cls.ACCESS_TOKEN_URL,
            headers={"Accept": "application/json"},
            data=token_payload,
        )

        response_payload = response.json()
        access_token = response_payload.get("access_token")

        rotate_token(request=request)

        # get the user data
        cls.fetch_user_data(token=access_token)
        # print(user_data)
        # create the profile account

        # create the configurations
