import { useEffect, useMemo, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import axiosInstance from "../../api/axiosInstance";
import { API } from "../../api/endpoints";
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const [ordersRes, productsRes] = await Promise.all([
          axiosInstance.get(API.ORDERS.GET_ALL),
          axiosInstance.get(API.PRODUCTS.GET_ALL),
        ]);
        setOrders(Array.isArray(ordersRes.data) ? ordersRes.data : []);
        setProducts(Array.isArray(productsRes.data) ? productsRes.data : []);
      } catch (err) {
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const metrics = useMemo(() => {
    const toDate = (d) => (d ? new Date(d) : null);
    const isToday = (d) => {
      const dt = toDate(d);
      if (!dt) return false;
      const now = new Date();
      return (
        dt.getFullYear() === now.getFullYear() &&
        dt.getMonth() === now.getMonth() &&
        dt.getDate() === now.getDate()
      );
    };
    const statusEq = (o, s) =>
      (o?.status || "").toUpperCase() === s.toUpperCase();

    const totalOrders = orders.length;
    const todayOrders = orders.filter((o) => isToday(o.orderDate)).length;
    const pendingOrders = orders.filter((o) => statusEq(o, "PENDING")).length;
    const shippedOrders = orders.filter((o) => statusEq(o, "SHIPPED")).length;
    const cancelledOrders = orders.filter((o) => statusEq(o, "CANCELLED")).length;
    const totalRevenueConfirmed = orders
      .filter((o) => statusEq(o, "CONFIRMED"))
      .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    const recentOrders = [...orders]
      .sort(
        (a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
      )
      .slice(0, 10);

    const lowStock = products
      .filter((p) => (p.stock ?? 0) > 0 && (p.stock ?? 0) <= 5)
      .slice(0, 5);
    const outOfStock = products.filter((p) => (p.stock ?? 0) === 0).slice(0, 5);

    return {
      totalOrders,
      todayOrders,
      totalRevenueConfirmed,
      pendingOrders,
      shippedOrders,
      cancelledOrders,
      recentOrders,
      lowStock,
      outOfStock,
    };
  }, [orders, products]);

  return (
    <AdminLayout>
      <h1 style={{ marginBottom: "16px" }}>Admin Dashboard</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <div style={{ background: "#fee2e2", color: "#b91c1c", padding: "10px", borderRadius: "8px" }}>
          {error}
        </div>
      ) : (
        <>
          {/* SUMMARY CARDS */}
          <div style={cardsGrid}>
            <SummaryCard title="Total Orders" value={metrics.totalOrders} />
            <SummaryCard title="Orders Today" value={metrics.todayOrders} />
            <SummaryCard
              title="Revenue (Confirmed)"
              value={`$${metrics.totalRevenueConfirmed.toFixed(2)}`}
            />
            <SummaryCard title="Pending" value={metrics.pendingOrders} />
            <SummaryCard title="Shipped" value={metrics.shippedOrders} />
            <SummaryCard title="Cancelled" value={metrics.cancelledOrders} />
          </div>

          {/* RECENT ORDERS */}
          <section style={{ marginTop: "24px" }}>
            <div style={sectionHeader}>
              <h2 style={sectionTitle}>Recent Orders</h2>
              <button style={linkBtn} onClick={() => navigate("/admin/orders")}>
                View All
              </button>
            </div>
            {metrics.recentOrders.length === 0 ? (
              <EmptyMessage message="No orders yet. When customers place orders, they will appear here." />
            ) : (
              <table style={tableStyle}>
                <thead style={theadStyle}>
                  <tr>
                    <th style={thStyle}>Order ID</th>
                    <th style={thStyle}>Date</th>
                    <th style={thStyle}>Status</th>
                    <th style={thStyle}>Total</th>
                    <th style={thStyle}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {metrics.recentOrders.map((o) => (
                    <tr key={o.orderId} style={trStyle}>
                      <td style={tdStyle}>{o.orderId}</td>
                      <td style={tdStyle}>
                        {o.orderDate ? new Date(o.orderDate).toLocaleString() : "N/A"}
                      </td>
                      <td style={tdStyle}>
                        <StatusBadge status={o.status} />
                      </td>
                      <td style={tdStyle}>${(o.totalAmount || 0).toFixed(2)}</td>
                      <td style={tdStyle}>
                        <button style={smallBtn} onClick={() => navigate("/admin/orders")}>
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>

          {/* ATTENTION & INVENTORY */}
          <section style={{ marginTop: "24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div>
              <h2 style={sectionTitle}>Needs Attention</h2>
              {metrics.pendingOrders === 0 ? (
                <EmptyMessage message="No pending orders. All clear." />
              ) : (
                <p style={{ color: "#334155" }}>
                  There are {metrics.pendingOrders} pending orders waiting for action.
                </p>
              )}
            </div>
            <div>
              <h2 style={sectionTitle}>Inventory Alerts</h2>
              {metrics.lowStock.length === 0 && metrics.outOfStock.length === 0 ? (
                <EmptyMessage message="No inventory alerts. Stock levels look good." />
              ) : (
                <>
                  {metrics.outOfStock.length > 0 && (
                    <>
                      <h3 style={subTitle}>Out of Stock</h3>
                      <ul style={listStyle}>
                        {metrics.outOfStock.map((p) => (
                          <li key={p.id} style={listItem}>
                            {p.name} — stock {p.stock}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                  {metrics.lowStock.length > 0 && (
                    <>
                      <h3 style={subTitle}>Low Stock (≤5)</h3>
                      <ul style={listStyle}>
                        {metrics.lowStock.map((p) => (
                          <li key={p.id} style={listItem}>
                            {p.name} — stock {p.stock}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </>
              )}
            </div>
          </section>
        </>
      )}
    </AdminLayout>
  );
};

const SummaryCard = ({ title, value }) => (
  <div style={cardStyle}>
    <p style={{ margin: 0, color: "#64748b", fontSize: "13px" }}>{title}</p>
    <p style={{ margin: "6px 0 0", color: "#0f172a", fontWeight: 700, fontSize: "18px" }}>{value}</p>
  </div>
);

const StatusBadge = ({ status }) => {
  const s = (status || "").toUpperCase();
  const map = {
    PENDING: { bg: "#fef3c7", color: "#92400e", label: "Pending" },
    CONFIRMED: { bg: "#dcfce7", color: "#166534", label: "Confirmed" },
    SHIPPED: { bg: "#e0f2fe", color: "#075985", label: "Shipped" },
    CANCELLED: { bg: "#fee2e2", color: "#b91c1c", label: "Cancelled" },
  };
  const style = map[s] || { bg: "#e2e8f0", color: "#1f2937", label: s || "Unknown" };
  return (
    <span style={{ background: style.bg, color: style.color, padding: "4px 8px", borderRadius: "999px", fontSize: "12px" }}>
      {style.label}
    </span>
  );
};

const EmptyMessage = ({ message }) => (
  <div style={{ background: "#f1f5f9", color: "#334155", padding: "12px", borderRadius: "8px" }}>
    {message}
  </div>
);

const cardsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
  gap: "16px",
};

const cardStyle = {
  background: "#fff",
  border: "1px solid #e2e8f0",
  borderRadius: "10px",
  padding: "14px",
  boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
};

const sectionHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "8px",
};

const sectionTitle = { margin: 0, fontSize: "16px", color: "#0f172a" };
const subTitle = { margin: "8px 0", fontSize: "14px", color: "#334155" };

const linkBtn = {
  padding: "8px 12px",
  background: "#2563eb",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "13px",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  background: "#fff",
  borderRadius: "8px",
  overflow: "hidden",
};
const theadStyle = { background: "#f1f5f9", textAlign: "left" };
const thStyle = { padding: "12px", fontSize: "13px", color: "#64748b" };
const trStyle = { borderBottom: "1px solid #e2e8f0" };
const tdStyle = { padding: "12px", fontSize: "14px", color: "#334155" };
const smallBtn = {
  padding: "6px 10px",
  background: "#2563eb",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "12px",
};
const listStyle = { margin: 0, paddingLeft: "16px" };
const listItem = { color: "#334155", fontSize: "13px", marginBottom: "4px" };

export default DashboardPage;
