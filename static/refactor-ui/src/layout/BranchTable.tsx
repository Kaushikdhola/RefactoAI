/* eslint-disable jsx-a11y/anchor-is-valid */
import * as React from "react";
import Table from "@mui/joy/Table";
import Typography from "@mui/joy/Typography";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";

import { Autocomplete, Card, CardContent, Grid, Stack } from "@mui/joy";
import { POST } from "../utils/axios";

const json_branch_data = [
  {
    sha: "3e20c598e585442d2e1f510d853eee442f1dbd7a",
    message: "Update Test3",
    author_name: "Kaushik Dhola",
    date: "2023-11-18T18:41:21Z",
    Repo_name: "Kaushikdhola/TestingRefacto",
  },
  {
    sha: "e73406024f71a77fad7e8c4cee31948d1d4a36bf",
    message: "Update Test3 2",
    author_name: "Kaushik Dhola",
    date: "2023-11-19T23:27:13Z",
    Repo_name: "Kaushikdhola/TestingRefacto",
  },
  {
    sha: "484ccf368923a27cff7995e91168e03850e554ab",
    message: "Create Test3",
    author_name: "Kaushik Dhola",
    date: "2023-11-06T16:42:58Z",
    Repo_name: "Kaushikdhola/TestingRefacto",
  },
  {
    sha: "e2698be8b80acacf2630ed3830b5525b252b64e7",
    message: "Update Test3",
    author_name: "Kaushik Dhola",
    date: "2023-11-06T18:50:03Z",
    Repo_name: "Kaushikdhola/TestingRefacto",
  },
  {
    sha: "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0",
    message: "Fix Bug",
    author_name: "John Doe",
    date: "2023-11-22T12:30:45Z",
    Repo_name: "JohnDoe/ProjectX",
  },
  {
    sha: "1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0",
    message: "Add Feature",
    author_name: "Jane Smith",
    date: "2023-11-25T09:15:30Z",
    Repo_name: "JaneSmith/ProjectY",
  },
  {
    sha: "b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0",
    message: "Enhance Test",
    author_name: "Alice Johnson",
    date: "2023-11-28T15:45:00Z",
    Repo_name: "AliceJohnson/TestingImprovement",
  },
  {
    sha: "c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0",
    message: "Refactor Code",
    author_name: "Bob Anderson",
    date: "2023-11-30T08:00:22Z",
    Repo_name: "BobAnderson/CodeRefactoring",
  },
  {
    sha: "d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0",
    message: "Merge Feature Branch",
    author_name: "Chris Williams",
    date: "2023-12-02T14:20:17Z",
    Repo_name: "ChrisWilliams/FeatureMerge",
  },
  {
    sha: "e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1",
    message: "Fix Security Issue",
    author_name: "Eva Martinez",
    date: "2023-12-05T10:55:45Z",
    Repo_name: "EvaMartinez/SecurityFix",
  },
  {
    sha: "f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2",
    message: "Update Documentation",
    author_name: "Frank Lee",
    date: "2023-12-08T16:10:33Z",
    Repo_name: "FrankLee/DocumentationUpdate",
  },
];

