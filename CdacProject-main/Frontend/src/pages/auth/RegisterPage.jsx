import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import { API } from "../../api/endpoints";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    role: "CUSTOMER",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPhone = (p) =>
    /^[6-9]\d{9}$/.test(p);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (!isValidEmail(form.email)) {
        setError("Please enter a valid email address");
        setLoading(false);
        return;
      }
      if ((form.password || "").length < 6) {
        setError("Password must be at least 6 characters");
        setLoading(false);
        return;
      }
      if (!isValidPhone(form.phone)) {
        setError("Phone must be a valid 10-digit Indian mobile number");
        setLoading(false);
        return;
      }
      await axiosInstance.post(API.AUTH.REGISTER, form);
      navigate("/login", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={page}>
      <div style={card}>
        <h1 style={title}>Create Account</h1>

        {error && <div style={errorBox}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={row}>
            <input
              style={input}
              placeholder="First Name"
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              required
            />
            <input
              style={input}
              placeholder="Last Name"
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              required
            />
          </div>

          <input
            style={input}
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />

          <input
            style={input}
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />

          <input
            style={input}
            placeholder="Phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            required
          />

          <select
            style={input}
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            <option value="CUSTOMER">Customer</option>
            <option value="ADMIN">Admin</option>
          </select>

          <button type="submit" disabled={loading} style={button}>
            {loading ? "Creating..." : "Register"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/login")}
            style={{ ...button, background: "#64748b", marginTop: "8px" }}
          >
            Back to Login
          </button>
        </form>
      </div>
    </div>
  );
};

const page = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "linear-gradient(135deg, #1e293b, #0f172a)",
  padding: "20px",
};
const card = {
  width: "100%",
  maxWidth: "420px",
  background: "#ffffff",
  borderRadius: "12px",
  padding: "28px",
  boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
};
const title = { margin: 0, fontSize: "24px", fontWeight: "700", color: "#0f172a", marginBottom: "16px" };
const row = { display: "flex", gap: "8px" };
const input = { width: "100%", padding: "12px 14px", marginBottom: "12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px", outline: "none" };
const button = { width: "100%", padding: "12px", background: "#2563eb", color: "#fff", border: "none", borderRadius: "8px", fontSize: "15px", fontWeight: "600", marginTop: "4px" };
const errorBox = { background: "#fee2e2", color: "#b91c1c", padding: "10px", borderRadius: "8px", marginBottom: "14px", fontSize: "13px" };

export default RegisterPage;
