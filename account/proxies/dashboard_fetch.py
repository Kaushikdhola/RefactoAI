import json

import requests
from django.conf import settings
from django.core.serializers import serialize
from django.http import JsonResponse
from django.middleware.csrf import rotate_token

from account.models.account import UserAccount
from account.models.pull_details import Pull_details


class DashBoardFetch(Pull_details):
    class Meta:
        proxy = True

    @classmethod
    def get_pull_requests_status(cls, pull_requests_data):
        for pr_data in pull_requests_data:
            Repo_name = pr_data["Repo_name"]
            pull_id = pr_data["pull_id"]
            status_url = f"{Repo_name}/pulls/{pull_id}"

            response = requests.get(status_url)

            if response.status_code == 200:
                pr_details = response.json()
                source_branch = (
                    pr_details["head"]["ref"]
                    if "head" in pr_details and "ref" in pr_details["head"]
                    else None
                )
                target_branch = (
                    pr_details["base"]["ref"]
                    if "base" in pr_details and "ref" in pr_details["base"]
                    else None
                )
                state = pr_details["state"] if "state" in pr_details else None
                additions = (
                    pr_details["additions"] if "additions" in pr_details else None
                )
                deletions = (
                    pr_details["deletions"] if "deletions" in pr_details else None
                )
                comments_count = (
                    pr_details["comments"] if "comments" in pr_details else None
                )

                pr_data["source_branch"] = source_branch
                pr_data["target_branch"] = target_branch
                pr_data["state"] = state
                pr_data["additions"] = additions
                pr_data["deletions"] = deletions
                pr_data["comments_count"] = comments_count

            else:
                print(f"Failed to fetch status for Pull Request {pull_id}")

        return pull_requests_data

    @classmethod
    def PR_fetch(cls, request):
        access_token = request.session.get("access_token")

        user_account_instance = UserAccount.objects.get(access_token=access_token)

        username = user_account_instance.user_name
        try:
            pull_details_instance = Pull_details.objects.filter(author_id=username)
        except:
            pass

        serialized_data = serialize("json", pull_details_instance)

        deserialized_data = json.loads(serialized_data)

        extracted_data = []
        for data in deserialized_data:
            fields = {
                "Repo_name": data["fields"]["Repo_name"],
                "pull_id": data["fields"]["pull_id"],
                "author": data["fields"]["author"],
                "title": data["fields"]["title"],
            }
            extracted_data.append(fields)

        data = cls.get_pull_requests_status(extracted_data)

        json_data = json.dumps(data, indent=4)
        return json_data

    @classmethod
    def fetchPoint(cls, request):
        """Initial point to fetch the pull details"""

        json_data = cls.PR_fetch(request=request)
        return json_data
