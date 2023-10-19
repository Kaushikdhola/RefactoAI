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
            headers={"Accept": "application/json"},
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
    def create_account(cls, user):
        """creates account and configurations along with it"""
        #todo:kaushik
        pass

    @classmethod
    def prepare_session(cls, request):
        """prepares session for the current user login"""
        rotate_token(request=request)
        request.session["isLoggedIn"] = True
        request.session.save()
        request.session.set_expiry(settings.SESSION_EXPIRY)

    @classmethod
    def authorize(cls, code, request):
        """authorizes and user creation"""
        token = cls.fetch_access_token(code=code)
        user = cls.fetch_user_data(token=token)
        cls.create_account(user=user)
        cls.prepare_session(request=request)
