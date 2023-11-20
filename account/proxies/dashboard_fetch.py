import json
import logging
from datetime import datetime

import requests
from django.conf import settings
from django.core.serializers import serialize
from github import Github

from account.models.account import UserAccount
from account.models.branch import Branch
from account.models.pull_details import Pull_details
from account.models.repository import Repository

logger = logging.getLogger("dashboard_fetch")


class DashBoardFetch(Pull_details):
    class Meta:
        proxy = True

    @classmethod
    def get_pull_requests_status(cls, pull_requests):
        """
        Fetch additional details for each pull request from the GitHub API and update the provided data.

        Args:
            pull_requests (list): List of dictionaries representing pull request data.

        Returns:
            list: Updated list of pull request data with additional details.
        """

        for pull_request in pull_requests:
            status_url = f"{pull_request['Repo_name']}/pulls/{pull_request['pull_id']}"

            response = requests.get(status_url)

            if response.status_code == 200:
                pull_request_details = response.json()
                pull_request.update(
                    {
                        "source_branch": pull_request_details.get("head", {}).get(
                            "ref"
                        ),
                        "target_branch": pull_request_details.get("base", {}).get(
                            "ref"
                        ),
                        "state": pull_request_details.get("state"),
                        "additions": pull_request_details.get("additions"),
                        "deletions": pull_request_details.get("deletions"),
                        "comments_count": pull_request_details.get("comments"),
                    }
                )

        return pull_requests

    @classmethod
    def fetch_pr_details(cls, username):
        """
        Fetch and serialize pull details for a specific user from the database.

        Args:
            request: Django request object.
            username (str): Username for which to fetch pull details.

        Returns:
            str: JSON-formatted string containing pull details.
        """
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
    def get_pull_request_commits(cls, repo, pull_request_number, access_token):
        """
        Get the commits for a specific pull request.

        Args:
            repo (str): The repository URL.
            pull_request_number (str): The number of the pull request.
            access_token (str): The GitHub API access token.

        Returns:
            list or None: List of commits if successful, None otherwise.
        """

        base_url = f"{repo}/pulls/{pull_request_number}/commits"
        headers = {"Authorization": f"token {access_token}"}

        response = requests.get(base_url, headers=headers)

        if response.status_code == 200:
            commits = response.json()
            return commits
        else:
            return None

    @classmethod
    def extract_commit_details(cls, commit, user_account_instance):
        """
        Extract relevant details from a commit.

        Args:
            commit (dict): Commit information from the GitHub API.
            user_account_instance: Instance of UserAccount model.

        Returns:
            dict: Extracted commit details.
        """

        username = user_account_instance.user_name
        sha = commit.get("sha")
        message = commit.get("commit").get("message")
        author_name = commit.get("commit").get("author").get("name")
        date = commit.get("commit").get("author").get("date")

        branch_url = commit.get("url")
        branch_name = username + "/" + branch_url.split("/")[5]

        return {
            "sha": sha,
            "message": message,
            "author_name": author_name,
            "date": date,
            "Repo_name": branch_name,
        }

    @classmethod
    def fetch_branch(cls, account):
        """
        Fetch commit data for branches associated with a user's account.

        Args:
            account: Instance of UserAccount model.

        Returns:
            str: JSON string containing branch details including all commits.
        """
        pull_requests = Pull_details.objects.filter(author_id=account.user_name)
        all_commits = [
            cls.extract_commit_details(commit, account)
            for pull_request in pull_requests
            for commit in cls.get_pull_request_commits(
                pull_request.Repo_name, pull_request.pull_id, account.access_token
            )
        ]
        return json.dumps(all_commits)

    @classmethod
    def fetch_dashboard_data(cls, request):
        """
        Initial point to fetch the details.

        Args:
            request: Django request object.

        Returns:
            json_data: json containing requested data.
        """
        user_id = request.session.get("user_id")
        user_account_instance = UserAccount.objects.get(account_id=user_id)
        username = user_account_instance.user_name
        json_branch_data = cls.fetch_branch(account=user_account_instance)
        json_pr_data = cls.fetch_pr_details(username=username)
        return {
            "json_branch_data": json_branch_data,
            "json_pr_data": json_pr_data,
        }
