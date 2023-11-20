import { Box } from "@mui/material";
import React from "react";
import SearchIcon from "@mui/icons-material/Search";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import IconButton from "@mui/joy/IconButton";
import InputBase from "@material-ui/core/InputBase/InputBase";
// export {};
export default function Topbar() {
  return (
    <>
      <Box display="flex" justifyContent="space-between" p={2}>
        {/* SEARCH BAR */}
        {/* <Box  sx={{ display: "flex", borderRadius: "3px" }}>
          <IconButton>
            <SearchIcon />
          </IconButton>
          <InputBase style={{ marginLeft: 2, flex: 1 }} placeholder="Search" />
        </Box> */}

        {/* ICONS */}
        <Box display="flex">
          <IconButton>
            <NotificationsOutlinedIcon />
          </IconButton>
          <IconButton>
            <SettingsOutlinedIcon />
          </IconButton>
          <IconButton>
            <PersonOutlinedIcon />
          </IconButton>
        </Box>
        {/* </Box> */}
      </Box>
    </>
  );
}

// export default Topbar;
