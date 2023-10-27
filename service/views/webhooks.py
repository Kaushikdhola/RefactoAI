import json

import requests
from django.http import JsonResponse
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView


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
                        files_changes = self.getChanges(commit_info)
                    except json.JSONDecodeError as e:
                        return Response(
                            {
                                "status": "error",
                                "message": "Failed to decode JSON response",
                            },
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                        )

                    # for file_change in files_changes:
                    #     # print(file_change)
                    #     for filename, value in file_change.items():
                    #         print("\n")
                    #         print("Filename : " + filename)
                    #         for i, x in enumerate(value):
                    #             print("Part " + str(i) + ":")
                    #             print(x)

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

    def getChanges(self, commit_info):
        # print("\n")
        # print("Commit Info:", commit_info["files"], flush = True)
        files_changes = []
        if len(commit_info["files"]) > 0:
            for file_info in commit_info["files"]:
                changed_blocks = []
                current_block = []
                file_blocks = []
                # tmp_dict = {}
                if file_info["status"] == "modified" and file_info["additions"] > 2:
                    patch = file_info["patch"]
                    lines = patch.split("\n")
                    # print(lines)
                    for line in lines:
                        if line.startswith("@@"):
                            if current_block:
                                changed_blocks.append(current_block)
                                current_block = []
                        if line.startswith("+"):
                            current_block.append(line[1:])
                    if current_block:
                        changed_blocks.append(current_block)

                    for change_block in changed_blocks:
                        changed_part = "\n".join(change_block)
                        file_blocks.append(changed_part)
                    # tmp_dict[file_info["filename"]] = file_blocks
                    files_changes.append({file_info["filename"]: file_blocks})
        return files_changes
