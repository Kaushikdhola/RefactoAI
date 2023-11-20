/* eslint-disable jsx-a11y/anchor-is-valid */
import * as React from "react";
import Avatar from "@mui/joy/Avatar";
import Box from "@mui/joy/Box";
import Table from "@mui/joy/Table";
import Sheet from "@mui/joy/Sheet";
import Typography from "@mui/joy/Typography";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";

import {
  Autocomplete,
  Card,
  CardContent,
  Chip,
  CssBaseline,
  CssVarsProvider,
  Grid,
  LinearProgress,
} from "@mui/joy";
import { autoBatchEnhancer } from "@reduxjs/toolkit";
import { pull } from "lodash";
import { json } from "react-router-dom";

const branchData = [
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

const pullRequestData = [
  {
    Repo_name: "https://api.github.com/repos/Kaushikdhola/TestingRefacto",
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
    Repo_name: "https://api.github.com/repos/Kaushikdhola/TestingRefacto",
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
    Repo_name: "https://api.github.com/repos/JohnDoe/ProjectX",
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
    Repo_name: "https://api.github.com/repos/JaneSmith/ProjectY",
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
    Repo_name: "https://api.github.com/repos/AliceJohnson/TestingImprovement",
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
    Repo_name: "https://api.github.com/repos/BobAnderson/CodeRefactoring",
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
    Repo_name: "https://api.github.com/repos/ChrisWilliams/FeatureMerge",
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
    Repo_name: "https://api.github.com/repos/EvaMartinez/SecurityFix",
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
    Repo_name: "https://api.github.com/repos/FrankLee/DocumentationUpdate",
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
    Repo_name: "https://api.github.com/repos/SusanMiller/FeatureImplementation",
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

const rows = [
  {
    id: "1234",
    branch: "master",
    lines: "100",
  },
  {
    id: "1233",
    branch: "develop",
    lines: "100",
  },
  {
    id: "1232",
    branch: "feature",
    lines: "100",
  },
  // {
  //   id: "1231",
  //   branch: "frontend",
  //   lines: "100",
  // },
  // {
  //   id: "1234",
  //   branch: "master",
  //   lines: "100",
  // },
  // {
  //   id: "1233",
  //   branch: "develop",
  //   lines: "100",
  // },
  // {
  //   id: "1232",
  //   branch: "feature",
  //   lines: "100",
  // },
  // {
  //   id: "1231",
  //   branch: "frontend",
  //   lines: "100",
  // },
];

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
  let [selectedRepo, setSelectedRepo] = React.useState<string>("");
  const [branchList, setBranchList] = React.useState<any>([]);

  const getRepoList = () => {
    const uniqueRepos = pullRequestData.reduce((repos: string[], item) => {
      const tempSplit = item.Repo_name.split("/");
      const repoName = tempSplit.slice(-2).join("/");
      if (!repos.includes(repoName)) {
        repos.push(repoName);
      }
      return repos;
    }, []);

    setRepoList(uniqueRepos);

    uniqueRepos.forEach((item: string) => {
      console.log("Repo: " + item);
    });
  };

  React.useEffect(() => {
    getRepoList();
  }, []);
  // return (
  //   <>
  //     <CssVarsProvider disableTransitionOnChange>
  //       <CssBaseline />
  //       <Box sx={{ display: "flex", minHeight: "100dvh" }}></Box>
  //     </CssVarsProvider>
  //   </>
  // );

  return (
    <React.Fragment>
      <Autocomplete
        placeholder="Select Repo"
        openOnFocus={true}
        options={repoList}
        value={selectedRepo}
        onChange={(value) => {
          console.log("Selected Repo: " + value);
        }}
        startDecorator={<KeyboardDoubleArrowRightIcon />}
      />
      <Grid
        container
        rowGap={0}
        rowSpacing={0}
        spacing={2}
        height={"auto"}
        sx={{ flexGrow: 1 }}
      >
        <Grid
          xs={6}
          md={8}
          sx={{
            height: "auto",
            maxHeight: "fit-content",
          }}
        >
          <Card variant="soft">
            <CardContent>
              <Typography color="neutral" noWrap={false} variant="plain">
                Total Pull Requests
              </Typography>
              <Card
                variant="soft"
                sx={{
                  padding: 0,
                  // height: "16em",

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
                        Branch
                      </th>
                      <th
                        style={{
                          flex: "1",
                          padding: "12px 6px",
                          textAlign: "center",
                        }}
                      >
                        Pull Requests
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {stableSort(rows, getComparator(order, "id")).map((row) => (
                      <tr
                        key={row.id}
                        className="branchlisting"
                        style={{ textAlign: "center" }}
                      >
                        <td>
                          <Typography level="body-xs" flex={1}>
                            {row.branch}
                          </Typography>
                        </td>
                        <td>
                          <Typography level="body-xs">{row.id}</Typography>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card>
            </CardContent>
          </Card>
        </Grid>
        {/* <Grid xs={6} md={4}>
          <Card variant="solid" invertedColors>
            <CardContent orientation="horizontal">
              <CardContent>
                <Typography level="body-md">
                  Lines of Code Refactored
                </Typography>
                <Typography level="h2"># 432M</Typography>
              </CardContent>
            </CardContent>
            <LinearProgress size="lg" determinate value={50} />
          </Card>
          {/* <Card variant="soft">
            <CardContent >
              <Typography level="title-md">Soft card</Typography>
              <Typography>Description of the card.</Typography>
              <LinearProgress determinate value={50} />
            </CardContent>
          </Card> */}

        <Grid
          xs={6}
          md={4}
          sx={{
            maxHeight: "fit-content",
          }}
        >
          <Card variant="soft">
            <CardContent>
              <Typography color="neutral" noWrap={false} variant="plain">
                Total Pull Requests
              </Typography>
              <Card
                variant="soft"
                sx={{
                  padding: 0,
                  // height: "16em",
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
                        Branch
                      </th>
                      <th
                        style={{
                          flex: "1",
                          padding: "12px 6px",
                          textAlign: "center",
                        }}
                      >
                        Pull Requests
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {stableSort(rows, getComparator(order, "id")).map((row) => (
                      <tr
                        key={row.id}
                        className="branchlisting"
                        style={{ textAlign: "center" }}
                      >
                        <td>
                          <Typography level="body-xs" flex={1}>
                            {row.branch}
                          </Typography>
                        </td>
                        <td>
                          <Typography level="body-xs">{row.id}</Typography>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card>
            </CardContent>
          </Card>
        </Grid>
        <Grid
          sx={{
            maxHeight: "fit-content",
          }}
        >
          <Card variant="soft">
            <CardContent>
              <Typography color="neutral" noWrap={false} variant="plain">
                Total Pull Requests Accepted
              </Typography>
              <Card
                variant="soft"
                sx={{
                  padding: 0,
                  // height: "16em",
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
                        Branch
                      </th>
                      <th
                        style={{
                          width: "30%",
                          textAlign: "center",
                          padding: "12px 6px",
                        }}
                      >
                        Changed Lines
                      </th>
                      <th
                        style={{
                          width: "30%",
                          textAlign: "center",
                          padding: "12px 6px",
                        }}
                      >
                        Total Lines
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {stableSort(rows, getComparator(order, "id")).map((row) => (
                      <tr
                        key={row.id}
                        className="branchlisting"
                        style={{ textAlign: "center" }}
                      >
                        <td>
                          <Typography level="body-xs">{row.branch}</Typography>
                        </td>
                        <td>
                          <Typography level="body-xs">{row.id}</Typography>
                        </td>
                        <td>
                          <Typography level="body-xs">{row.lines}</Typography>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
