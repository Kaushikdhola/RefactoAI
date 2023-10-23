import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { Box, CssBaseline, CssVarsProvider } from "@mui/joy";

import { HomePage } from "./components/Home";
import Settings from "./components/Settings";
import { HomeLayout } from "./layout/HomeLayout";
import { Dashboard } from "./components/Dashboard";
import { ProtectedLayout } from "./layout/ProtectedLayout";
import { prepareSessionData } from "./redux/actions/SessionActions";
import { About } from "./components/AboutUs";
import { Documentation } from "./components/Documentation";

const App = () => {
  useEffect(() => {
    fetchSession();
  }, []);

  const fetchSession = async () => {
    await prepareSessionData();
  };

  return (
    <>
      {/* <CssVarsProvider disableTransitionOnChange> */}
      <CssBaseline />
      <Box sx={{ display: "flex", minHeight: "100dvh" }}>
        <Routes>
          <Route element={<HomeLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="about" element={<About />} />
            <Route path="documentation" element={<Documentation />} />
          </Route>
          <Route path="/dashboard" element={<ProtectedLayout />}>
            <Route path="home" element={<Dashboard />} />
            <Route path="refactorings" element={<Dashboard />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </Box>
      {/* </CssVarsProvider> */}
    </>
  );
};

export default App;
