import React from "react";
import { TypeAnimation } from "react-type-animation";
import {
  Box,
  Container,
  CssBaseline,
  CssVarsProvider,
  Typography,
  typographyClasses,
} from "@mui/joy";
import { NavBar } from "../../layout/HomeNavBar";

export const About = () => {
  return (
    <CssVarsProvider disableTransitionOnChange>
      <CssBaseline />
      <Box
        display={"flex"}
        flexDirection={"column"}
        flex={1}
        position={"absolute"}
        width={"100%"}
        height={"100%"}
      >
        <NavBar />
        <Container
          sx={(theme) => ({
            position: "relative",
            // minHeight: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",

            // backgroundColor: "white",
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
              marginBottom: "10%",
              flexDirection: "column",
              // flex: 1,
              alignItems: "center",
              // backgroundColor: "yellow",
              gap: "1rem",
              maxWidth: "55ch",
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
            <TypeAnimation
              sequence={[
                // Same substring at the start will only be typed once, initially
                "We refactor code for Computers",
                1000,
                "We refactor code for Servers",
                1000,
                "We refactor code for Cloud",
                1000,
                "We refactor code for Everything",
                1000,
              ]}
              speed={50}
              style={{ fontSize: "2em" }}
              repeat={Infinity}
            />
            <Typography
              fontSize="lg"
              textColor="text.secondary"
              lineHeight="lg"
            >
              Re-Facto is an LLM-Based Code Refactoring Bot tailored for GitHub
              repositories. It seamlessly integrates with your codebase and
              takes the reins of recent pushes, elevating the quality and
              maintainability of your projects. The bot effortlessly initiates
              and executes refactoring processes, ensuring your code is super
              efficient. Upon completing the refactoring, Re-Facto takes the
              charge by creating a merge request, presenting the enhanced code
              for your consideration.
            </Typography>
          </Box>
        </Container>
      </Box>
    </CssVarsProvider>
  );
};
