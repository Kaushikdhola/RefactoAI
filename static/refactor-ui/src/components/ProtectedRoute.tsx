import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { isEmpty } from "lodash";

export const ProtectedRoute = ({ children }: any) => {
  const { session }: any = useAuth();
  if (isEmpty(session)) {
    // user is not authenticated
    return <Navigate to="/" />;
  }
  return children;
};
