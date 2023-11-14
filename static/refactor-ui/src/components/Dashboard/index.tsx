import * as React from "react";
import { CssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";

import Sheet from "@mui/joy/Sheet";
import Breadcrumbs from "@mui/joy/Breadcrumbs";

import Link from "@mui/joy/Link";
import { Router, useNavigate } from "react-router-dom";

import Grid from "@mui/joy/Grid";
import Box from "@mui/joy/Box";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";

import { styled } from "@mui/joy/styles";
import { Typography } from "@mui/joy";
import BranchTable from "../../layout/BranchTable";
import BranchList from "../../layout/BranchList";

const Item = styled(Sheet)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark" ? theme.palette.background.level1 : "#fff",
  ...theme.typography["body-sm"],
  padding: theme.spacing(1),
  textAlign: "center",
  borderRadius: 4,
  color: theme.vars.palette.text.secondary,
}));

export const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <CssVarsProvider disableTransitionOnChange>
      <CssBaseline />
      <Box sx={{ display: "flex", minHeight: "100dvh" }}>
        <Box
          component="main"
          className="MainContent"
          title="Root Content"
          sx={{
            px: {
              xs: 2,
              md: 6,
            },
            pt: 0,
            pb: 0,
            flex: 1,
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
            height: "100dvh",
            gap: 1,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Breadcrumbs
              size="sm"
              aria-label="breadcrumbs"
              separator={<ChevronRightRoundedIcon fontSize="small" />}
              sx={{ pl: 0 }}
            >
              {/* <Link
                underline="none"
                color="neutral"
                onClick={() => navigate("/dashboard/home")}
                aria-label="Home"
              > */}
              <HomeRoundedIcon />
              {/* </Link> */}
              <Typography
                // underline="hover"
                color="neutral"
                // href="/dashboard/home"
                fontSize={12}
                fontWeight={500}
              >
                Dashboard
              </Typography>
              {/* <Typography color="primary" fontWeight={500} fontSize={12}>
                Branches
              </Typography> */}
            </Breadcrumbs>
          </Box>
          <BranchTable />
          {/* <BranchList /> */}
        </Box>
      </Box>
    </CssVarsProvider>
  );
};
