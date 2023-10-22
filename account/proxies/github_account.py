import requests
from django.conf import settings
from django.middleware.csrf import rotate_token
from account.models.account import UserAccount
from account.models.configuration import UserConfiguration
from core.utils.exceptions import ValidationError
from datetime import datetime
from django.db.models.signals import post_save


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
    
    def add_initial_configurations(cls, uuid):
        try:
            print("add")
            config=UserConfiguration(id=uuid,
                                     commitsnum=5,
                                     linesnum=30)
            config.save()
        except Exception as e:
            return e

    @classmethod
    def create_account(cls, user,request,token,account_data):
        """creates account and configurations along with it"""
        
        # access_url = "https://api.github.com/user"
        # headers = {'Authorization':request.META.get('HTTP_AUTHORIZATION')}
        
        try:
            
            # Adding blank values if email is null
            if account_data['email']==None:
                account_data['email']=""

            # data={'account_id':account_data['id'],'access_token':token,'email':account_data['email'],'user_name':account_data['login'], 'name':account_data['name'],'company':account_data['company']}
            
            #adding user record if user does not exits in a table
            try:
                create=UserAccount(account_id=account_data['id'],
                                               access_token=token,
                                                        email=account_data['email'],
                                                        user_name=account_data['login'],
                                                        name=account_data['name'],
                                                        company=account_data['company'],
                                                        updated_at=datetime.now())
            
                create.save()

            #updating user specific values if user exits in a table
            except:

                update=UserAccount.objects.filter(account_id=account_data['id']).update(
                                               access_token=token,
                                                        email=account_data['email'],
                                                        user_name=account_data['login'],
                                                        name=account_data['name'],
                                                        company=account_data['company'],
                                                        updated_at=datetime.now())
                update.save()

        except Exception as e:
            return e


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

        #defining dictionary to store extracted data
        account_data={}
            
        req_details=['id','email','login','name','company']
        

        #extracing user data to store in a UserAccount table
        for i,j in user.items():
            if i in req_details:
                account_data[i] = j
        
        cls.create_account(user=user,request=request,token=token,account_data=account_data)
        

        #Adding Initial Configurations in UserConfiguraion table

        #Retrieving current accound uuid
        uuid=UserAccount.objects.filter(account_id=account_data['id']).values('id')
        uuid=uuid[0]['id']  
        
        #adding configurations for current user
        cls.add_initial_configurations(uuid=uuid)

        cls.prepare_session(request=request)
