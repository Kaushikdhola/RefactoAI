from django.urls import include, path

from account.views.github.auth import GithubAuthorizationView

github_urlpatterns = [path("authorize/", GithubAuthorizationView.as_view())]

urlpatterns = [
    path("github/", include(github_urlpatterns)),
    path("session/", GithubAuthorizationView.as_view()),
]
