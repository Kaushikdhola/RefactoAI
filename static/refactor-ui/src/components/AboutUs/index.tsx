import React from "react";
// import { NavBar } from "../../layout/HomeNavBar";
import { Box, Container, Typography, typographyClasses } from "@mui/joy";

export const About = () => {
  return (
    <>
      {/* <NavBar /> */}
      <Container
        sx={(theme) => ({
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          py: 10,
          gap: 4,
          [theme.breakpoints.up(834)]: {
            flexDirection: "row",
            gap: 6,
          },
          [theme.breakpoints.up(1199)]: {
            gap: 12,
          },
        })}
      >
        <Box
          sx={(theme) => ({
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1rem",
            maxWidth: "50ch",
            textAlign: "center",
            flexShrink: 999,
            [theme.breakpoints.up(834)]: {
              minWidth: 420,
              alignItems: "flex-start",
              textAlign: "initial",
            },
            [`& .${typographyClasses.root}`]: {
              textWrap: "balance",
            },
          })}
        >
          <Typography
            level="h1"
            fontWeight="xl"
            fontSize="clamp(1.875rem, 1.3636rem + 2.1818vw, 3rem)"
          >
            About us
          </Typography>
          <Typography fontSize="lg" textColor="text.secondary" lineHeight="lg">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </Typography>
        </Box>
      </Container>
    </>
  );
};
