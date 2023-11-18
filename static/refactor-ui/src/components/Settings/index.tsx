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
} from "@mui/joy";

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/joy/Button";
import Divider from "@mui/joy/Divider";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";

import axios from "axios";
import { POST, GET } from "../../utils/axios";

import CardActions from "@mui/joy/CardActions";
import CardOverflow from "@mui/joy/CardOverflow";

import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";

import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import { indexOf } from "lodash";
import { HashLoader } from "react-spinners";

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
    interval: "5",
    maxLines: "30",
    repo: "null",
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
  const [value, setValue] = React.useState<string | null>(null);
  const [selectedRepo, setSelectedRepo] = React.useState<string | null>(null);
  const [repoData, setRepoData] = React.useState<any>([]);
  let [targetBranch, setTargetBranch] = React.useState<any>([]);
  let [loading, setLoading] = useState(true);
  // let response: any = {};

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
    console.log("------>Configs: ", configs);
    setLoading(false);
    await setRepoData(
      apiResponse.data.repositories.map((repo: any) => ({
        reponame: repo.name,
        id: repo.repo_id,
        branches: repo.target_branches,
      }))
    );
    console.log("------>Repo Data: ", repoData);
  };

  const postAPI = async () => {
    setLoading(true);
    const apiPostResponse = await GET("api/account/github/configurations/");
    let tempResponse = apiPostResponse.data;
    console.log("------>Post Data: ", tempResponse);
    let repoJson = tempResponse.repositories;
    tempResponse.commit_interval = Number(configs[0].interval);
    tempResponse.max_lines = Number(configs[0].maxLines);
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
                    defaultValue={configs[0].interval}
                    onChange={(e) => {
                      configs[0].interval = e.target.value;
                      console.log("Commit Interval: " + configs[0].interval);
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
                    defaultValue={configs[0].maxLines}
                    onChange={(e) => {
                      configs[0].maxLines = e.target.value;
                      console.log("Max Lines: " + configs[0].maxLines);
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
                    Minimum Lines to trigger the Bot.
                  </FormHelperText>
                </Stack>
              </Stack>
              <Stack direction="column" flex="1" spacing={1}>
                <FormLabel>Select Repository</FormLabel>
                <Autocomplete
                  size="md"
                  placeholder="Select Repo"
                  openOnFocus={true}
                  options={repoOptions}
                  value={selectedRepo}
                  onChange={(event, newValue) => {
                    setSelectedRepo(newValue);
                    configs[0].repo = newValue as string;
                    console.log("Selected Repo: " + configs[0].repo);
                    console.log(
                      "Index Repo: " + indexOf(repoOptions, newValue)
                    );
                    setTargetBranch(
                      repoData[indexOf(repoOptions, newValue)].branches
                    );
                    console.log(
                      repoData[indexOf(repoOptions, newValue)].branches
                    );
                    setValue(null);
                  }}
                  startDecorator={<KeyboardDoubleArrowRightIcon />}
                />
              </Stack>
              <Stack direction="row" spacing={2}>
                <FormControl sx={{ flexGrow: 1 }}>
                  <FormLabel>Target Branch</FormLabel>
                  <Autocomplete
                    size="md"
                    placeholder="Target Branch"
                    openOnFocus={true}
                    options={targetBranch.map((e: any) => e.name)}
                    value={value}
                    onChange={(event, newValue) => {
                      setValue(newValue);
                      configs[0].targetBranch = newValue as string;
                      console.log("Target Branch: " + configs[0].targetBranch);
                      console.log("Updated Branch Config: ", configs);
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
                    defaultValue={configs[0].interval}
                    onChange={(e) => {
                      configs[0].interval = e.target.value;
                      console.log("Commit Interval: " + configs[0].interval);
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
                    defaultValue={configs[0].maxLines}
                    onChange={(e) => {
                      configs[0].maxLines = e.target.value;
                      console.log("Max Lines: " + configs[0].maxLines);
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
                    Minimum Lines to trigger the Bot
                  </FormHelperText>
                </Stack>
              </Stack>
              <Stack direction="column" flex="1" spacing={1}>
                <FormLabel>Select Repository</FormLabel>
                <Autocomplete
                  size="md"
                  placeholder="Select Repo"
                  openOnFocus={true}
                  options={repoOptions}
                  value={selectedRepo}
                  onChange={(event, newValue) => {
                    setSelectedRepo(newValue);
                    configs[0].repo = newValue as string;
                    console.log("Selected Repo: " + configs[0].repo);
                    console.log(
                      "Index Repo: " + indexOf(repoOptions, newValue)
                    );
                    setTargetBranch(
                      repoData[indexOf(repoOptions, newValue)].branches
                    );
                    console.log(
                      repoData[indexOf(repoOptions, newValue)].branches
                    );
                    setValue(null);
                  }}
                  startDecorator={<KeyboardDoubleArrowRightIcon />}
                />
              </Stack>
              <Stack direction="row" spacing={2}>
                <FormControl sx={{ flexGrow: 1 }}>
                  <FormLabel>Target Branch</FormLabel>
                  <Autocomplete
                    size="md"
                    placeholder="Target Branch"
                    openOnFocus={true}
                    options={targetBranch.map((e: any) => e.name)}
                    value={value}
                    onChange={(event, newValue) => {
                      setValue(newValue);
                      configs[0].targetBranch = newValue as string;
                      console.log("Target Branch: " + configs[0].targetBranch);
                      console.log("Updated Branch Config: ", configs);
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
              <Button size="sm" variant="outlined" color="neutral">
                Discard
              </Button>
              <Button
                size="sm"
                variant="solid"
                onClick={() => {
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
