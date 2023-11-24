/* eslint-disable jsx-a11y/anchor-is-valid */
import * as React from "react";
import Table from "@mui/joy/Table";
import Typography from "@mui/joy/Typography";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import { Autocomplete, Card, CardContent, Stack } from "@mui/joy";
import { POST } from "../utils/axios";

interface pullData {
  pull_id: number;
  author: string;
  title: string;
  source_branch: string;
  target_branch: string;
  additions: number;
  deletions: number;
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
  const [order] = React.useState<Order>("asc");
  let [repoList, setRepoList] = React.useState<string[]>([]);
  let [selectedRepo, setSelectedRepo] = React.useState<any>();
  let [isDataEmpty, setIsDataEmpty] = React.useState(false);
  const [isRepoSelected, setIsRepoSelected] = React.useState(false);

  const [repoRows, setRepoRows] = React.useState<Array<pullData>>([]);
  const [branchRows, setBranchRows] = React.useState<Array<branchData>>([]);
  const [fetchedPRData, setFetchedPRData] = React.useState<any>([]);
  const [fetchedBranchData, setFetchedBranchData] = React.useState<any>([]);
  /**
   * Fetches the repository branches from the API.
   * Makes a POST request to the 'api/account/dashboard/home/' endpoint.
   * Logs the received data and updates the state with the branch list.
   * Sets the isDataEmpty state to true if no branch or PR data is found.
   * Logs any errors that occur during the API request.
   */
  const fetchRepoBranches = async () => {
    // // Making a POST request to the 'api/account/dashboard/home/' endpoint
    await POST("api/account/dashboard/home/")
      .then(async function (response) {
        // Logging the data received from the API response
        console.log("Data:", response.data);
        console.log("Branch Data:", response.data.json_branch_data);
        console.log("PR Data:", response.data.json_pr_data);
        if (response.data.json_branch_data.length === 0) {
          setIsDataEmpty(true);
          console.log(">>>>>>>> No Branch data found");
        } else if (fetchedBranchData?.length === 0) {
          setFetchedBranchData(response.data.json_branch_data);
        }
        if (response.data.json_pr_data.length === 0) {
          setIsDataEmpty(true);
          console.log(">>>>>>>> No PR data found");
        } else if (fetchedPRData.length === 0) {
          setFetchedPRData(response.data.json_pr_data);
        }
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

    console.log("fetchedBranchData", fetchedBranchData)
    const filteredBranchData = fetchedBranchData?.filter(
      (cur: any) => cur.Repo_name === value
    ) || [];
    const branchData = filteredBranchData?.map((cur: any) => ({
      message: cur.message,
      author_name: cur.author_name,
      date: cur.date,
      Repo_name: cur.Repo_name,
    })) || [];

    setBranchRows(branchData);

    let filteredRepoData: any = [];
    fetchedPRData.forEach((cur: any) => {
      console.log("Current Repo Data: ", cur.Repo_name);
      if (String(cur.Repo_name).split("/").slice(-2).join("/") === value) {
        filteredRepoData.push(cur);
      }
    });

    console.log("Filtered Repo Data: ", filteredRepoData);

    console.log("Repo name and Value: ", value);
    console.log("Filtered Data: ", fetchedPRData);
    const repoData = filteredRepoData.map((cur: any) => ({
      pull_id: cur.pull_id,
      author: cur.author,
      title: cur.title,
      source_branch: cur.source_branch,
      target_branch: cur.target_branch,
      additions: cur.additions,
      deletions: cur.deletions,
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

    fetchedPRData.forEach((item: any) => {
      if (!repos.includes(item.Repo_name)) {
        repos.push(String(item.Repo_name).split("/").slice(-2).join("/"));
      }
    });

    setRepoList(repos);
    repos.forEach((item: string) => {
      console.log("Repo: " + item);
    });
  };

  React.useEffect(() => {
    fetchRepoBranches();
    getRepoList();
  }, [fetchedBranchData, fetchedPRData]);

  return (
    <React.Fragment>
      <Autocomplete
        id="repo-select-dashboard"
        placeholder="Select Repo for Statistics"
        sx={{ visibility: isDataEmpty ? "hidden" : "visible" }}
        openOnFocus={true}
        options={repoList}
        value={selectedRepo}
        onChange={(event, value) => {
          onRepoChange(value);
        }}
        startDecorator={<KeyboardDoubleArrowRightIcon />}
      />

      <Typography
        variant="plain"
        visibility={isDataEmpty ? "hidden" : "visible"}
      >
        Please select a repository
      </Typography>
      <Stack
        spacing={2.5}
        visibility={
          isDataEmpty !== true || undefined || null ? "visible" : "hidden"
        }
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
                    <th
                      style={{
                        width: "30%",
                        textAlign: "center",
                        padding: "12px 6px",
                      }}
                    >
                      Deletions
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
                        <td>
                          <Typography level="body-xs" textColor={"red"}>
                            {row.deletions}
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
