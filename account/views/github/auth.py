from django.conf import settings
from django.http import HttpResponse, JsonResponse
from rest_framework.renderers import JSONRenderer

from account.proxies.github_account import GitHubAccount
from core.utils.base_view import BaseView


class GithubAuthorizationView(BaseView):
    model = GitHubAccount

    def post(self, request, *args, **kwargs):
        payload = self.parse_payload(request=request)
        code = payload.get("code")
        self.model.authorize(code=code, request=request)
        request.session["isLoggedIn"] = True
        request.session.save()
        request.session.set_expiry(settings.SESSION_EXPIRY)
        return JsonResponse(
            data={"message": "Authorization Successful!!"},
            status=200,
            safe=False,
        )

    def get(self, request, *args, **kwargs):
        """returns session if exists"""
        _session = request.session
        return HttpResponse(JSONRenderer().render(_session))
