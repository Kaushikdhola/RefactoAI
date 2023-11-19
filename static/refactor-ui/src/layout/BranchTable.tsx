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
        options={["Repo 1", "Repo 2", "Repo 3", "Repo 4", "Repo 5", "Repo 6"]}
        onSelect={(value) => console.log(value)}
        startDecorator={<KeyboardDoubleArrowRightIcon />}
      />
      <Grid container spacing={2} sx={{ flexGrow: 1 }}>
        <Grid
          xs={6}
          md={8}
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
