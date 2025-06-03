import { Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";

const PublicRoute = () => {
  const jwtToken = Cookies.get("jwt_token");

  // If token exists, redirect to home
  return jwtToken ? <Navigate to="/" replace /> : <Outlet />;
};

export default PublicRoute;
