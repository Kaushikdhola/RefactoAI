
import Box from "@mui/joy/Box";
import List from "@mui/joy/List";
import { useState } from "react";
import Sheet from "@mui/joy/Sheet";
import Avatar from "@mui/joy/Avatar";
import Divider from "@mui/joy/Divider";
import ListItem from "@mui/joy/ListItem";
import Typography from "@mui/joy/Typography";
import IconButton from "@mui/joy/IconButton";
import { useNavigate } from "react-router-dom";
import GlobalStyles from "@mui/joy/GlobalStyles";
import ListItemContent from "@mui/joy/ListItemContent";
import TerminalIcon from "@mui/icons-material/Terminal";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import RepartitionIcon from "@mui/icons-material/Repartition";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import ListItemButton, { listItemButtonClasses } from "@mui/joy/ListItemButton";

import { closeSidebar } from "./utils";
import { DELETE } from "../utils/axios";
import { useAuth } from "../hooks/useAuth";
import ColorSchemeToggle from "../components/ColorSchemeToggle";
import { useEffect } from "react";
import { POST,GET } from "../utils/axios";




export const Sidebar = () => {
  const { logout }: any = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState()
  const [activeTab, setActiveTab] = useState<string>(
    window.location.pathname?.split("/")?.[2]
  );

  useEffect(() => {

    POST('api/account/dashboard/home/')

    .then(function (response) {

        console.log('Data:', response.data.data);
        setData(response.data);
      })

      .catch(function (error) {

        console.error('Error:', error);
      });

  }, []);

  const tabs = [
    {
      IconComponent: DashboardRoundedIcon,
      name: "Dashboard",
      key: "home",
      path: "/dashboard/home",
    },
    {
      IconComponent: RepartitionIcon,
      name: "Refactorings",
      key: "refactorings",
      path: "/dashboard/refactorings",
    },
    {
      IconComponent: SettingsRoundedIcon,
      name: "Settings",
      key: "settings",
      path: "/dashboard/settings",
    },
  ];

  const handleLogout = () => {
    DELETE(`api/account/logout/`)?.then((res) => {
      logout(res?.data)?.finally(() => {
        navigate("/");
      });
    });
  };

  return (
    <Sheet
      className="Sidebar"
      sx={{
        position: {
          xs: "fixed",
          md: "sticky",
        },
        transform: {
          xs: "translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1)))",
          md: "none",
        },
        transition: "transform 0.4s, width 0.4s",
        zIndex: 10000,
        height: "100dvh",
        width: "var(--Sidebar-width)",
        top: 0,
        p: 2,
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        borderRight: "1px solid",
        borderColor: "divider",
      }}
    >
      <GlobalStyles
        styles={(theme) => ({
          ":root": {
            "--Sidebar-width": "220px",
            [theme.breakpoints.up("lg")]: {
              "--Sidebar-width": "240px",
            },
          },
        })}
      />
      <Box
        className="Sidebar-overlay"
        sx={{
          position: "fixed",
          zIndex: 9998,
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          opacity: "var(--SideNavigation-slideIn)",
          backgroundColor: "var(--joy-palette-background-backdrop)",
          transition: "opacity 0.4s",
          transform: {
            xs: "translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1) + var(--SideNavigation-slideIn, 0) * var(--Sidebar-width, 0px)))",
            lg: "translateX(-100%)",
          },
        }}
        onClick={() => closeSidebar()}
      />
      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        <IconButton variant="soft" color="primary" size="sm">
          <TerminalIcon />
        </IconButton>
        <Typography level="title-lg">Re-Factor</Typography>
        <ColorSchemeToggle sx={{ ml: "auto" }} />
      </Box>
      <Box
        sx={{
          minHeight: 0,
          overflow: "hidden auto",
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          [`& .${listItemButtonClasses.root}`]: {
            gap: 1.5,
          },
        }}
      >
        <List
          size="sm"
          sx={{
            gap: 1,
            "--List-nestedInsetStart": "30px",
            "--ListItem-radius": (theme) => theme.vars.radius.sm,
          }}
        >
          {tabs?.map((ins: any, index: number) => {
            const { IconComponent, name, key, path } = ins;
            return (
              <ListItem key={`dashboard-tab-${index}`}>
                <ListItemButton
                  selected={activeTab === key}
                  onClick={() => {
                    setActiveTab(key);
                    navigate(path);
                  }}
                >
                  <IconComponent />
                  <ListItemContent>
                    <Typography level="title-sm">{name}</Typography>
                  </ListItemContent>
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>
      <Divider />
      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        <Avatar
          variant="outlined"
          size="sm"
          src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=286"
        />
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography level="title-sm">Hatim Patrawala</Typography>
          <Typography level="body-xs">ht760280@dal.ca</Typography>
        </Box>
        <IconButton
          size="sm"
          variant="plain"
          color="neutral"
          onClick={handleLogout}
        >
          <LogoutRoundedIcon />
        </IconButton>
      </Box>
    </Sheet>
  );
};
