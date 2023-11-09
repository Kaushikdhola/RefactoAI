import {
  Box,
  Breadcrumbs,
  CssBaseline,
  CssVarsProvider,
  Grid,
  Link,
  Typography,
} from "@mui/joy";

import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import React from "react";

type Props = {};

const Settings = (props: Props) => {
  return (
    <CssVarsProvider disableTransitionOnChange>
      <CssBaseline />
      <Box sx={{ display: "flex", minHeight: "100dvh" }}>
        <Box
          component="main"
          className="MainContent"
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
              <Link
                underline="none"
                color="neutral"
                href="/dashboard/home"
                aria-label="Home"
              >
                <HomeRoundedIcon />
              </Link>
              <Typography color="neutral" fontSize={12} fontWeight={500}>
                Configurations
              </Typography>
            </Breadcrumbs>
          </Box>
          <React.Fragment></React.Fragment>
        </Box>
      </Box>
    </CssVarsProvider>
  );
};

export default Settings;
