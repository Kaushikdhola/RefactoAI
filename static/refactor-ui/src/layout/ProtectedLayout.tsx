import { isEmpty } from "lodash";
import { Navigate, Outlet } from "react-router-dom";
import { Box, CssBaseline, CssVarsProvider } from "@mui/joy";

import Header from "./Header";
import { Sidebar } from "./Sidebar";
import { useAuth } from "../hooks/useAuth";

export const ProtectedLayout = () => {
  const { session }: any = useAuth();

  if (isEmpty(session)) {
    return <Navigate to="/" />;
  }

  return (
    <CssVarsProvider disableTransitionOnChange>
      <CssBaseline />
      <Box sx={{ display: "flex", minHeight: "100dvh" }}>
        <Sidebar />
        <Header />
        <Box
          component="main"
          className="MainContent"
          sx={{
            pt: {
              xs: "calc(12px + var(--Header-height))",
              md: 3,
            },
            pb: {
              xs: 2,
              sm: 2,
              md: 3,
            },
            flex: 1,
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
            height: "100dvh",
            gap: 1,
            overflow: "auto",
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </CssVarsProvider>
  );
};
