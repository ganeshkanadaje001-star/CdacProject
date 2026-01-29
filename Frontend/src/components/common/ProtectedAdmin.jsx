import { Navigate } from "react-router-dom";
import { decodeJwt } from "../../utils/jwt";

const ProtectedAdmin = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const decoded = decodeJwt(token);
  const role = decoded?.user_role;
  const exp = decoded?.exp;

  if (exp && exp * 1000 < Date.now()) {
    localStorage.removeItem("token");
    return <Navigate to="/login" replace />;
  }

  if (role !== "ADMIN") {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedAdmin;
