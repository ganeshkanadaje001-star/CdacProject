import AdminSidebar from "./AdminSidebar";

const AdminLayout = ({ children }) => {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <AdminSidebar />
      <main style={{ flex: 1, padding: "24px", background: "#f8fafc" }}>
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;

