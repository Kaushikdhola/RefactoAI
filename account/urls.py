from django.urls import path

from account.views.api import TestAPIView

urlpatterns = [path("", TestAPIView.as_view())]