const json_pr_data = [
  {
    Repo_name: "Kaushikdhola/TestingRefacto",
    pull_id: 4,
    author: "Kaushikdhola",
    title: "Update Test3",
    source_branch: "Testin3",
    target_branch: "main",
    state: "open",
    additions: 2,
    deletions: 0,
    comments_count: 0,
  },
  {
    Repo_name: "Kaushikdhola/TestingRefacto",
    pull_id: 2,
    author: "Kaushikdhola",
    title: "Create Test3",
    source_branch: "Testin3",
    target_branch: "main",
    state: "closed",
    additions: 7,
    deletions: 0,
    comments_count: 0,
  },
  {
    Repo_name: "JohnDoe/ProjectX",
    pull_id: 5,
    author: "JohnDoe",
    title: "Fix Bug",
    source_branch: "BugFix",
    target_branch: "main",
    state: "open",
    additions: 3,
    deletions: 1,
    comments_count: 2,
  },
  {
    Repo_name: "JaneSmith/ProjectY",
    pull_id: 3,
    author: "JaneSmith",
    title: "Add Feature",
    source_branch: "NewFeature",
    target_branch: "main",
    state: "closed",
    additions: 10,
    deletions: 2,
    comments_count: 5,
  },
  {
    Repo_name: "AliceJohnson/TestingImprovement",
    pull_id: 8,
    author: "AliceJohnson",
    title: "Enhance Test",
    source_branch: "TestEnhancement",
    target_branch: "main",
    state: "open",
    additions: 5,
    deletions: 0,
    comments_count: 1,
  },
  {
    Repo_name: "BobAnderson/CodeRefactoring",
    pull_id: 6,
    author: "BobAnderson",
    title: "Refactor Code",
    source_branch: "CodeRefactor",
    target_branch: "main",
    state: "closed",
    additions: 8,
    deletions: 3,
    comments_count: 3,
  },
  {
    Repo_name: "ChrisWilliams/FeatureMerge",
    pull_id: 11,
    author: "ChrisWilliams",
    title: "Merge Feature Branch",
    source_branch: "FeatureBranch",
    target_branch: "main",
    state: "open",
    additions: 15,
    deletions: 4,
    comments_count: 6,
  },
  {
    Repo_name: "EvaMartinez/SecurityFix",
    pull_id: 7,
    author: "EvaMartinez",
    title: "Fix Security Issue",
    source_branch: "SecurityFix",
    target_branch: "main",
    state: "closed",
    additions: 6,
    deletions: 1,
    comments_count: 2,
  },
  {
    Repo_name: "FrankLee/DocumentationUpdate",
    pull_id: 9,
    author: "FrankLee",
    title: "Update Documentation",
    source_branch: "DocumentationUpdate",
    target_branch: "main",
    state: "open",
    additions: 4,
    deletions: 0,
    comments_count: 4,
  },
  {
    Repo_name: "SusanMiller/FeatureImplementation",
    pull_id: 10,
    author: "SusanMiller",
    title: "Implement New Feature",
    source_branch: "NewFeatureImplementation",
    target_branch: "main",
    state: "closed",
    additions: 12,
    deletions: 2,
    comments_count: 8,
  },
];

interface pullData {
  pull_id: number;
  author: string;
  title: string;
  source_branch: string;
  target_branch: string;
  additions: number;
}

interface branchData {
  message: string;
  author_name: string;
  date: string;
  Repo_name: string;
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = "asc" | "desc";

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string }
) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
function stableSort<T>(
  array: readonly T[],
  comparator: (a: T, b: T) => number
) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

