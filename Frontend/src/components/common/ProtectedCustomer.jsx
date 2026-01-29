import { Navigate } from "react-router-dom";
import { decodeJwt } from "../../utils/jwt";

const ProtectedCustomer = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const decoded = decodeJwt(token);
  const role = decoded?.user_role || decoded?.role;
  const exp = decoded?.exp;

  // If token expired (exp is in seconds)
  if (exp && exp * 1000 < Date.now()) {
    localStorage.removeItem("token");
    return <Navigate to="/login" replace />;
  }

  if (role !== "CUSTOMER") {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedCustomer;
