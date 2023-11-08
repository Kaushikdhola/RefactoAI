import React from "react";
// import { NavBar } from "../../layout/HomeNavBar";
import { Container } from "@mui/joy";

export const Documentation = () => {
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
        <div>This is your Documentation</div>
      </Container>
    </>
  );
};
