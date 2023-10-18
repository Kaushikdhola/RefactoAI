import { createContext, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "./useLocalStorage";

const AuthContext = createContext({});

export const AuthProvider = ({ children }: any) => {
	const [session, setSession] = useLocalStorage("session", null);
  const navigate = useNavigate();

  // call this function when you want to authenticate the user
  const login = async (data: any) => {
		setSession(data);
    navigate("/dashboard/profile");
  };

  // call this function to sign out logged in user
  const logout = () => {
		setSession(null);
    navigate("/", { replace: true });
  };

  const value = useMemo(
    () => ({
			session,
      login,
      logout,
    }),
    []
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
