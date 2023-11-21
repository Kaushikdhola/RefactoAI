import { CssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";

import Sheet from "@mui/joy/Sheet";
import Breadcrumbs from "@mui/joy/Breadcrumbs";

import { useNavigate } from "react-router-dom";

import Box from "@mui/joy/Box";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";

import { styled } from "@mui/joy/styles";
import { Typography } from "@mui/joy";
import BranchTable from "../../layout/BranchTable";
import { useEffect, useState } from "react";
import { POST, GET } from "../../utils/axios";

const Item = styled(Sheet)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark" ? theme.palette.background.level1 : "#fff",
  ...theme.typography["body-sm"],
  padding: theme.spacing(1),
  textAlign: "center",
  borderRadius: 4,
  color: theme.vars.palette.text.secondary,
}));

interface DashboardData {
  json_branch_data: any;
  json_pr_data: any;
  data: any;
}

export const Dashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<DashboardData | null>(null);

  return (
    <CssVarsProvider disableTransitionOnChange>
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          minHeight: "100dvh",
        }}
      >
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
              <HomeRoundedIcon />
              <Typography color="neutral" fontSize={12} fontWeight={500}>
                Dashboard
              </Typography>
            </Breadcrumbs>
          </Box>
          <BranchTable />
        </Box>
      </Box>
    </CssVarsProvider>
  );
};
