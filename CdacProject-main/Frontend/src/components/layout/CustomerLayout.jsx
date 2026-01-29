import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { API } from "../../api/endpoints";
import { decodeJwt } from "../../utils/jwt";

const CustomerLayout = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = decodeJwt(token);
      setUser(decoded);
      fetchCartCount();
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    const onCartUpdated = () => {
      fetchCartCount();
    };
    window.addEventListener("cart:updated", onCartUpdated);
    return () => {
      window.removeEventListener("cart:updated", onCartUpdated);
    };
  }, []);

  const fetchCartCount = async () => {
    try {
      const res = await axiosInstance.get(API.CART.GET);
      // Sum quantities
      const count = (res.data.cartItems || []).reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(count);
    } catch (err) {
      console.error("Failed to fetch cart count", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const fetchCategories = async () => {
    try {
      const res = await axiosInstance.get(API.CATEGORIES.GET_ALL);
      if (Array.isArray(res.data)) {
        setCategories(res.data);
      } else {
        setCategories([]);
      }
    } catch (err) {
      console.error("Failed to load categories", err);
      setCategories([]);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // Navigate to home with search query or filter if already on home
      // For now, let's just pass it via URL query param or state
      // Simpler: Just navigate to home and let Home page read from context or URL?
      // Let's use URL query param
      navigate(`/?search=${encodeURIComponent(searchTerm)}`);
    } else {
      navigate("/");
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#f8fafc" }}>
      {/* HEADER */}
      <header style={headerStyle}>
        <div style={containerStyle}>
          {/* LOGO */}
          <Link to="/" style={logoStyle}>FreshBasket</Link>

          {/* SEARCH */}
          <form onSubmit={handleSearch} style={searchFormStyle}>
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={searchInputStyle}
            />
          </form>

          {/* ACTIONS */}
          <div style={actionsStyle}>
            {!user ? (
              <div style={{ display: "flex", gap: "12px" }}>
                <Link to="/login" style={linkStyle}>Login</Link>
                <Link to="/register" style={registerBtnStyle}>Register</Link>
              </div>
            ) : (
              <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
                <Link to="/cart" style={iconLinkStyle}>
                  🛒 <span style={badgeStyle}>{cartCount}</span>
                </Link>
                <div style={profileMenu}>
                  <Link to="/profile" style={linkStyle}>Profile</Link>
                  <button onClick={handleLogout} style={logoutBtnStyle}>Logout</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* CATEGORY NAV (Optional/Simple) */}
      <nav style={navStyle}>
        <div style={containerStyle}>
          <Link to="/" style={navLinkStyle}>All</Link>
          {categories.map((c) => (
            <Link key={c.id} to={`/?cat=${c.id}`} style={navLinkStyle}>
              {c.name}
            </Link>
          ))}
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main style={{ flex: 1, padding: "24px 0" }}>
        <div style={containerStyle}>
          {children}
        </div>
      </main>

      {/* FOOTER */}
      <footer style={footerStyle}>
        <div style={containerStyle}>
          <p>&copy; 2026 FreshBasket. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

// --- STYLES ---
const headerStyle = { background: "#fff", borderBottom: "1px solid #e2e8f0", padding: "12px 0", position: "sticky", top: 0, zIndex: 100 };
const containerStyle = { maxWidth: "1200px", margin: "0 auto", padding: "0 16px", display: "flex", alignItems: "center", justifyContent: "space-between" };
const logoStyle = { fontSize: "24px", fontWeight: "800", color: "#16a34a", textDecoration: "none" };
const searchFormStyle = { flex: 1, maxWidth: "500px", margin: "0 24px" };
const searchInputStyle = { width: "100%", padding: "10px 16px", borderRadius: "99px", border: "1px solid #cbd5e1", background: "#f1f5f9", fontSize: "14px", outline: "none" };
const actionsStyle = { display: "flex", alignItems: "center" };
const linkStyle = { color: "#334155", textDecoration: "none", fontWeight: "600", fontSize: "14px" };
const registerBtnStyle = { background: "#16a34a", color: "#fff", padding: "8px 16px", borderRadius: "99px", textDecoration: "none", fontWeight: "600", fontSize: "14px" };
const iconLinkStyle = { fontSize: "20px", textDecoration: "none", position: "relative", marginRight: "10px" };
const badgeStyle = { position: "absolute", top: "-8px", right: "-8px", background: "#ef4444", color: "#fff", fontSize: "10px", fontWeight: "bold", padding: "2px 6px", borderRadius: "99px" };
const profileMenu = { display: "flex", alignItems: "center", gap: "16px" };
const logoutBtnStyle = { background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: "14px", fontWeight: "500" };
const navStyle = { background: "#fff", borderBottom: "1px solid #e2e8f0", padding: "10px 0" };
const navLinkStyle = { marginRight: "24px", color: "#475569", textDecoration: "none", fontSize: "14px", fontWeight: "500" };
const footerStyle = { background: "#1e293b", color: "#94a3b8", padding: "24px 0", textAlign: "center", fontSize: "14px" };

export default CustomerLayout;
