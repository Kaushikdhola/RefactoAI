from django.urls import include, path

from account.views.github.auth import GithubAuthorizationView
from account.views.github.config import GitHubConfigurationView

github_urlpatterns = [
    path("authorize/", GithubAuthorizationView.as_view()),
    path("configurations/", GitHubConfigurationView.as_view()),
]

urlpatterns = [
    path("github/", include(github_urlpatterns)),
    path("session/", GithubAuthorizationView.as_view()),
    path("logout/", GithubAuthorizationView.as_view()),
]
