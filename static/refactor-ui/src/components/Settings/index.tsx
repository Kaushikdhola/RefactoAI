import {
  Autocomplete,
  Box,
  Breadcrumbs,
  FormHelperText,
  Typography,
  Card,
  Stack,
  Grid,
  CardContent,
  Table,
  colors,
} from "@mui/joy";

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/joy/Button";
import Divider from "@mui/joy/Divider";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import RadarIcon from "@mui/icons-material/Radar";
import axios from "axios";
import { POST, GET } from "../../utils/axios";

import CardActions from "@mui/joy/CardActions";
import CardOverflow from "@mui/joy/CardOverflow";

import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";

import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import { indexOf, set } from "lodash";
import { HashLoader } from "react-spinners";
import { log } from "console";

type Props = {};

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
  {
    id: "1231",
    branch: "frontend",
    lines: "100",
  },
];

let configs = [
  {
    interval: "null",
    maxLines: "null",
    repo: "null",
    config_trackedBranch: ["null"],
    targetBranch: "null",
  },
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

const Settings = (props: Props) => {
  const navigate = useNavigate();
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  // const [order] = React.useState<Order>("desc");
  const [responseData, setAPIResponse] = React.useState<any>(null);
  let [trgBranchValue, setTrgBranchValue] = React.useState<string | null>(null);
  let [trkedBranchValue, setTrkedBranchValue] = React.useState<any>([]);
  const [selectedRepo, setSelectedRepo] = React.useState<string | null>(null);
  const [repoData, setRepoData] = React.useState<any>([]);
  let [targetBranch, setTargetBranch] = React.useState<any>([]);
  let [trackedBranch, setTrackedBranch] = React.useState<any>([]);
  let [loading, setLoading] = useState(true);
  let [repoSelected, setRepoSelected] = useState(false);
  let [commit_interval, setCommitInterval] = useState("null");
  let [minLines, setMinLines] = useState("null");
  let [isFetched, setIsFetched] = useState(false);

  /**
   * Fetches data from the API and updates the component state.
   */
  const fetchAPI = async () => {
    const apiResponse = await GET("api/account/github/configurations/");
    console.log("------>API Response: ", apiResponse.data);
    // setAPIResponse({ ...apiResponse.data });

    console.log("------>Post Data: ", apiResponse.data);
    console.log("------>", apiResponse.data.repositories);
    console.log("------>Commit: ", apiResponse.data.commit_interval);
    console.log("------>Max Lines: ", apiResponse.data.max_lines);
    configs[0].interval = apiResponse.data.commit_interval;
    configs[0].maxLines = apiResponse.data.max_lines;
    setCommitInterval(apiResponse.data.commit_interval);
    setMinLines(apiResponse.data.max_lines);
    console.log("------>Configs: ", configs);
    setLoading(false);
    await setRepoData(
      apiResponse.data.repositories.map((repo: any) => ({
        reponame: repo.name,
        id: repo.repo_id,
        targetBranches: repo.target_branches,
        trackedBranches: repo.source_branches,
      }))
    );
    setIsFetched(true);
    console.log("------>Repo Data: ", repoData);
  };

  const targetBranchOnchange = (newValue: any) => {
    setTrgBranchValue(newValue);
    configs[0].targetBranch = newValue as string;
    console.log("Target Branch: " + configs[0].targetBranch);
    console.log("Updated Branch Config: ", configs);
  };
  const trackedBranchOnchange = (newValue: any) => {
    setTrkedBranchValue(newValue);
    configs[0].config_trackedBranch = newValue as string[];
    console.log("Updated Tracked Branch Config: ", configs);
    console.log("Tracked Branch: " + newValue);
  };
  const repoOnchange = (newValue: any) => {
    setSelectedRepo(newValue);
    configs[0].repo = newValue as string;
    console.log("Selected Repo: " + configs[0].repo);
    console.log("Index Repo: " + indexOf(repoOptions, newValue));

    if (indexOf(repoOptions, newValue) !== -1) {
      setRepoSelected(true);
      setTargetBranch(repoData[indexOf(repoOptions, newValue)].targetBranches);
      setTrackedBranch(
        repoData[indexOf(repoOptions, newValue)].trackedBranches
      );
      console.log(repoData[indexOf(repoOptions, newValue)].targetBranches);
    } else {
      setRepoSelected(false);
      setTrackedBranch([]);
      setTargetBranch([]);
    }

    setTrkedBranchValue([]); // Clear the value of trkedBranchAutocomplete
    setTrgBranchValue(null); // Clear the value of trgBranchAutocomplete
  };

  /**
   * Sends a POST request to the API to update the GitHub configurations.
   * @returns {Promise<void>} A promise that resolves when the request is complete.
   */
  const postAPI = async () => {
    setLoading(true);
    const apiPostResponse = await GET("api/account/github/configurations/");
    let tempResponse = apiPostResponse.data;
    console.log("------>Post Data: ", tempResponse);
    let repoJson = tempResponse.repositories;
    tempResponse.commit_interval = Number(commit_interval);
    tempResponse.max_lines = Number(minLines);
    repoJson.map((repo: any) => {
      if (repo.name === configs[0].repo) {
        repo.target_branches.map((branch: any) => {
          if (branch.name === configs[0].targetBranch) {
            branch.is_selected = true;
          } else {
            branch.is_selected = false;
          }
        });
      }
    });
    repoJson.map((repo: any) => {
      if (repo.name === configs[0].repo) {
        repo.source_branches.map((branch: any) => {
          if (configs[0].config_trackedBranch.includes(branch.name)) {
            branch.is_selected = true;
          } else {
            branch.is_selected = false;
          }
        });
      }
    });

    tempResponse.repositories = repoJson;
    console.log("------>Temp Post Data: ", tempResponse);
    let postResponse = await POST(
      "api/account/github/configurations/",
      tempResponse
    );
    setLoading(false);

    console.log("------>Post Response: ", postResponse);
  };

  useEffect(() => {
    fetchAPI();
  }, []);

  /**
   * Array of repository options.
   * @type {any[]}
   */
  let repoOptions: any =
    repoData.length > 0 ? repoData?.map((option: any) => option.reponame) : [];
  return (
    <Box
      sx={{
        flex: 1,
        width: "100%",
        alignContent: "center",
      }}
    >
      <Box
        sx={{
          position: "sticky",
          top: {
            sm: -100,
            md: -110,
          },
          bgcolor: "background.body",
          zIndex: 9995,
        }}
      >
        <Box
          sx={{
            px: {
              xs: 2,
              md: 6,
            },
          }}
        >
          <Breadcrumbs
            size="sm"
            aria-label="breadcrumbs"
            separator={<ChevronRightRoundedIcon fontSize="small" />}
            sx={{ pl: 0 }}
          >
            <HomeRoundedIcon />
            <Typography color="neutral" fontSize={12} fontWeight={500}>
              Configurations
            </Typography>
          </Breadcrumbs>
        </Box>
      </Box>
      <Box
        sx={{
          display: "contents",
          flexDirection: "column",
          alignItems: "center",
          // flexGrow: 1,
          height: 1,
          position: "absolute",
          width: 1,
        }}
      >
        <HashLoader loading={loading} color="#0D6EFD" />
      </Box>
      <Stack
        visibility={loading ? "hidden" : "visible"}
        spacing={4}
        sx={{
          display: "flex",
          maxWidth: "800px",
          mx: "auto",
          px: {
            xs: 2,
            md: 6,
          },
          py: {
            xs: 2,
            md: 3,
          },
        }}
      >
        <Card>
          <Box sx={{ mb: 1 }}>
            <Typography
              level="h2"
              sx={{
                mt: 1,
                mb: 1,
              }}
            >
              Configurations
            </Typography>
            <Typography level="body-sm">
              Configure the behaviour of the bot.
            </Typography>
          </Box>
          <Divider />
          {/*---------- Desktop UI Render ----------*/}
          <Stack
            direction="row"
            spacing={3}
            sx={{ display: { xs: "none", md: "flex" }, my: 1 }}
          >
            <Stack spacing={2} sx={{ flexGrow: 1 }}>
              <Stack spacing={1} direction="row">
                <Stack direction="column" flex="1">
                  <FormLabel>Commit Interval</FormLabel>
                  <Input
                    size="md"
                    type="number"
                    value={commit_interval}
                    onChange={(e) => {
                      setCommitInterval(e.target.value);
                      console.log("Commit Interval: " + commit_interval);
                    }}
                    slotProps={{
                      input: {
                        ref: inputRef,
                        min: 1,
                        step: 1,
                      },
                    }}
                  />
                  <FormHelperText>
                    No. of commits after which bot should trigger.
                  </FormHelperText>
                </Stack>
                <Stack direction="column" flex="1">
                  <FormLabel>Minimum Lines</FormLabel>
                  <Input
                    type="number"
                    size="md"
                    value={minLines}
                    onChange={(e) => {
                      console.log("Before Min Lines: " + e.target.value);
                      // minLines = e.target.value;
                      setMinLines(e.target.value);
                      console.log("Min Lines: " + minLines);
                    }}
                    slotProps={{
                      input: {
                        ref: inputRef,
                        min: 1,
                        step: 1,
                      },
                    }}
                  />
                  <FormHelperText>
                    Minimum Changed Lines to trigger the Bot.
                  </FormHelperText>
                </Stack>
              </Stack>
              <Stack direction="column" flex="1" spacing={1}>
                <FormLabel>Select Repository</FormLabel>
                <Autocomplete
                  id="repoAutocomplete"
                  // color="danger"
                  size="md"
                  placeholder="Select Repo"
                  openOnFocus={true}
                  options={repoOptions}
                  value={selectedRepo}
                  onChange={(event, newValue) => {
                    repoOnchange(newValue);
                  }}
                  startDecorator={<KeyboardDoubleArrowRightIcon />}
                />
              </Stack>
              <Stack direction="row" spacing={2}>
                <FormControl sx={{ flexGrow: 1 }}>
                  <FormLabel>Select Branch to Track</FormLabel>
                  <Autocomplete
                    id="trkedBranchAutocomplete"
                    multiple
                    size="md"
                    placeholder="Select the branches to track for refactoring."
                    openOnFocus={true}
                    options={trackedBranch.map((e: any) => e.name)}
                    value={repoSelected ? trkedBranchValue : []}
                    onChange={(event, newValue) => {
                      trackedBranchOnchange(newValue);
                    }}
                    startDecorator={<RadarIcon />}
                  />
                </FormControl>
              </Stack>
              <Stack direction="row" spacing={2}>
                <FormControl sx={{ flexGrow: 1 }}>
                  <FormLabel>Select your Target Branch</FormLabel>
                  <Autocomplete
                    id="trgBranchAutocomplete"
                    size="md"
                    placeholder="Select Target Branch to merge to."
                    openOnFocus={true}
                    options={targetBranch.map((e: any) => e.name)}
                    value={repoSelected ? trgBranchValue : null}
                    onChange={(event, newValue) => {
                      targetBranchOnchange(newValue);
                    }}
                    startDecorator={<KeyboardArrowRightIcon />}
                  />
                </FormControl>
              </Stack>
            </Stack>
          </Stack>
          {/*---------- Responsive UI Render ----------*/}
          <Stack
            direction="column"
            spacing={2}
            sx={{ display: { xs: "flex", md: "none" }, my: 1 }}
          >
            <Stack spacing={2} sx={{ flexGrow: 1 }}>
              <Stack spacing={1} direction="row">
                <Stack direction="column" flex="1">
                  <FormLabel>Commit Interval</FormLabel>
                  <Input
                    size="md"
                    type="number"
                    value={commit_interval}
                    onChange={(e) => {
                      setCommitInterval(e.target.value);
                      console.log("Commit Interval: " + commit_interval);
                    }}
                    slotProps={{
                      input: {
                        ref: inputRef,
                        min: 1,
                        step: 1,
                      },
                    }}
                  />
                  <FormHelperText>
                    No. of commits after which bot should trigger.
                  </FormHelperText>
                </Stack>
                <Stack direction="column" flex="1">
                  <FormLabel>Minimum Lines</FormLabel>
                  <Input
                    type="number"
                    size="md"
                    value={minLines}
                    onChange={(e) => {
                      setMinLines(e.target.value);
                      console.log("Min Lines: " + minLines);
                    }}
                    slotProps={{
                      input: {
                        ref: inputRef,
                        min: 1,
                        step: 1,
                      },
                    }}
                  />
                  <FormHelperText>
                    Minimum Changed Lines to trigger the Bot.
                  </FormHelperText>
                </Stack>
              </Stack>
              <Stack direction="column" flex="1" spacing={1}>
                <FormLabel>Select Repository</FormLabel>
                <Autocomplete
                  id="repoAutocomplete"
                  size="md"
                  placeholder="Select Repo"
                  openOnFocus={true}
                  options={repoOptions}
                  value={selectedRepo}
                  onChange={(event, newValue) => {
                    repoOnchange(newValue);
                  }}
                  startDecorator={<KeyboardDoubleArrowRightIcon />}
                />
              </Stack>
              <Stack direction="row" spacing={2}>
                <FormControl sx={{ flexGrow: 1 }}>
                  <FormLabel>Select Branch to Track</FormLabel>
                  <Autocomplete
                    multiple
                    size="md"
                    placeholder="Select the branches to track for refactoring."
                    openOnFocus={true}
                    options={trackedBranch.map((e: any) => e.name)}
                    value={repoSelected ? trkedBranchValue : []}
                    onChange={(event, newValue) => {
                      trackedBranchOnchange(newValue);
                    }}
                    startDecorator={<RadarIcon />}
                  />
                </FormControl>
              </Stack>
              <Stack direction="row" spacing={2}>
                <FormControl sx={{ flexGrow: 1 }}>
                  <FormLabel>Select your Target Branch</FormLabel>
                  <Autocomplete
                    id="trgBranchAutocomplete"
                    size="md"
                    placeholder="Select Target Branch to merge to."
                    openOnFocus={true}
                    options={targetBranch.map((e: any) => e.name)}
                    value={repoSelected ? trgBranchValue : null}
                    onChange={(event, newValue) => {
                      targetBranchOnchange(newValue);
                    }}
                    startDecorator={<KeyboardArrowRightIcon />}
                  />
                </FormControl>
              </Stack>
            </Stack>
          </Stack>

          {/*---------- Common UI Render ----------*/}

          {/* <Card variant="soft">
            <CardContent>
              <Typography color="neutral" noWrap={false} variant="plain">
                Repositories and their target branches.
              </Typography>
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
                  textAlign: "center",
                  "& th ": { textAlign: "center" },
                }}
              >
                <thead>
                  <tr>
                    <th
                      style={{
                        width: 240,
                        padding: "12px 6px",
                      }}
                    >
                      Repository
                    </th>
                    <th style={{ width: 140, padding: "12px 6px" }}>
                      Target Branch
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {stableSort(rows, getComparator(order, "id")).map((row) => (
                    <tr key={row.id} className="branchlisting">
                      <td>
                        <Typography level="body-xs">{row.branch}</Typography>
                      </td>
                      <td>
                        <Typography level="body-xs">{row.id}</Typography>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </CardContent>
          </Card> */}
          <CardOverflow sx={{ borderTop: "1px solid", borderColor: "divider" }}>
            <CardActions sx={{ alignSelf: "flex-end", pt: 2 }}>
              <Button
                size="sm"
                variant="outlined"
                color="neutral"
                onClick={() => {
                  setRepoSelected(false);
                  setSelectedRepo(null);
                  setTrgBranchValue(null);
                  setTrkedBranchValue([]);
                  configs[0].repo = "null";
                  configs[0].config_trackedBranch = ["null"];
                  configs[0].targetBranch = "null";
                }}
              >
                Discard
              </Button>
              <Button
                size="sm"
                variant="solid"
                onClick={() => {
                  console.log(
                    "Is Tracking Branch Empty: ",
                    configs[0].config_trackedBranch
                  );

                  if (
                    configs[0].repo === "null" ||
                    configs[0].config_trackedBranch[0] === undefined ||
                    configs[0].targetBranch === null ||
                    configs[0].targetBranch === "null"
                  ) {
                    // Change the color of the repoAutocomplete element to danger
                    // const repoAutocomplete =
                    //   document.getElementById("repoAutocomplete");
                    // if (repoAutocomplete) {
                    //   repoAutocomplete.style.color = "red";
                    //   repoAutocomplete.foc
                    // }
                    alert("Please select a repository");

                    return;
                  }
                  console.log("POST: ", configs);
                  postAPI();
                }}
              >
                Save
              </Button>
            </CardActions>
          </CardOverflow>
          <Grid xs={6} md={8}></Grid>
        </Card>
      </Stack>
    </Box>
  );
};

export default Settings;
