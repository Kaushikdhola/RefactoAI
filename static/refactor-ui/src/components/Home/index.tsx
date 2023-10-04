import { GitHub } from "@mui/icons-material";
import {
  AspectRatio,
  Box,
  Button,
  Container,
  Link,
  Typography,
  typographyClasses,
} from "@mui/joy";
import { useContext, useEffect, useState } from "react";

import { AuthContext } from "../../App";
import { prepareQueryParamsFromObject } from "../../utils/helpers";
import axios from "axios";

export const HomePage = () => {
  const { state, dispatch } = useContext(AuthContext);
  const [data, setData] = useState({ errorMessage: "", isLoading: false });
  const { client_id, redirect_uri, client_secret } = state;
  const params = {
    redirect_uri: redirect_uri,
    client_id: client_id,
  };

  useEffect(() => {
    const url = window.location.href;
    const hasCode = url.includes("?code=");
    if (!hasCode) {
      return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const newUrl = url.split("?code=");
    const code = urlParams.get("code");
    window.history.pushState({}, "", newUrl[0]);
    setData({ ...data, isLoading: true });

    const payload = {
      code: code,
      client_id: client_id,
      client_secret: client_secret,
    };

    ///
    const githubURL = "https://github.com/login/oauth/access_token";

    axios.post(githubURL, JSON.stringify(payload))?.then((res) => {
      console.log("res", res);
    });

    // fetch(`https://github.com/login/oauth/access_token`, {
    //   method: "POST",
    //   mode: "cors",
    //   headers: {
    //     "Access-Control-Allow-Origin": "*",
    //     Authorization: `token ${12324324324}`,
    //   },
    //   body: JSON.stringify(payload),
    // })?.then((res) => {
    //   console.log("res", res)
    // });
  }, [state, dispatch, data]);

  const handleLogin = () => {
    window?.location?.assign(
      `https://github.com/login/oauth/authorize?${prepareQueryParamsFromObject(
        params
      )}`
    );
  };

  return (
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
        <Typography color="primary" fontSize="lg" fontWeight="lg">
          Worry less, Code more
        </Typography>
        <Typography
          level="h1"
          fontWeight="xl"
          fontSize="clamp(1.875rem, 1.3636rem + 2.1818vw, 3rem)"
        >
          Re-Factor
        </Typography>
        <Typography fontSize="lg" textColor="text.secondary" lineHeight="lg">
          A refactoring bot made using the power of Artificial Intelligence.
          Start by integrating it into your repositories.
        </Typography>
        <Button
          size="lg"
          endDecorator={<GitHub fontSize="large" />}
          onClick={handleLogin}
        >
          Get started with
        </Button>
        <Typography>
          Already a member? <Link fontWeight="lg" onClick={handleLogin}>Sign in</Link>
        </Typography>
      </Box>
      <AspectRatio
        ratio={600 / 520}
        variant="outlined"
        maxHeight={300}
        sx={(theme) => ({
          minWidth: 300,
          alignSelf: "stretch",
          [theme.breakpoints.up(834)]: {
            alignSelf: "initial",
            flexGrow: 1,
            "--AspectRatio-maxHeight": "520px",
            "--AspectRatio-minHeight": "400px",
          },
          borderRadius: "sm",
          bgcolor: "background.level2",
          flexBasis: "50%",
        })}
      >
        <img
          src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80"
          alt=""
        />
      </AspectRatio>
    </Container>
  );
};