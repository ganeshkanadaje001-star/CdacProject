import { Navigate } from "react-router-dom";

const ProtectedCustomer = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const role = payload.user_role || payload.role;
    if (role !== "CUSTOMER") {
      return <Navigate to="/login" replace />;
    }
  } catch {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedCustomer;
