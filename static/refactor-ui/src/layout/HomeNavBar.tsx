// import * as React from "react";
// import AppBar from "@mui/material/AppBar";
// import Box from "@mui/material/Box";
// import Toolbar from "@mui/material/Toolbar";
// import Typography from "@mui/material/Typography";
// import Button from "@mui/material/Button";
// import IconButton from "@mui/material/IconButton";
// import AdbIcon from "@mui/icons-material/Adb";
// import Container from "@mui/material/Container";
// import Menu from "@mui/material/Menu";
// import MenuItem from "@mui/material/MenuItem";
// import { AccountCircle, Image } from "@mui/icons-material";
// import { Router, useNavigate } from "react-router-dom";

// import logo from "../assets/images/logo.png";
export {};

// import { Link } from "react-router-dom";

// const settings = ["Profile", "Account", "Dashboard", "Logout"];
// const pages = ["About Us", "Documentation"];
// const logoSrc = require("../assets/images/logo.png");

// export const NavBar = () => {
//   const navigate = useNavigate();
//   const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
//     null
//   );
//   const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
//     null
//   );

//   const handleCloseNavMenu = () => {
//     setAnchorElNav(null);
//   };

//   const handleCloseUserMenu = () => {
//     setAnchorElUser(null);
//   };
//   return (
//     <Box>
//       <AppBar
//         sx={{
//           position: "absolute",
//           marginTop: "0px",
//           backgroundColor: "white",
//           boxShadow: "none",
//         }}
//       >
//         <Container
//           maxWidth="xl"
//           sx={{
//             color: "black",
//           }}
//         >
//           <Toolbar disableGutters>
//             {/* <AdbIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} /> */}

//             {/* <Image sx={{ display: { xs: "none", md: "flex" }, mr: 1 }}> */}
//             <img
//               onClick={() => navigate("/")}
//               style={{
//                 width: "50px",
//                 height: "50px",
//                 padding: "0px",
//                 margin: "0px",

//                 // margin: "auto 1em",
//                 // display: "inline-flex",
//               }}
//               src={logo}
//               alt="logo"
//             />
//             {/* </Image> */}

//             <Typography
//               variant="h6"
//               noWrap
//               component={"a"}
//               onClick={() => navigate("/")}
//               sx={{
//                 mr: 1,
//                 ml: 1,
//                 display: { xs: "none", md: "flex" },
//                 fontFamily: "inherit",
//                 fontWeight: 700,
//                 cursor: "pointer",
//                 letterSpacing: ".3rem",
//                 color: "inherit",
//                 textDecoration: "none",
//               }}
//             >
//               Re-Factor
//             </Typography>

//             <Box
//               sx={{
//                 flexGrow: 1,
//                 display: { xs: "flex", md: "none" },
//               }}
//             >
//               <IconButton
//                 size="large"
//                 aria-label="account of current user"
//                 aria-controls="menu-appbar"
//                 aria-haspopup="true"
//                 color="inherit"
//               >
//                 <AccountCircle />
//               </IconButton>
//               <Menu
//                 id="menu-appbar"
//                 anchorEl={anchorElNav}
//                 anchorOrigin={{
//                   vertical: "bottom",
//                   horizontal: "left",
//                 }}
//                 keepMounted
//                 transformOrigin={{
//                   vertical: "top",
//                   horizontal: "left",
//                 }}
//                 open={Boolean(anchorElNav)}
//                 onClose={handleCloseNavMenu}
//                 sx={{
//                   display: { xs: "block", md: "none" },
//                 }}
//               >
//                 {pages?.map((page) => (
//                   <MenuItem
//                     key={page}
//                     onClick={() => {
//                       navigate("/about");
//                     }}
//                   >
//                     {page}
//                     <Typography textAlign="center">{page}</Typography>
//                   </MenuItem>
//                 ))}
//               </Menu>
//             </Box>
//             <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
//               {pages.map((page) => (
//                 <Button
//                   key={page}
//                   onClick={() => {
//                     if (page === "About Us") navigate("/about");
//                     else if (page === "Documentation")
//                       navigate("/documentation");
//                   }}
//                   sx={{
//                     my: 2,
//                     color: "black",
//                     fontFamily: "inherit",
//                     fontWeight: 500,
//                     display: "block",
//                   }}
//                 >
//                   {page}
//                 </Button>
//               ))}
//             </Box>

//             <Box sx={{ flexGrow: 0 }}>
//               <Menu
//                 sx={{ mt: "45px" }}
//                 id="menu-appbar"
//                 anchorEl={anchorElUser}
//                 anchorOrigin={{
//                   vertical: "top",
//                   horizontal: "right",
//                 }}
//                 keepMounted
//                 transformOrigin={{
//                   vertical: "top",
//                   horizontal: "right",
//                 }}
//                 open={Boolean(anchorElUser)}
//                 onClose={handleCloseUserMenu}
//               >
//                 {settings.map((setting) => (
//                   <MenuItem key={setting} onClick={handleCloseUserMenu}>
//                     <Typography textAlign="center">{setting}</Typography>
//                   </MenuItem>
//                 ))}
//               </Menu>
//             </Box>
//           </Toolbar>
//         </Container>
//       </AppBar>
//     </Box>
//   );
// };
