from django.contrib import admin
from django.urls import include, path
from rest_framework.documentation import include_docs_urls

app_patterns = [
    path("account/", include("account.urls")),
    path("service/", include("service.urls")),
]

urlpatterns = [
    path("api/", include(app_patterns)),
    path("api-docs/", include_docs_urls(title="Re-Factor APIs"))
]
