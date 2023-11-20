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
    def get_pull_requests_status(cls, pull_requests_data):
        """
        Fetch additional details for each pull request from the GitHub API and update the provided data.

        Args:
            pull_requests_data (list): List of dictionaries representing pull request data.

        Returns:
            list: Updated list of pull request data with additional details.
        """

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
    def PR_fetch(cls, request, username):
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
    def Branch_fetch(cls, user_account_instance):
        """
        Fetch commit data for branches associated with a user's account.

        Args:
            user_account_instance: Instance of UserAccount model.

        Returns:
            str: JSON string containing branch details including all commits.
        """

        username = user_account_instance.user_name
        access_token = user_account_instance.access_token

        pull_requests = Pull_details.objects.filter(author_id=username)

        commit_json = json.dumps([])

        all_commits_details = []

        for pull_request in pull_requests:
            pull_request_number = pull_request.pull_id
            commits = cls.get_pull_request_commits(
                pull_request.Repo_name, pull_request_number, access_token
            )

            pull_request_commits_details = []

            if commits:
                for commit in commits:
                    commit_details = cls.extract_commit_details(
                        commit, user_account_instance
                    )
                    pull_request_commits_details.append(commit_details)
                    all_commits_details.append(commit_details)

            else:
                print(
                    f"Failed to retrieve commits for Pull Request #{pull_request_number}"
                )

        commit_json = json.dumps(all_commits_details)

        return commit_json

    # @classmethod
    # def Branch_fetch(cls, user_account_instance):
    #     """
    #     Fetch commit data for branches associated with a user's account.

    #     Args:
    #         request: Django request object.
    #         user_account_instance: Instance of UserAccount model.

    #     Returns:
    #         json_commits: json containing branch details including all commits
    #     """
    #     user_id = user_account_instance.id

    #     branches = Branch.objects.filter(user_id=user_id)

    #     # appending the data in the list
    #     commit_data = []

    #     current_branch_name = ""

    #     commit_json = json.dumps([])

    #     for branch in branches:
    #         repository = Repository.objects.get(id=branch.repository_id)
    #         repo_name = repository.name

    #         gitinstance = Github(
    #             user_account_instance.user_name, user_account_instance.access_token
    #         )
    #         gitrepo = gitinstance.get_repo(
    #             f"{user_account_instance.user_name}/{repo_name}"
    #         )
    #         current_branch_name = (
    #             user_account_instance.user_name + "/" + repo_name + "/" + branch.name
    #         )

    #         # Retrieve commits for the branch
    #         commits = gitrepo.get_commits(sha=branch.name)

    #         commit_info = {}

    #         filter_timestamp = datetime.strptime(
    #             str(branch.updated_at), "%Y-%m-%d %H:%M:%S.%f%z"
    #         )

    #         for commit in commits:
    #             commit_date = datetime.strptime(
    #                 str(commit.commit.author.date), "%Y-%m-%d %H:%M:%S%z"
    #             )

    #             if commit_date > filter_timestamp:
    #                 commit_info = {
    #                     "Branch": current_branch_name,
    #                     "Commit_sha": commit.sha,
    #                     "Author": commit.commit.author.name,
    #                     "Date": str(commit.commit.author.date),
    #                     "Message": commit.commit.message,
    #                 }
    #             if commit.commit.author.date > filter_timestamp:
    #                 commit_data.append(commit_info)

    #         commit_json = json.dumps(commit_data, indent=4)

    #         logger.info(f"Commit data for {current_branch_name}: {commit_json}")

    #     return commit_json

    @classmethod
    def fetchPoint(cls, request):
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

        json_branch_data = cls.Branch_fetch(user_account_instance=user_account_instance)

        print(json_branch_data)

        json_pr_data = cls.PR_fetch(request=request, username=username)

        print(json_pr_data)
        return {
            "json_branch_data": json_branch_data,
            "json_pr_data": json_pr_data,
        }
