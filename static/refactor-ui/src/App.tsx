import { Route, Switch } from "react-router-dom";
import { createContext, useReducer } from "react";
import { Box, CssBaseline, CssVarsProvider } from "@mui/joy";

import { HomePage } from "./components/Home";
import { Dashboard } from "./components/Dashboard";
import { CallBack } from "./components/CallBack";
import { initialState, reducer } from "./store/reducer";

export const AuthContext = createContext<any>({});

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <CssVarsProvider disableTransitionOnChange>
      <CssBaseline />
      <Box sx={{ display: "flex", minHeight: "100dvh" }}>
        <AuthContext.Provider value={{ state, dispatch }}>
          <Switch>
            <Route path="/" exact>
              <HomePage />
            </Route>
            <Route path="/callback" exact>
              <CallBack />
            </Route>
            <Route path="/dashboard">
              <Dashboard />
            </Route>
          </Switch>
        </AuthContext.Provider>
      </Box>
    </CssVarsProvider>
  );
};

export default App;
