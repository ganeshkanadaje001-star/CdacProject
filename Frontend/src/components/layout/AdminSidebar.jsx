import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../api/authService";
import { decodeJwt } from "../../utils/jwt";
import axios from "axios";

const AdminSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = decodeJwt(token);
      const username = decoded?.sub || "Unknown";
      const role = decoded?.user_role || decoded?.role || "Unknown";
      const url = (import.meta.env.VITE_DOTNET_LOGGER_LOGIN_URL || "").trim();
      if (url) {
        axios
          .post(url, {
            level: "INFO",
            source: "LOGOUT",
            message: `User ${username} logged out (${role})`,
            data: new Date().toISOString(),
          })
          .catch(() => {});
      }
    }
    logout();
    navigate("/login");
  };

  return (
    <aside
      style={{
        width: "240px",
        background: "#1e293b",
        color: "#fff",
        padding: "20px",
      }}
    >
      <h2>FreshBasket</h2>
      <p style={{ fontSize: "14px", opacity: 0.7 }}>Admin Panel</p>

      <nav style={{ marginTop: "30px" }}>
        <p><Link to="/admin/dashboard" style={linkStyle}>Dashboard</Link></p>
        <p><Link to="/admin/products" style={linkStyle}>Products</Link></p>
        <p><Link to="/admin/categories" style={linkStyle}>Categories</Link></p>
        <p><Link to="/admin/orders" style={linkStyle}>Orders</Link></p>
      </nav>

      <button
        onClick={handleLogout}
        style={{
          marginTop: "40px",
          width: "100%",
          padding: "10px",
          background: "#ef4444",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        Logout
      </button>
    </aside>
  );
};

const linkStyle = {
  color: "#fff",
  textDecoration: "none",
  display: "block",
  padding: "8px 0",
};

export default AdminSidebar;
