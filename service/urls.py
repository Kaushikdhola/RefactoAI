from django.urls import include, path

from .views.webhooks import PushWebhookView

github_patterns = [path("event/", PushWebhookView.as_view(), name="github_event")]

urlpatterns = [path("github/", include(github_patterns))]
