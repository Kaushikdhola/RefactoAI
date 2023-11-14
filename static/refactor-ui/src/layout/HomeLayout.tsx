import { isEmpty } from "lodash";
import { Fragment } from "react";
import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";

export const HomeLayout = () => {
  const { session }: any = useAuth();

  if (!isEmpty(session)) {
    return <Navigate to="/dashboard/home" />;
  }

  return (
    <Fragment>
      <Outlet />
    </Fragment>
  );
};
