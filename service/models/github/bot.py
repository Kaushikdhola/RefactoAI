from datetime import datetime
from typing import Dict, Optional

from django.http import HttpRequest
from github import Branch, Github, InputGitTreeElement

from core.utils.requests import fetch
from service.models.github.event import GithubEvent
from service.models.github.refactor import GithubRefactorService
from account.models.pull_details import Pull_details


class GithubBot:
    """Class for managing operations on GitHub repos"""

    def __init__(
        self, request: Optional[HttpRequest] = None, is_event: bool = True
    ) -> None:
        """
        Initializes GithubBot instance.

        Args:
            request: HttpRequest instance.
            is_event: Boolean indicating if request is an event.
        """
        super().__init__()
        self.event: Optional[GithubEvent] = None
        self.request: Optional[HttpRequest] = request
        self.is_event: bool = is_event
        self.prepare_bot_instance()

    def prepare_bot_instance(self) -> None:
        """Prepares account and repositories."""
        if self.request and self.is_event:
            self.process_event()

        if self.event and self.event.account:
            self.prepare_github_account()

    def prepare_github_account(self) -> None:
        """Prepares Github account."""
        pass

    def get_commit(self, owner: str, repo: str, commit_id: str) -> Dict:
        """
        Gets information of commit from GitHub.

        Args:
            owner: Owner of the repository.
            repo: Name of the repository.
            commit_id: ID of the commit.

        Returns:
            Dictionary containing commit information.
        """
        url = f"https://api.github.com/repos/{owner}/{repo}/commits/{commit_id}"
        status, response = fetch(url=url, method="GET")
        return response

    def validate_configurations(self) -> bool:
        """
        Validates configurations.

        Returns:
            Boolean indicating if configurations are valid.
        """
        branch_name: str = self.event.payload.get("ref").split("/")[-1]
        print("branch name: ", branch_name, flush=True)
        return not branch_name.__contains__("refactored-by-re-facto")

    def create_new_branch(self) -> None:
        """Creates new branch."""
        base_branch_name = self.event.payload.get("ref").split("/")[-1]
        base_branch = self.repo.get_branch(base_branch_name)
        new_branch_name = f"{base_branch_name}-refactored-by-re-facto-{datetime.now().strftime('%Y-%m-%d-%H-%M-%S')}"
        self.refactored_branch = self.repo.create_git_ref(
            f"refs/heads/{new_branch_name}", base_branch.commit.sha
        )

    def commit_refactored_code(self) -> None:
        """Commits refactored code."""
        if not self.refactored_branch:
            return

        branch_name = self.refactored_branch.ref.split("/")[-1]
        branch: Branch = self.repo.get_branch(branch_name)
        parent = branch.commit
        commit_message = "refactor: code refactored using re-facto plugin"
        new_tree = self.repo.create_git_tree(
            tree=[
                InputGitTreeElement(
                    path=list(file.keys())[0],
                    mode="100644",
                    type="blob",
                    sha=self.repo.create_git_blob(
                        content=list(file.values())[0], encoding="utf-8"
                    ).sha,
                )
                for file in self.refactored_code
            ],
            base_tree=self.repo.get_git_tree(sha=parent.sha),
        )

        commit = self.repo.create_git_commit(
            message=commit_message,
            tree=self.repo.get_git_tree(sha=new_tree.sha),
            parents=[self.repo.get_git_commit(parent.sha)],
        )

        branch_ref = self.repo.get_git_ref(ref=f"heads/{branch_name}")
        branch_ref.edit(commit.sha)

    def raise_pull_request(self) -> None:
        """Raises pull request."""
        if not self.refactored_branch:
            return
        branch_name = self.refactored_branch.ref.split("/")[-1]
        base_branch_name = self.event.payload.get("ref").split("/")[-1]
        title = f"Refactor {base_branch_name} branch using re-facto plugin"
        body = "This pull request is raised automatically using re-facto plugin"
        pull_data = self.repo.create_pull(
            title=title, body=body, base=base_branch_name, head=branch_name
        )
        pull_id = pull_data.number
        author_id = self.repo.full_name.split("/")[0]
        repo_name = f"https://api.github.com/repos/{self.repo.full_name}"
        pull_details = {'pull_id': pull_id,
                        'Repo_name': repo_name,
                        'author': author_id,
                        'title': title}
        Pull_details.save_pull_details(data_dict=pull_details)
        pass

    def refactor(self) -> None:
        """Refactors the given commit."""
        if not self.validate_configurations():
            return

        owner = self.event.payload.get("repository", {}).get("owner", {}).get("login")
        repo_name = self.event.payload.get("repository", {}).get("name")
        commit_id = self.event.payload.get("head_commit", {}).get("id")
        self.commit = self.get_commit(owner, repo_name, commit_id)
        self.refactor_service = GithubRefactorService(
            account=self.event.account, commit=self.commit
        )
        self.refactored_code = self.refactor_service.refactor()
        if not self.refactored_code:
            return
        self.repo = self.github.get_user().get_repo(repo_name)
        self.create_new_branch()
        self.commit_refactored_code()
        self.raise_pull_request()

    def process_event(self) -> None:
        """Processes events generated by GitHub."""
        event = GithubEvent(request=self.request)
        self.event = event.listen()
        self.github = Github(self.event.account.access_token)
        self.execute_event()

    def execute_event(self) -> None:
        """Executes event based on conditions."""
        event_mapper = {
            "push": self.refactor,
        }
        if self.event.type in event_mapper:
            event_mapper[self.event.type]()