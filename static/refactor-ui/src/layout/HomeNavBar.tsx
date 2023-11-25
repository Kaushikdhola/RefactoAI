import * as React from "react";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  IconButton,
  Tab,
  TabList,
  Tabs,
  tabClasses,
  useColorScheme,
} from "@mui/joy";
import Typography from "@mui/joy/Typography";
import Avatar from "@mui/joy/Avatar";
import MapsHomeWorkIcon from "@mui/icons-material/MapsHomeWork";
import { useNavigate } from "react-router-dom";

import logo from "../assets/images/logo.png";
import ColorSchemeToggle from "../components/ColorSchemeToggle";
import { Link } from "react-router-dom";

const settings = ["Profile", "Account", "Dashboard", "Logout"];

const pages = ["About Us", "Documentation"];
const logoSrc = require("../assets/images/logo.png");

export const NavBar = () => {
  const navigate = useNavigate();
  const { mode } = useColorScheme();

  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        top: 0,
        px: 1.5,
        py: 1,
        zIndex: 10000,
        backgroundColor: "background.body",

        position: "sticky",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 1.5,
        }}
      >
        <Link to={"/"}>
          <Card
            size="sm"
            variant="soft"
            sx={{ height: "50px", width: "50px", p: "2px" }}
          >
            <img
              src={logo}
              style={{
                filter: mode === "dark" ? "invert(1)" : "invert(0)",
              }}
            />
          </Card>
        </Link>
      </Box>

      <Card sx={{ padding: 1, borderRadius: 20 }}>
        <CardActions sx={{ padding: "0" }}>
          <Button
            variant="soft"
            onClick={() => {
              navigate("/");
            }}
          >
            Home
          </Button>
          <Button
            variant="soft"
            onClick={() => {
              navigate("/about");
            }}
          >
            About Us
          </Button>
          <Button
            variant="soft"
            onClick={() => {
              navigate("/documentation");
            }}
          >
            Documentation
          </Button>
          <ColorSchemeToggle
            variant="outlined"
            sx={{
              alignSelf: "center",
              borderRadius: "13px",
            }}
          />
        </CardActions>
      </Card>
    </Box>
  );
};