export default function BranchTable() {
  const [order] = React.useState<Order>("desc");
  let [repoList, setRepoList] = React.useState<string[]>([]);
  let [selectedRepo, setSelectedRepo] = React.useState<any>();
  const [branchList, setBranchList] = React.useState<any>([]);
  let [isDataEmpty, setIsDataEmpty] = React.useState(false);
  const [isRepoSelected, setIsRepoSelected] = React.useState(false);

  const [repoRows, setRepoRows] = React.useState<Array<pullData>>([]);
  const [branchRows, setBranchRows] = React.useState<Array<branchData>>([]);

  /**
   * Fetches the repository branches from the API.
   * Makes a POST request to the 'api/account/dashboard/home/' endpoint.
   * Logs the received data and updates the state with the branch list.
   * Sets the isDataEmpty state to true if no branch or PR data is found.
   * Logs any errors that occur during the API request.
   */
  const fetchRepoBranches = async () => {
    // Making a POST request to the 'api/account/dashboard/home/' endpoint
    await POST("api/account/dashboard/home/")
      .then(function (response) {
        // Logging the data received from the API response
        console.log("Data:", response.data);
        if (response.data.json_branch_data.length === 0) {
          setIsDataEmpty(true);
          console.log(">>>>>>>> No Branch data found");
        }
        if (response.data.json_pr_data.length === 0) {
          setIsDataEmpty(true);
          console.log(">>>>>>>> No PR data found");
        }

        // Updating the state with the received data
        setBranchList(response.data.data);
      })
      .catch(function (error) {
        // Logging any errors that occur during the API request
        console.error("Error:", error);
      });
  };

  /**
   * Handles the change event when a repository is selected.
   * @param value The selected repository value.
   * @returns void
   */
  const onRepoChange = async (value: any) => {
    setSelectedRepo(value);

    if (!value) {
      setIsRepoSelected(false);
      return;
    }

    setIsRepoSelected(true);

    const filteredBranchData = json_branch_data.filter(
      (cur: any) => cur.Repo_name === value
    );
    const branchData = filteredBranchData.map((cur: any) => ({
      message: cur.message,
      author_name: cur.author_name,
      date: cur.date,
      Repo_name: cur.Repo_name,
    }));

    setBranchRows(branchData);

    const filteredData = json_pr_data.filter(
      (cur: any) => cur.Repo_name === value
    );
    const repoData = filteredData.map((cur: any) => ({
      pull_id: cur.pull_id,
      author: cur.author,
      title: cur.title,
      source_branch: cur.source_branch,
      target_branch: cur.target_branch,
      additions: cur.additions,
    }));

    console.log("Current Repo Data: ", { repoRows, repoData });

    setRepoRows(repoData);
    console.log("Temp Repo Data", repoData);
    console.log("Selected Repo: " + value);
    console.log("Updated Repo Data: ", { repoRows, repoData });
  };

  /**
   * Retrieves the list of repositories from the json_pr_data and sets it in the state.
   * Also logs each repository name to the console.
   */
  const getRepoList = () => {
    let repos: string[] = [];

    json_pr_data.forEach((item) => {
      if (!repos.includes(item.Repo_name)) {
        repos.push(item.Repo_name);
      }
    });
    setRepoList(repos);

    repos.forEach((item: string) => {
      console.log("Repo: " + item);
    });
  };

  React.useEffect(() => {
    getRepoList();
    // fetchRepoBranches();
  }, []);

  return (
    <React.Fragment>
      <Autocomplete
        id="repo-select-dashboard"
        placeholder="Select Repo for Statistics"
        openOnFocus={true}
        options={repoList}
        value={selectedRepo}
        onChange={(event, value) => {
          onRepoChange(value);
        }}
        startDecorator={<KeyboardDoubleArrowRightIcon />}
      />

      {!isRepoSelected ? (
        <Typography variant="plain">Please select a repository</Typography>
      ) : null}
      <Stack
        spacing={2.5}
        visibility={selectedRepo !== undefined || null ? "visible" : "hidden"}
      >
        <Card variant="outlined">
          <CardContent>
            <Typography color="neutral" noWrap={false} variant="plain">
              Branch Commit Data
            </Typography>
            <Card
              variant="soft"
              sx={{
                padding: 0,
                maxHeight: "16em",
                overflow: "auto",
              }}
            >
              <Table
                aria-labelledby="tableTitle"
                stickyHeader
                hoverRow
                sx={{
                  "--TableCell-headBackground":
                    "var(--joy-palette-background-level1)",
                  "--Table-headerUnderlineThickness": "1px",
                  "--TableRow-hoverBackground":
                    "var(--joy-palette-background-level1)",
                  "--TableCell-paddingY": "4px",
                  "--TableCell-paddingX": "8px",
                }}
              >
                <thead>
                  <tr>
                    <th
                      style={{
                        flex: "1",
                        textAlign: "center",
                        padding: "12px 6px",
                      }}
                    >
                      Author
                    </th>
                    <th
                      style={{
                        flex: "1",
                        padding: "12px 6px",
                        textAlign: "center",
                      }}
                    >
                      Repository
                    </th>
                    <th
                      style={{
                        flex: "1",
                        padding: "12px 6px",
                        textAlign: "center",
                      }}
                    >
                      Commit Message
                    </th>
                    <th
                      style={{
                        flex: "1",
                        padding: "12px 6px",
                        textAlign: "center",
                      }}
                    >
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {stableSort(branchRows, getComparator(order, "date")).map(
                    (row) => (
                      <tr
                        key={row.date}
                        className="branchlisting"
                        style={{ textAlign: "center" }}
                      >
                        <td>
                          <Typography level="body-xs" flex={1}>
                            {row.author_name}
                          </Typography>
                        </td>
                        <td>
                          <Typography level="body-xs">
                            {row.Repo_name}
                          </Typography>
                        </td>
                        <td>
                          <Typography level="body-xs">{row.message}</Typography>
                        </td>
                        <td>
                          <Typography level="body-xs">{row.date}</Typography>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </Table>
            </Card>
          </CardContent>
        </Card>
        <Card variant="outlined">
          <CardContent>
            <Typography color="neutral" noWrap={false} variant="plain">
              Total Pull Requests Created
            </Typography>
            <Card
              variant="soft"
              sx={{
                padding: 0,
                maxHeight: "16em",
                overflow: "auto",
              }}
            >
              <Table
                aria-labelledby="tableTitle"
                stickyHeader
                hoverRow
                sx={{
                  "--TableCell-headBackground":
                    "var(--joy-palette-background-level1)",
                  "--Table-headerUnderlineThickness": "1px",
                  "--TableRow-hoverBackground":
                    "var(--joy-palette-background-level1)",
                  "--TableCell-paddingY": "4px",
                  "--TableCell-paddingX": "8px",
                }}
              >
                <thead>
                  <tr>
                    <th
                      style={{
                        width: "40%",
                        textAlign: "center",
                        padding: "12px 6px",
                      }}
                    >
                      Pull ID
                    </th>
                    <th
                      style={{
                        width: "30%",
                        textAlign: "center",
                        padding: "12px 6px",
                      }}
                    >
                      Author
                    </th>
                    <th
                      style={{
                        width: "30%",
                        textAlign: "center",
                        padding: "12px 6px",
                      }}
                    >
                      Title
                    </th>
                    <th
                      style={{
                        width: "30%",
                        textAlign: "center",
                        padding: "12px 6px",
                      }}
                    >
                      Source Branch
                    </th>
                    <th
                      style={{
                        width: "30%",
                        textAlign: "center",
                        padding: "12px 6px",
                      }}
                    >
                      Target Branch
                    </th>
                    <th
                      style={{
                        width: "30%",
                        textAlign: "center",
                        padding: "12px 6px",
                      }}
                    >
                      Additions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {stableSort(repoRows, getComparator(order, "pull_id")).map(
                    (row) => (
                      <tr
                        key={row.pull_id}
                        className="branchlisting"
                        style={{ textAlign: "center" }}
                      >
                        <td>
                          <Typography level="body-xs" flex={1}>
                            {row.pull_id}
                          </Typography>
                        </td>
                        <td>
                          <Typography level="body-xs">{row.author}</Typography>
                        </td>
                        <td>
                          <Typography level="body-xs">{row.title}</Typography>
                        </td>
                        <td>
                          <Typography level="body-xs">
                            {row.source_branch}
                          </Typography>
                        </td>
                        <td>
                          <Typography level="body-xs">
                            {row.target_branch}
                          </Typography>
                        </td>
                        <td>
                          <Typography level="body-xs" textColor={"green"}>
                            {row.additions}
                          </Typography>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </Table>
            </Card>
          </CardContent>
        </Card>
      </Stack>

      <Typography
        visibility={isDataEmpty ? "visible" : "hidden"}
        alignSelf={"center"}
        variant="plain"
        sx={{
          position: "absolute",
          top: "50%",
        }}
      >
        Oops! No Statistics to show. <br />
        You need to use the bot first.
      </Typography>
    </React.Fragment>
  );
}
