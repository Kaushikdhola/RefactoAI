import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  CssBaseline,
  CssVarsProvider,
  Typography,
  typographyClasses,
} from "@mui/joy";
import { NavBar } from "../../layout/HomeNavBar";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
export const Documentation = () => {
  const [markdown, setMarkdown] = useState("");
  const readme = `# Re-Facto: Code More, Worry Less

  Re-Facto is a comprehensive Django and React application designed to streamline your coding process. With a Django backend and a React frontend, Re-Facto provides a seamless user experience, allowing you to focus on what matters most: your code.
  
  ## Features
  
  - **Django Backend**: Handles server-side logic, ensuring robust performance and security.
  - **React Frontend**: Delivers a responsive, intuitive user interface.
  
  ## Getting Started
  
  These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.
  
  ### Prerequisites
  
  - Python 3.8 or higher
  - Node.js and npm
  - Poetry (Python package manager)
  - Yarn (JavaScript package manager)
  
  ### Backend Installation
  
  1. Clone the repository: ~git clone <repository-url>~
  
  
  `;

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
            height: "100%",
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
              marginBottom: "10%",
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
            <Markdown remarkPlugins={[[remarkGfm, { singleTilde: false }]]}>
              {readme}
            </Markdown>
          </Box>
        </Container>
      </Box>
    </CssVarsProvider>
  );
};
