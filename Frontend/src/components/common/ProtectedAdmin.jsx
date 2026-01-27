import { Navigate } from "react-router-dom";
import { decodeJwt } from "../../utils/jwt";

const ProtectedAdmin = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const decoded = decodeJwt(token);

  if (!decoded || decoded.user_role !== "ADMIN") {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedAdmin;

