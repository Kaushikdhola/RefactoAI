import { Route, Routes } from "react-router-dom";
import { Box, CssBaseline, CssVarsProvider } from "@mui/joy";

import { HomePage } from "./components/Home";
import { AuthProvider } from "./hooks/useAuth";
import { HomeLayout } from "./layout/HomeLayout";
import { Dashboard } from "./components/Dashboard";
import { ProtectedLayout } from "./layout/ProtectedLayout";


const App = () => {
  return (
    <CssVarsProvider disableTransitionOnChange>
      <CssBaseline />
      <Box sx={{ display: "flex", minHeight: "100dvh" }}>
        <AuthProvider>
          <Routes>
            <Route element={<HomeLayout />}>
              <Route path="/" element={<HomePage />} />
            </Route>
            <Route path="/dashboard" element={<ProtectedLayout />}>
              <Route path="profile" element={<Dashboard />} />
            </Route>
          </Routes>
        </AuthProvider>
      </Box>
    </CssVarsProvider>
  );
};

export default App;
