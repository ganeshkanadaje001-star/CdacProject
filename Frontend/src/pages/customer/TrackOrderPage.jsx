import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CustomerLayout from "../../components/layout/CustomerLayout";
import axiosInstance from "../../api/axiosInstance";

const ORDER_STEPS = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED"];

const TrackOrderPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    axiosInstance.get("/order/getMyOrder").then((res) => {
      const found = res.data.find(
        (o) => o.orderId === Number(orderId)
      );
      setOrder(found);
    });
  }, [orderId]);

  if (!order) {
    return (
      <CustomerLayout>
        <p style={{ color: "#0f172a", textAlign: "center" }}>
          Order not found
        </p>
      </CustomerLayout>
    );
  }

  const currentStep = ORDER_STEPS.indexOf(order.status);

  return (
    <CustomerLayout>
      {/* 🔥 WHITE CARD TO FIX VISIBILITY */}
      <div style={pageWrapper}>
        <h2 style={title}>📦 Track Your Order</h2>

        <div style={infoBox}>
          <p><b>Order ID:</b> {order.orderId}</p>
          <p><b>Order Date:</b> {new Date(order.orderDate).toLocaleString()}</p>
          <p><b>Status:</b> {order.status}</p>
          <p><b>Total Amount:</b> ₹{order.totalAmount}</p>
        </div>

        <h4 style={sectionTitle}>Order Status</h4>
        <div>
          {ORDER_STEPS.map((step, index) => (
            <div key={step} style={statusRow}>
              <div
                style={{
                  ...statusDot,
                  background:
                    index <= currentStep ? "#16a34a" : "#cbd5e1",
                }}
              />
              <span style={statusText}>{step}</span>
            </div>
          ))}
        </div>

        <h4 style={sectionTitle}>🛒 Ordered Items</h4>
        {order.items.map((item) => (
          <div key={item.productId} style={itemRow}>
            <span>{item.productName}</span>
            <span>
              {item.quantity} × ₹{item.priceAtPurchase} = ₹{item.subTotal}
            </span>
          </div>
        ))}
      </div>
    </CustomerLayout>
  );
};

/* ================= STYLES ================= */

const pageWrapper = {
  maxWidth: "600px",
  margin: "40px auto",
  background: "#ffffff",
  padding: "24px",
  borderRadius: "12px",
  color: "#0f172a",           // ✅ FORCE DARK TEXT
};

const title = {
  marginBottom: "16px",
  color: "#0f172a",
};

const infoBox = {
  background: "#f8fafc",
  padding: "16px",
  borderRadius: "8px",
  marginBottom: "20px",
};

const sectionTitle = {
  marginTop: "20px",
  marginBottom: "10px",
  color: "#0f172a",
};

const statusRow = {
  display: "flex",
  alignItems: "center",
  marginBottom: "8px",
};

const statusDot = {
  width: "14px",
  height: "14px",
  borderRadius: "50%",
  marginRight: "10px",
};

const statusText = {
  color: "#334155",
  fontWeight: 600,
};

const itemRow = {
  display: "flex",
  justifyContent: "space-between",
  padding: "8px 0",
  borderBottom: "1px solid #e2e8f0",
  color: "#334155",
};

export default TrackOrderPage;
