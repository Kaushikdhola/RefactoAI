import requests
from django.db import models
from account.models.account import UserAccount
from core.models.base import BaseModel

class Repository(BaseModel):
    """ Repositories for each User """
    user = models.ForeignKey(UserAccount,on_delete=models.CASCADE)
    repo_id = models.BigIntegerField()
    name = models.CharField(max_length=100)
    url = models.CharField(max_length=500)

    class Meta:
        db_table = "Repository"

    @classmethod
    def prepare_repositores(cls,user,token):
        repos = cls.fetch_repos(token=token)
        account_id = user.get("id")
        user_intance = UserAccount.getUser(account_id)

        for repo in repos:
            repo_id = repo.get("id")
            update_values = {
                "account": user_intance,
                "repo_id":repo_id,
                "name": repo.get("name"),
                "url": repo.get("url"),
            }
            instance = {}
            if instance := cls.objects.filter(user=user_intance,repo_id=repo_id).first():
                instance.set_values(update_values)
                instance.save()
            else:
                instance = cls.objects.create(**update_values)
                instance.save()

    @classmethod
    def fetch_repos(cls,token):
        """ fetches repositories of the user """
        repo_api = "https://api.github.com/user/repos"
        token_payload = {
            "scope":"repo",
            "visibility":"all",
        }
        headers = {"Accept":"application/json","Authorization":f"Bearer {token}"}
        reponse = requests.get(repo_api,headers=headers,data=token_payload)
        return reponse.json()

    @classmethod
    def fetch_Repositories(request,user):
        repositories =  cls.objects.filter(user=user)
        return repositories