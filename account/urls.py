from django.urls import path
from account.views.api import Fetch_Access,Fetch_Code

urlpatterns = [
    path("callback/code/", Fetch_Code.as_view()),
    path("callback/access_token/", Fetch_Access.as_view()),
    ]
