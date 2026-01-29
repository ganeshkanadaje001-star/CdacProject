import { useState, useEffect } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import axiosInstance from "../../api/axiosInstance";
import { API } from "../../api/endpoints";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const createTestOrder = async () => {
    try {
      setLoading(true);
      // Try to create an order for Product ID 1 with Quantity 1
      await axiosInstance.post(API.ORDERS.PLACE, { productId: 1, quantity: 1 });
      alert("Test order created! Refreshing list...");
      fetchOrders();
    } catch (err) {
      console.error(err);
      alert("Failed to create test order. Ensure Product ID 1 exists.");
      setLoading(false);
    }
  };

  if (loading) return <AdminLayout><div className="p-4">Loading orders...</div></AdminLayout>;
  if (error) return <AdminLayout><div className="p-4 text-red-500">{error} <button onClick={fetchOrders} className="ml-2 underline">Retry</button></div></AdminLayout>;

  return (
    <AdminLayout>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h1 style={{ fontSize: "20px", fontWeight: 700, color: "#0f172a" }}>Orders</h1>
        <button 
          onClick={createTestOrder}
          style={{ background: "#2563eb", color: "#fff", padding: "8px 12px", borderRadius: "6px", fontSize: "12px", border: "none", cursor: "pointer" }}
        >
          + Create Test Order
        </button>
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
    </AdminLayout>
  );
};

export default OrdersPage;
