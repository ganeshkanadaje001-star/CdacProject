import { useEffect, useState } from "react";
import AdminSidebar from "./AdminSidebar";

const AdminLayout = ({ children }) => {
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const handler = (e) => {
      const { type, message } = e.detail || {};
      setToast({ type, message });
      const id = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(id);
    };
    window.addEventListener("app:toast", handler);
    return () => window.removeEventListener("app:toast", handler);
  }, []);

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <AdminSidebar />
      <main style={{ flex: 1, padding: "24px", background: "#f8fafc" }}>
        {toast && (
          <div
            style={{
              marginBottom: "12px",
              background: toast.type === "error" ? "#fee2e2" : "#dcfce7",
              color: toast.type === "error" ? "#b91c1c" : "#166534",
              padding: "10px",
              borderRadius: "8px",
              border: `1px solid ${toast.type === "error" ? "#fecaca" : "#86efac"}`,
            }}
          >
            {toast.message}
          </div>
        )}
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
