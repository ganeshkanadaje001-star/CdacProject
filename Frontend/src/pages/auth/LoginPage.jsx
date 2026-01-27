import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, encryptPasswords } from "../../api/authService";
import { decodeJwt } from "../../utils/jwt";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");
    setMsg("");
    setLoading(true);

    try {
      const res = await login({ email, password });
      
      // Backend returns { jwtDto: "token", message: "..." }
      const token = res.jwtDto;
      
      if (!token) throw new Error("JWT not received");

      localStorage.setItem("token", token);
      const decoded = decodeJwt(token);
      const role = decoded?.user_role;
      if (role === "ADMIN") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/customer/dashboard", { replace: true });
      }

    } catch (err) {
      console.error(err);
      if (!err.response) {
        setError("Network Error: Check backend connection or CORS");
      } else {
        setError(
          err.response?.data?.message ||
          "Invalid email or password"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFixPasswords = async () => {
    try {
      setLoading(true);
      await encryptPasswords();
      setMsg("Passwords encrypted successfully! Try logging in now.");
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to fix passwords. Backend might be down.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>FreshBasket</h1>
        <p style={styles.subtitle}>Login</p>

        {error && <div style={styles.error}>{error}</div>}
        {msg && <div style={{...styles.error, color: 'green', background: '#dcfce7', borderColor: '#86efac'}}>{msg}</div>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            ...styles.button,
            opacity: loading ? 0.6 : 1,
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Signing in..." : "Login"}
        </button>

        <button
          onClick={() => navigate("/register")}
          style={{
            ...styles.button,
            background: "#10b981",
            marginTop: "12px"
          }}
        >
          Create Account
        </button>
        <p style={styles.footer}>Use your email and password</p>

        <button 
          onClick={handleFixPasswords}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#64748b',
            fontSize: '12px',
            textDecoration: 'underline',
            cursor: 'pointer',
            marginTop: '10px',
            width: '100%'
          }}
        >
          Debug: Fix Database Passwords (Encryption)
        </button>
      </div>
    </div>
  );
}

export default LoginPage;

/* ================= STYLES ================= */

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #1e293b, #0f172a)",
    padding: "20px",
  },
  card: {
    width: "100%",
    maxWidth: "380px",
    background: "#ffffff",
    borderRadius: "12px",
    padding: "32px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
    textAlign: "center",
  },
  title: {
    margin: 0,
    fontSize: "28px",
    fontWeight: "700",
    color: "#0f172a",
  },
  subtitle: {
    margin: "8px 0 24px",
    color: "#475569",
    fontSize: "14px",
  },
  input: {
    width: "100%",
    padding: "12px 14px",
    marginBottom: "14px",
    borderRadius: "8px",
    border: "1px solid #cbd5e1",
    fontSize: "14px",
    outline: "none",
  },
  button: {
    width: "100%",
    padding: "12px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "15px",
    fontWeight: "600",
    marginTop: "10px",
  },
  error: {
    background: "#fee2e2",
    color: "#b91c1c",
    padding: "10px",
    borderRadius: "8px",
    marginBottom: "14px",
    fontSize: "13px",
  },
  footer: {
    marginTop: "18px",
    fontSize: "12px",
    color: "#64748b",
  },
};
