import { Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";

const ProtectedRoute = () => {
  const jwtToken = Cookies.get("jwt_token");

  // If token is present, allow access (render child route)
  return jwtToken ? <Outlet /> : <Navigate to="/authentication" replace />;
};

export default ProtectedRoute;
