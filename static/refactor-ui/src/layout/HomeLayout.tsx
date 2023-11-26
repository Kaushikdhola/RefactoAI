import { isEmpty } from "lodash";
import { Fragment } from "react";
import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";
import { NavBar } from "./HomeNavBar";
import { Box, CssBaseline, CssVarsProvider } from "@mui/joy";

export const HomeLayout = () => {
  const { session }: any = useAuth();

  if (!isEmpty(session)) {
    return <Navigate to="/dashboard/home" />;
  }

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
        <Outlet />
      </Box>
    </CssVarsProvider>
  );
};
