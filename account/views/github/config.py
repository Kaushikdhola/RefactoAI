from django.contrib.auth import logout
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.renderers import JSONRenderer

from account.proxies.github_account import GitHubAccount
from account.models.account import UserAccount
from account.models.configuration import UserConfiguration
from account.models.branch import Branch
from account.models.refactor import Refactor
from account.models.commit_configuration import Commit_Configuration
from core.utils.base_view import BaseView


class GitHubConfigurationView(BaseView):
    model = GitHubAccount

    def get(self, request, *args, **kwargs):
        """returns session if exists"""
        user_id = request.session["user_id"]
        branch_details = self.model.fetch_branches(request=request,user_id=user_id)
        return HttpResponse(JSONRenderer().render(branch_details))

    def post(self,request,*args,**kwargs):
        """ sets the configurations"""
        user_id = request.session["user_id"]
        configs = request.data
        commit_interval = configs.get("commit_interval")
        max_lines = configs.get("max_lines")
        UserConfiguration.update(commit_interval=commit_interval,max_lines=max_lines,user_id=user_id)
        repositories = []
        for repo in configs.get("repositories"):
            source_branches = repo.get("source_branches")
            created_branches = []
            names = []
            for branch in source_branches:
                names.append(branch.get("name"))
                commit_configuration = Commit_Configuration.configure_branches(request=request,repo_id=repo.get("repo_id"),branch_name=branch.get("name"))
                created_branches.append(commit_configuration)
            target_branch = repo.get("target_branch")
            names.append(target_branch.get("name"))
            target_instance = Refactor.create_refactor(user_id=user_id,repo_id=repo.get("repo_id"),target_branch=target_branch.get("name"))
            repositories.append({"repo_id":repo.get("repo_id"),"source_branches":created_branches,"target_branch":target_instance})
            Branch.sync(user_id=user_id,names=names,repo_id=repo.get("repo_id"))
        config_details = {"commit_interval":commit_interval,"max_lines":max_lines,"repositories": repositories}
        return HttpResponse(config_details)