import * as React from "react";
import {
  Box,
  Card,
  IconButton,
  Tab,
  TabList,
  Tabs,
  tabClasses,
} from "@mui/joy";
import Typography from "@mui/joy/Typography";
import Avatar from "@mui/joy/Avatar";
import MapsHomeWorkIcon from "@mui/icons-material/MapsHomeWork";
import { useNavigate } from "react-router-dom";

import logo from "../assets/images/logo.png";
import ColorSchemeToggle from "../components/ColorSchemeToggle";

const settings = ["Profile", "Account", "Dashboard", "Logout"];
const pages = ["About Us", "Documentation"];
const logoSrc = require("../assets/images/logo.png");

export const NavBar = () => {
  const navigate = useNavigate();
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
        // borderBottom: "1px solid",
        // borderColor: "divider",
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
        <Card
          size="sm"
          variant="soft"
          sx={{ height: "50px", width: "50px", p: "2px" }}
        >
          <img src={logo} />
        </Card>
        {/* <IconButton size="sm" variant="soft">
          <MapsHomeWorkIcon />
        </IconButton> */}
      </Box>

      <Box sx={{ display: "flex", flexDirection: "row", gap: 3 }}>
        <Box
          sx={{
            gap: 1,
            alignItems: "center",
            display: { xs: "none", sm: "flex" },
          }}
        >
          {/* <Avatar
            variant="outlined"
            size="sm"
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=286"
          />
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography level="title-sm">Siriwat K.</Typography>
            <Typography level="body-xs">siriwatk@test.com</Typography>
          </Box> */}
          <Tabs
            aria-label="tabs"
            defaultValue={0}
            sx={{ bgcolor: "transparent" }}
          >
            <TabList
              disableUnderline
              sx={{
                p: 0.5,
                gap: 0.5,
                borderRadius: "xl",
                bgcolor: "background.level1",
                [`& .${tabClasses.root}[aria-selected="true"]`]: {
                  boxShadow: "sm",
                  bgcolor: "background.surface",
                },
              }}
            >
              <Tab disableIndicator>Home</Tab>
              {/* <Card  }}>Hello</Card> */}

              <Tab disableIndicator>About Us</Tab>
              <Tab disableIndicator>Documentation</Tab>
              <ColorSchemeToggle
                sx={{ alignSelf: "center", borderRadius: "13px" }}
              />
            </TabList>
          </Tabs>
        </Box>
      </Box>
    </Box>
  );
  // return (
  //   <Box>
  //     <AppBar
  //       sx={{
  //         position: "absolute",
  //         marginTop: "0px",
  //         backgroundColor: "white",
  //         boxShadow: "none",
  //       }}
  //     >
  //       <Container
  //         maxWidth="xl"
  //         sx={{
  //           color: "black",
  //         }}
  //       >
  //         <Toolbar disableGutters>
  //           {/* <AdbIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} /> */}

  //           {/* <Image sx={{ display: { xs: "none", md: "flex" }, mr: 1 }}> */}
  //           <img
  //             onClick={() => navigate("/")}
  //             style={{
  //               width: "50px",
  //               height: "50px",
  //               padding: "0px",
  //               margin: "0px",

  //               // margin: "auto 1em",
  //               // display: "inline-flex",
  //             }}
  //             src={logo}
  //             alt="logo"
  //           />
  //           {/* </Image> */}

  //           {/* <Typography
  //             variant="h6"
  //             noWrap
  //             component={"a"}
  //             onClick={() => navigate("/")}
  //             sx={{
  //               mr: 1,
  //               ml: 1,
  //               display: { xs: "none", md: "flex" },
  //               fontFamily: "inherit",
  //               fontWeight: 700,
  //               cursor: "pointer",
  //               letterSpacing: ".3rem",
  //               color: "inherit",
  //               textDecoration: "none",
  //             }}
  //           >
  //             Re-Factor
  //           </Typography> */}

  //           <Box
  //             sx={{
  //               flexGrow: 1,
  //               display: { xs: "flex", md: "none" },
  //             }}
  //           >
  //             {/* <IconButton
  //               size="large"
  //               aria-label="account of current user"
  //               aria-controls="menu-appbar"
  //               aria-haspopup="true"
  //               color="inherit"
  //             >
  //               <AccountCircle />
  //             </IconButton> */}
  //             <Menu
  //               id="menu-appbar"
  //               anchorEl={anchorElNav}
  //               anchorOrigin={{
  //                 vertical: "bottom",
  //                 horizontal: "left",
  //               }}
  //               keepMounted
  //               transformOrigin={{
  //                 vertical: "top",
  //                 horizontal: "left",
  //               }}
  //               open={Boolean(anchorElNav)}
  //               onClose={handleCloseNavMenu}
  //               sx={{
  //                 display: { xs: "block", md: "none" },
  //               }}
  //             >
  //               {pages?.map((page) => (
  //                 <MenuItem
  //                   key={page}
  //                   onClick={() => {
  //                     navigate("/about");
  //                   }}
  //                 >
  //                   {page}
  //                   <Typography textAlign="center">{page}</Typography>
  //                 </MenuItem>
  //               ))}
  //             </Menu>
  //           </Box>
  //           <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
  //             {pages.map((page) => (
  //               <Button
  //                 key={page}
  //                 onClick={() => {
  //                   if (page === "About Us") navigate("/about");
  //                   else if (page === "Documentation")
  //                     navigate("/documentation");
  //                 }}
  //                 sx={{
  //                   my: 2,
  //                   color: "black",
  //                   fontFamily: "inherit",
  //                   fontWeight: 500,
  //                   display: "block",
  //                 }}
  //               >
  //                 {page}
  //               </Button>
  //             ))}
  //           </Box>

  //           <Box sx={{ flexGrow: 0 }}>
  //             <Menu
  //               sx={{ mt: "45px" }}
  //               id="menu-appbar"
  //               anchorEl={anchorElUser}
  //               anchorOrigin={{
  //                 vertical: "top",
  //                 horizontal: "right",
  //               }}
  //               keepMounted
  //               transformOrigin={{
  //                 vertical: "top",
  //                 horizontal: "right",
  //               }}
  //               open={Boolean(anchorElUser)}
  //               onClose={handleCloseUserMenu}
  //             >
  //               {settings.map((setting) => (
  //                 <MenuItem key={setting} onClick={handleCloseUserMenu}>
  //                   <Typography textAlign="center">{setting}</Typography>
  //                 </MenuItem>
  //               ))}
  //             </Menu>
  //           </Box>
  //         </Toolbar>
  //       </Container>
  //     </AppBar>
  //   </Box>
  // );
};
