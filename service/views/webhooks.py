import json
import requests
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from service.views.refactor import Refactor
from service.views.utils import get_changes

refactor = Refactor()

class PushWebhookView(APIView):
    def post(self, request):
        try:
            payload = json.loads(request.body.decode("utf-8"))
            # print("Payload:", payload, flush = True)
            # print("\n")
            event = request.headers.get("X-GitHub-Event")
            if event == "push":
                try:
                    repository_title = payload["repository"]["full_name"]
                    commit_id = payload["head_commit"]["id"]
                except KeyError as e:
                    return Response(
                        {
                            "status": "error",
                            "message": "Key missing in payload message",
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )
                github_api_commit_url = f"https://api.github.com/repos/{repository_title}/commits/{commit_id}"

                try:
                    response_commit = requests.get(github_api_commit_url)
                except requests.exceptions.RequestException as e:
                    return Response(
                        {"status": "error", "message": "Error in fetching commit data"},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    )

                if response_commit.status_code == 200:
                    try:
                        commit_info = response_commit.json()
                        files_changes = get_changes(commit_info)
                    except json.JSONDecodeError as e:
                        return Response(
                            {
                                "status": "error",
                                "message": "Failed to decode JSON response",
                            },
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                        )
                    if len(files_changes) != 0:
                        refactor.refactor_change_code(files_changes)
                    else:
                        print("No changes")
                return Response({"status": "success"})

            return Response(
                {"status": "error", "message": "Event type is Invalid!!!!!"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except Exception as e:
            return Response(
                {"status": "error", "message": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )