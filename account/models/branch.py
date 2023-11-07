import requests
from django.db import models

from account.models.account import UserAccount
from account.models.repository import Repository
from core.models.base import BaseModel

class Branch(BaseModel):
    """Model/Manager for Branches"""
    name = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    user = models.ForeignKey(UserAccount, on_delete=models.CASCADE)
    repository = models.ForeignKey(Repository, on_delete=models.CASCADE)

    class Meta:
        db_table = "Branch"
    
    @classmethod
    def fetch_branches(cls,request,repo):
        api_url= repo.url +"/branches"
        token = request.session["access_token"]
        headers = {"Accept":"application/json","Authorization":f"Bearer {token}"}
        response = requests.get(api_url,headers=headers)
        branches_data = response.json()
        # filters all branches whose names starts with refacto-start
        filtered_branches = [branch for branch in branches_data if not branch["name"].startswith("refacto-start")]
        return filtered_branches
        # need to remove the commit keys in the json
    
    @classmethod
    def prepare_branches(request,repo,user):
        pass

    @classmethod
    def create_branch(cls,request,repo_id, branch_name):
        # Create branches for the provided repo_id and branch names
        user_id = request.session["user_id"]
        user_instance = UserAccount.getUser(user_id)
        repository_instance = Repository.getRepository(repo_id=repo_id,user_id=user_id)
        branch, created = cls.objects.get_or_create(repository=repository_instance, name=branch_name,user=user_instance)
        return branch

    @classmethod
    def sync(cls,user_id,names,repo_id):
        user_instance = UserAccount.getUser(user_id)
        repository_instance = Repository.getRepository(repo_id=repo_id,user_id=user_id)
        branches_to_delete = Branch.objects.filter(~Q(name__in=branch_names),user=user_account,repository=repository)
        # Delete the fetched branches
        branches_to_delete.delete()