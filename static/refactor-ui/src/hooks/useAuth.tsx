import { createContext, useContext } from "react";

import { useLocalStorage } from "./useLocalStorage";

const AuthContext = createContext<any>(null);

export const useAuth = () => {
  const [session, setSession] = useLocalStorage("session", null);

  return {
    session: session,
    login(data: any) {
      return new Promise((res: any) => {
        setSession(data);
        res(data);
      });
    },
    logout() {
      return new Promise((res: any) => {
        setSession(null);
        res();
      });
    },
  };
};

export const AuthProvider = ({ children }: any) => {
  const auth = useAuth();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const AuthConsumer = () => {
  return useContext(AuthContext);
};
