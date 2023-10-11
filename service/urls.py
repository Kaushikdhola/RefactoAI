from django.urls import path
from .views.webhooks import PushWebhookView


urlpatterns = [
    path('push-event/', PushWebhookView.as_view(), name='push_event')
]