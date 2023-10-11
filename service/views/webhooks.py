import json
import requests
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.http import JsonResponse

class PushWebhookView(APIView):
    def post(self, request):
        payload = json.loads(request.body.decode('utf-8'))
        event = request.headers.get('X-GitHub-Event')
        if event == 'push':

            repository_title = payload['repository']['full_name']
            commit_id = payload['head_commit']['id']

            github_api_commit_url = f'https://api.github.com/repos/{repository_title}/commits/{commit_id}'
            response_commit = requests.get(github_api_commit_url)

            if response_commit.status_code == 200:
                commit_info = response_commit.json()
                # Process commit information as needed

            return Response({'status': 'success'})

        return Response({'status': 'error'}, status=status.HTTP_400_BAD_REQUEST)