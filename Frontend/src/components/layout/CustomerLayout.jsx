import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { API } from "../../api/endpoints";
import { decodeJwt } from "../../utils/jwt";


// ✅ IMPORT BACKGROUND IMAGE
import customerBg from "../../../images/Customer-bag.jpg";

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
    const onCartUpdated = () => fetchCartCount();
    window.addEventListener("cart:updated", onCartUpdated);
    return () => window.removeEventListener("cart:updated", onCartUpdated);
  }, []);

  const fetchCartCount = async () => {
    try {
      const res = await axiosInstance.get(API.CART.GET);
      const count = (res.data.cartItems || []).reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      setCartCount(count);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axiosInstance.get(API.CATEGORIES.GET_ALL);
      setCategories(Array.isArray(res.data) ? res.data : []);
    } catch {
      setCategories([]);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(searchTerm.trim() ? `/?search=${searchTerm}` : "/");
  };

const [scrolled, setScrolled] = useState(false);

useEffect(() => {
  const onScroll = () => {
    setScrolled(window.scrollY > 10);
  };
  window.addEventListener("scroll", onScroll);
  return () => window.removeEventListener("scroll", onScroll);
}, []);

  return (
    /*BACKGROUND IMAGE */
    <div style={pageBg}>
      {/*GLASS OVERLAY */}
      <div style={glassOverlay}>
        {/* HEADER */}
        <header
  style={{
    ...headerStyle,
    boxShadow: scrolled
      ? "0 6px 18px rgba(0,0,0,0.12)"
      : "none",
    transition: "box-shadow 0.3s ease",
  }}
>

          <div style={containerStyle}>
            <Link to="/" style={logoStyle}>FreshBasket</Link>

            <form onSubmit={handleSearch} style={searchFormStyle}>
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products..."
                style={searchInputStyle}
              />
            </form>

            <div style={actionsStyle}>
              {!user ? (
                <>
                  <Link to="/login" style={linkStyle}>Login</Link>
                  <Link to="/register" style={registerBtnStyle}>Register</Link>
                </>
              ) : (
                <>
                  <Link to="/cart" style={iconLinkStyle}>
                    🛒 <span style={badgeStyle}>{cartCount}</span>
                  </Link>
                  <Link to="/profile" style={linkStyle}>Profile</Link>
                  <button onClick={handleLogout} style={logoutBtnStyle}>Logout</button>
                </>
              )}
            </div>
          </div>
        </header>

        {/* CATEGORY NAV */}
        <nav style={navStyle}>
          <div style={containerStyle}>
            <Link to="/" style={navLinkStyle}>All</Link>
            {categories.map(c => (
              <Link key={c.id} to={`/?cat=${c.id}`} style={navLinkStyle}>
                {c.name}
              </Link>
            ))}
          </div>
        </nav>

        {/* MAIN CONTENT */}
        <main style={mainStyle}>
          <div style={containerStyle} className="fade-in">
            {children}
          </div>
        </main>

        {/* FOOTER */}
        <footer style={footerStyle}>
          <p>© 2026 FreshBasket. All rights reserved.</p>
        </footer>
      </div>

      {/* SIMPLE FADE ANIMATION */}
      <style>{fadeCss}</style>
    </div>
  );
};

/* ================= STYLES ================= */

const pageBg = {
  minHeight: "100vh",
  backgroundImage: `url(${customerBg})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundAttachment: "fixed",
};

const glassOverlay = {
  minHeight: "100vh",
  background: "linear-gradient(180deg, rgba(255,255,255,0.92), rgba(255,255,255,0.85))",
  display: "flex",
  flexDirection: "column",
};


const headerStyle = {
  background: "rgba(255,255,255,0.9)",
  borderBottom: "1px solid #e2e8f0",
  position: "sticky",
  top: 0,
  zIndex: 100,
  animation: "slideDown 0.6s ease",
};

const containerStyle = {
  maxWidth: "1200px",
  margin: "0 auto",
  padding: "12px 16px",
  display: "flex",
  alignItems: "center",
  gap: "24px"
};

const logoStyle = {
  fontSize: "24px",
  fontWeight: 800,
  color: "#16a34a",
  textDecoration: "none",
};

const searchFormStyle = {
  flex: "1 1 360px",     
  maxWidth: "420px",
  margin: "0 24px",
};


const searchInputStyle = {
  width: "100%",
  padding: "10px 18px",
  borderRadius: "999px",
  border: "1px solid #cbd5e1",
  outline: "none",
  minWidth: 0,
};

const actionsStyle = { display: "flex", gap: "16px", alignItems: "center", marginLeft: "auto" };

const linkStyle = { textDecoration: "none", fontWeight: 600, color: "#334155" };

const registerBtnStyle = {
  background: "#16a34a",
  color: "#fff",
  padding: "8px 16px",
  borderRadius: "999px",
  textDecoration: "none",
};

const iconLinkStyle = { fontSize: "20px", position: "relative" };

const badgeStyle = {
  position: "absolute",
  top: "-8px",
  right: "-8px",
  background: "#ef4444",
  color: "#fff",
  fontSize: "10px",
  padding: "2px 6px",
  borderRadius: "999px",
};

const logoutBtnStyle = {
  border: "none",
  background: "none",
  cursor: "pointer",
  color: "#64748b",
};

const navStyle = {
  background: "rgba(255,255,255,0.95)",
  borderBottom: "1px solid #e2e8f0",
};

const navLinkStyle = {
  marginRight: "20px",
  textDecoration: "none",
  fontWeight: 500,
  color: "#475569",
};

const mainStyle = { flex: 1, padding: "32px 0" };

const footerStyle = {
  background: "#1e293b",
  color: "#cbd5e1",
  textAlign: "center",
  padding: "20px",
};

/* ANIMATION CSS */
const fadeCss = `
.fade-in {
  animation: fadeIn 0.8s ease-in-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes slideDown {
  from { transform: translateY(-100%); }
  to { transform: translateY(0); }
}
`;

export default CustomerLayout;