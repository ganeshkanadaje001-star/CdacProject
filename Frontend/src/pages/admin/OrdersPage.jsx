import { useState, useEffect } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import axiosInstance from "../../api/axiosInstance";
import { API } from "../../api/endpoints";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewOrder, setViewOrder] = useState(null);
  const [updateStatus, setUpdateStatus] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(API.ORDERS.GET_ALL);
      console.log("Orders fetched:", res.data);
      setOrders(res.data);
      setError(null);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 403 || err.response?.status === 401) {
        // Fallback: try to load current user's orders so the page shows data
        try {
          const resMine = await axiosInstance.get(API.ORDERS.MY_ORDERS);
          setOrders(resMine.data);
          setError("You are not authorized to view all orders. Showing your orders instead.");
        } catch (err2) {
          console.error(err2);
          setError("Failed to fetch orders. You may need to login as ADMIN.");
        }
      } else {
        setError("Failed to fetch orders. Backend might be restarting.");
      }
    } finally {
      setLoading(false);
    }
  };

  const downloadOrdersExcel = () => {
    const rows = orders.map((o) => {
      const items = (o.items || []).map((it) => it.productName).join(", ");
      const quantities = (o.items || []).map((it) => it.quantity).join(", ");
      const prices = (o.items || []).map((it) => (typeof it.priceAtPurchase === "number" ? it.priceAtPurchase.toFixed(2) : "")).join(", ");
      const date = o.orderDate ? new Date(o.orderDate).toLocaleString() : "";
      const status = o.status || "";
      const total = typeof o.totalAmount === "number" ? o.totalAmount.toFixed(2) : "";
      return [o.orderId || "", date, status, total, items, quantities, prices];
    });
    const header = ["Order ID", "Date", "Status", "Total", "Items", "Quantities", "Item Prices"];
    let html = "<table><thead><tr>";
    header.forEach((h) => { html += `<th>${String(h).replace(/</g, "&lt;")}</th>`; });
    html += "</tr></thead><tbody>";
    rows.forEach((r) => {
      html += "<tr>";
      r.forEach((c) => { html += `<td>${String(c ?? "").replace(/</g, "&lt;")}</td>`; });
      html += "</tr>";
    });
    html += "</tbody></table>";
    const blob = new Blob([html], { type: "application/vnd.ms-excel" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "all-orders.xls";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const createTestOrder = async () => {
    alert("Use customer checkout to create test orders. Admin can only view all orders here.");
  };

  const openView = (order) => {
    setViewOrder(order);
    setUpdateStatus(order.status || "PENDING");
  };

  const closeView = () => {
    setViewOrder(null);
    setUpdateStatus("");
  };

  const saveStatus = async () => {
    if (!viewOrder || !updateStatus) return;
    try {
      await axiosInstance.put(API.ORDERS.UPDATE_STATUS(viewOrder.orderId, updateStatus));
      closeView();
      await fetchOrders();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  if (loading) return <AdminLayout><div className="p-4">Loading orders...</div></AdminLayout>;
  if (error) return <AdminLayout><div className="p-4 text-red-500">{error} <button onClick={fetchOrders} className="ml-2 underline">Retry</button></div></AdminLayout>;

  return (
    <AdminLayout>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h1 style={{ fontSize: "20px", fontWeight: 700, color: "#0f172a" }}>Orders</h1>
        <div style={{ display: "flex", gap: "8px" }}>
          <button onClick={downloadOrdersExcel} style={{ background: "#16a34a", color: "#fff", padding: "8px 12px", borderRadius: "6px", fontSize: "12px", border: "none", cursor: "pointer", fontWeight: 600 }}>
            Download Excel
          </button>
          <button onClick={createTestOrder} style={{ background: "#94a3b8", color: "#fff", padding: "8px 12px", borderRadius: "6px", fontSize: "12px", border: "none", cursor: "not-allowed" }}>
            + Create Test Order
          </button>
        </div>
      </div>

      <div style={{ background: "#ffffff", borderRadius: "8px", overflow: "hidden", boxShadow: "0 2px 6px rgba(0,0,0,0.06)" }}>
        <table style={{ width: "100%", textAlign: "left", borderCollapse: "collapse", color: "#111827" }}>
          <thead style={{ background: "#f1f5f9" }}>
            <tr>
              <th style={{ padding: "12px", borderBottom: "1px solid #e5e7eb", color: "#64748b", fontSize: "14px" }}>Order ID</th>
              <th style={{ padding: "12px", borderBottom: "1px solid #e5e7eb", color: "#64748b", fontSize: "14px" }}>Date</th>
              <th style={{ padding: "12px", borderBottom: "1px solid #e5e7eb", color: "#64748b", fontSize: "14px" }}>Status</th>
              <th style={{ padding: "12px", borderBottom: "1px solid #e5e7eb", color: "#64748b", fontSize: "14px" }}>Total Amount</th>
              <th style={{ padding: "12px", borderBottom: "1px solid #e5e7eb", color: "#64748b", fontSize: "14px" }}>Items</th>
              <th style={{ padding: "12px", borderBottom: "1px solid #e5e7eb", color: "#64748b", fontSize: "14px" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.orderId} style={{ borderBottom: "1px solid #e5e7eb" }}>
                <td style={{ padding: "12px", color: "#111827", fontSize: "14px" }}>#{order.orderId}</td>
                <td style={{ padding: "12px", color: "#111827", fontSize: "14px" }}>{order.orderDate ? new Date(order.orderDate).toLocaleString() : "-"}</td>
                <td style={{ padding: "12px" }}>
                  <span style={{
                    padding: "2px 8px",
                    borderRadius: "6px",
                    fontSize: "12px",
                    background: order.status === 'DELIVERED' ? '#dcfce7' : (order.status === 'CANCELLED' ? '#fee2e2' : '#fde68a'),
                    color: order.status === 'DELIVERED' ? '#166534' : (order.status === 'CANCELLED' ? '#991b1b' : '#92400e')
                  }}>
                    {order.status}
                  </span>
                </td>
                <td style={{ padding: "12px", color: "#111827", fontSize: "14px" }}>₹{order.totalAmount}</td>
                <td style={{ padding: "12px", color: "#111827", fontSize: "14px" }}>
                  <ul style={{ listStyleType: "disc", paddingLeft: "16px", fontSize: "13px" }}>
                    {(order.items || []).map((item, idx) => (
                      <li key={idx}>
                        {item.productName} (#{item.productId}) × {item.quantity} — ₹{item.priceAtPurchase} each, Subtotal ₹{item.subTotal}
                      </li>
                    ))}
                  </ul>
                </td>
                <td style={{ padding: "12px" }}>
                  <button onClick={() => openView(order)} style={{ background: "#2563eb", color: "#fff", padding: "8px 12px", borderRadius: "6px", fontSize: "12px", border: "none", cursor: "pointer" }}>
                    View
                  </button>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan="5" style={{ padding: "12px", textAlign: "center", color: "#64748b" }}>
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {viewOrder && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }}>
          <div style={{ background: "#fff", padding: "20px", borderRadius: "10px", width: "600px", maxWidth: "95vw" }}>
            <h2 style={{ marginTop: 0, color: "#0f172a" }}>Order #{viewOrder.orderId}</h2>
            <p style={{ color: "#334155" }}>Date: {viewOrder.orderDate ? new Date(viewOrder.orderDate).toLocaleString() : "-"}</p>
            <p style={{ color: "#334155" }}>Total: ₹{viewOrder.totalAmount}</p>
            <div style={{ marginTop: "12px" }}>
              <h3 style={{ color: "#0f172a" }}>Items</h3>
              <ul style={{ listStyle: "disc", paddingLeft: "20px" }}>
                {(viewOrder.items || []).map((it, idx) => (
                  <li key={idx} style={{ color: "#111827" }}>
                    {it.productName} × {it.quantity} — ₹{it.priceAtPurchase} each, Subtotal ₹{it.subTotal}
                  </li>
                ))}
              </ul>
            </div>
            <div style={{ marginTop: "16px", display: "flex", gap: "10px", alignItems: "center" }}>
              <label style={{ color: "#0f172a", fontWeight: 600 }}>Change Status</label>
              <select value={updateStatus} onChange={(e) => setUpdateStatus(e.target.value)} style={{ padding: "8px", borderRadius: "6px", border: "1px solid #e5e7eb" }}>
                {["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <button onClick={saveStatus} style={{ background: "#16a34a", color: "#fff", padding: "8px 12px", borderRadius: "6px", border: "none", cursor: "pointer", fontWeight: 600 }}>
                Update
              </button>
              <button onClick={closeView} style={{ background: "#ef4444", color: "#fff", padding: "8px 12px", borderRadius: "6px", border: "none", cursor: "pointer" }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default OrdersPage;
