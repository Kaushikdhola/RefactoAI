import json
from unittest import TestCase, mock
from django.test import RequestFactory
from django.contrib.sessions.middleware import SessionMiddleware
from account.models.account import UserAccount
from account.models.branch import Branch
from account.models.pull_details import Pull_details
from account.models.repository import Repository
from account.proxies.dashboard_fetch import DashBoardFetch

class DashBoardFetchTests(TestCase):
    
    """ This test checks the behavior of the get_pull_requests_status method.
        It mocks the requests.get function and ensures that the method processes
        the mocked response correctly, updating the provided pull_requests_data.
        The expected result is then compared with the actual result.
    """

    # Testing the get_pull_requests_status method
    @mock.patch('requests.get')
    def test_get_pull_requests_status(self, mock_get):

        # Set up a mock response from the GitHub API
        mock_response = mock.Mock()
        mock_response.status_code = 200
        mock_response.json.return_value = {
            "head": {"ref": "test_branch"},
            "base": {"ref": "master"},
            "state": "open",
            "additions": 10,
            "deletions": 5,
            "comments": 3
        }
        mock_get.return_value = mock_response

        # Call the method and check the result
        pull_requests_data = [
            {"Repo_name": "test_repo", "pull_id": 123}
        ]
        result = DashBoardFetch.get_pull_requests_status(pull_requests_data)

        # Define the expected result based on the mock response
        expected_result = [
            {
                "Repo_name": "test_repo",
                "pull_id": 123,
                "source_branch": "test_branch",
                "target_branch": "master",
                "state": "open",
                "additions": 10,
                "deletions": 5,
                "comments_count": 3
            }
        ]
        # Assert that the result matches the expected result
        return self.assertEqual(result, expected_result)
        


    """
    This test checks the behavior of the PR_fetch method.
    It uses mock objects to simulate a Django request, a user account, 
    and a Pull_details instance. The test sets up a mock for the
    get_pull_requests_status method to control its behavior.
    The expected result is then compared with the actual result.
    """
    
    @mock.patch('account.proxies.dashboard_fetch.DashBoardFetch.get_pull_requests_status')
    def test_PR_fetch(self, mock_get_pull_requests_status):
        # Create a mock Django request object
        request = RequestFactory().get('/some-url')

        # Create a mock user account
        user_account_instance = UserAccount.objects.create(
            user_name='test_user',
            access_token='test_token'
        )

        # Create a mock Pull_details instance with the correct author field
        pull_details_instance = Pull_details.objects.create(
            Repo_name='test_repo',
            pull_id=123,
            author=user_account_instance,  # Use the UserAccount instance as the author
            title='test_title',
        )

        # Set up the mock for get_pull_requests_status
        mock_get_pull_requests_status.return_value = [
            {
                "Repo_name": "test_repo",
                "pull_id": 123,
                "source_branch": "test_branch",
                "target_branch": "master",
                "state": "open",
                "additions": 10,
                "deletions": 5,
                "comments_count": 3
            }
        ]

        # Call the PR_fetch method and check the result
        result = DashBoardFetch.PR_fetch(request, username='test_user')

        # Define the expected result based on the mock response
        expected_result = json.dumps([
            {
                "Repo_name": "test_repo",
                "pull_id": 123,
                "source_branch": "test_branch",
                "target_branch": "master",
                "state": "open",
                "additions": 10,
                "deletions": 5,
                "comments_count": 3
            }
        ], indent=4)

        # Assert that the result matches the expected result
        self.assertEqual(result, expected_result)

    # Testing the Branch_fetch method
    @mock.patch('github.Github')
    def test_Branch_fetch(self, mock_Github):
        # Create a mock Django request object
        request = RequestFactory().get('/some-url')

        # Create a mock user account
        user_account_instance = UserAccount.objects.create(
            user_name='test_user',
            access_token='test_token'
        )

        # Create a mock Branch instance
        branch_instance = Branch.objects.create(
            user_id=user_account_instance.id,
            repository_id=1,  # Set a valid repository_id
            name='test_branch'
        )

        # Create a mock Repository instance
        repository_instance = Repository.objects.create(
            id=1,  # Match the repository_id in the Branch instance
            name='test_repo'
        )

        # Set up the mock for Github API calls
        mock_github_instance = mock.MagicMock()
        mock_github_repo = mock_github_instance.get_repo.return_value
        mock_github_repo.get_commits.return_value = [
            mock.MagicMock(sha='test_sha', commit=mock.MagicMock(
                author=mock.MagicMock(name='test_author'),
                committer=mock.MagicMock(date='2023-01-01T12:00:00Z'),
                message='Test commit message'
            ))
        ]
        mock_Github.return_value = mock_github_instance

        # Call the Branch_fetch method and check the result
        with mock.patch('builtins.print') as mock_print:
            DashBoardFetch.Branch_fetch(request, user_account_instance)

            # Define the expected result based on the mock response
            expected_commit_info = {
                "Branch": "test_user/test_repo/test_branch",
                "Commit_sha": "test_sha",
                "Author": "test_author",
                "Date": "2023-01-01 12:00:00",
                "Message": "Test commit message",
            }

            # Assert that the print function was called with the expected commit_info
            mock_print.assert_called_with(json.dumps([expected_commit_info], indent=4))