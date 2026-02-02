import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CustomerLayout from "../../components/layout/CustomerLayout";
import axiosInstance from "../../api/axiosInstance";
import { API } from "../../api/endpoints";
import { decodeJwt } from "../../utils/jwt";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("info");
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [newAddr, setNewAddr] = useState({
    addressLine: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setUser(decodeJwt(token));
      fetchOrders();
      fetchAddresses();
    }
  }, []);

  const fetchOrders = async () => {
    const res = await axiosInstance.get(API.ORDERS.MY_ORDERS);
    setOrders(res.data);
  };

  const fetchAddresses = async () => {
    const res = await axiosInstance.get(API.ADDRESS.GET_ALL);
    setAddresses(res.data);
  };

  const downloadOrdersExcel = () => {
    const rows = orders.map((o) => {
      const items = (o.items || []).map((it) => it.productName).join(", ");
      const quantities = (o.items || []).map((it) => it.quantity).join(", ");
      const prices = (o.items || []).map((it) => it.priceAtPurchase?.toFixed(2)).join(", ");
      const date = o.orderDate ? new Date(o.orderDate).toLocaleString() : "";
      const status = o.status || "";
      const total = typeof o.totalAmount === "number" ? o.totalAmount.toFixed(2) : "";
      return [o.orderId || "", date, status, total, items, quantities, prices];
    });
    const header = ["Order ID", "Date", "Status", "Total", "Items", "Quantities", "Item Prices"];
    let html = "<table><thead><tr>";
    header.forEach((h) => {
      html += `<th>${String(h).replace(/</g, "&lt;")}</th>`;
    });
    html += "</tr></thead><tbody>";
    rows.forEach((r) => {
      html += "<tr>";
      r.forEach((c) => {
        html += `<td>${String(c ?? "").replace(/</g, "&lt;")}</td>`;
      });
      html += "</tr>";
    });
    html += "</tbody></table>";
    const blob = new Blob([html], { type: "application/vnd.ms-excel" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `order-history-${user?.sub || "user"}.xls`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    await axiosInstance.post(API.ADDRESS.ADD, newAddr);
    setNewAddr({
      addressLine: "",
      city: "",
      state: "",
      pincode: "",
      country: "India",
    });
    fetchAddresses();
  };

  const handleDeleteAddress = async (id) => {
    await axiosInstance.delete(API.ADDRESS.DELETE(id));
    fetchAddresses();
  };

  if (!user) {
    return (
      <CustomerLayout>
        <div style={{ color: "#000" }}>Please login</div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <div style={pageGrid}>
        {/* SIDEBAR */}
        <div style={sidebar}>
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <div style={avatar}>{user.sub?.charAt(0).toUpperCase()}</div>
            <h3 style={blackText}>{user.sub}</h3>
            <p style={blackText}>{user.user_role}</p>
          </div>

          <button onClick={() => setActiveTab("info")} style={activeTab === "info" ? activeBtn : menuBtn}>
            Personal Info
          </button>
          <button onClick={() => setActiveTab("orders")} style={activeTab === "orders" ? activeBtn : menuBtn}>
            Order History
          </button>
          <button onClick={() => setActiveTab("addresses")} style={activeTab === "addresses" ? activeBtn : menuBtn}>
            Addresses
          </button>
        </div>

        {/* CONTENT */}
        <div style={content}>
          {activeTab === "info" && (
            <>
              <h2 style={blackText}>Personal Information</h2>
              <input style={input} value={user.sub} disabled />
              <input style={input} value={user.user_role} disabled />
            </>
          )}

          {activeTab === "orders" && (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <h2 style={blackText}>Order History</h2>
                <button style={exportBtn} onClick={downloadOrdersExcel}>Download Excel</button>
              </div>

              <div style={orderGrid}>
                {orders.map((order) => (
                  <div key={order.orderId} style={orderCard}>
                    <div style={orderHeader}>
                      <strong style={blackText}>Order #{order.orderId}</strong>
                      <span style={statusBadge}>{order.status}</span>
                    </div>

                    {order.items.map((item, i) => (
                      <div key={i} style={itemRow}>
                        <span style={blackText}>
                          {item.quantity} × {item.productName}
                        </span>
                        <span style={blackText}>₹{item.subTotal}</span>
                      </div>
                    ))}

                    <div style={totalRow}>
                      <span style={blackText}>Total</span>
                      <span style={blackText}>₹{order.totalAmount}</span>
                    </div>

                    <button
                      style={trackBtn}
                      onMouseOver={(e) => (e.target.style.background = "#1e40af")}
                      onMouseOut={(e) => (e.target.style.background = "#2563eb")}
                      onClick={() => navigate(`/track-order/${order.orderId}`)}
                    >
                      Track Order
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}

          {activeTab === "addresses" && (
            <>
              <h2 style={blackText}>Saved Addresses</h2>

              {addresses.map((addr) => (
                <div key={addr.id} style={addressCard}>
                  <div>
                    <p style={blackText}><b>{addr.addressLine}</b></p>
                    <p style={blackText}>
                      {addr.city}, {addr.state} - {addr.pincode}
                    </p>
                  </div>
                  <button style={removeBtn} onClick={() => handleDeleteAddress(addr.id)}>
                    Remove
                  </button>
                </div>
              ))}

              <h3 style={blackText}>Add New Address</h3>

              <form onSubmit={handleAddAddress}>
                <input style={input} placeholder="Address Line" value={newAddr.addressLine}
                  onChange={(e) => setNewAddr({ ...newAddr, addressLine: e.target.value })} required />
                <input style={input} placeholder="City" value={newAddr.city}
                  onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })} required />
                <input style={input} placeholder="State" value={newAddr.state}
                  onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })} required />
                <input style={input} placeholder="Pincode" value={newAddr.pincode}
                  onChange={(e) => setNewAddr({ ...newAddr, pincode: e.target.value })} required />

                <button type="submit" style={primaryBtn}>Save Address</button>
              </form>
            </>
          )}
        </div>
      </div>
    </CustomerLayout>
  );
};

/* ================= STYLES ================= */

const blackText = { color: "#000" };

const pageGrid = { display: "grid", gridTemplateColumns: "240px 1fr", gap: 32 };
const sidebar = { background: "#fff", padding: 16, borderRadius: 12 };
const content = { background: "#fff", padding: 24, borderRadius: 12 };

const avatar = {
  width: 64,
  height: 64,
  background: "#2563eb",
  borderRadius: "50%",
  color: "#fff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const menuBtn = { padding: 10, border: "none", background: "none", cursor: "pointer", color: "#000", textAlign: "left" };
const activeBtn = { ...menuBtn, background: "#e5e7eb", fontWeight: 700 };

const input = {
  width: "100%",
  padding: 10,
  marginBottom: 12,
  border: "1px solid #000",
  borderRadius: 6,
  color: "#000",
  background: "#fff",
};

const orderGrid = { display: "flex", flexWrap: "wrap", gap: 20 };

const orderCard = {
  flex: "1 1 260px",
  border: "1px solid #000",
  padding: 16,
  borderRadius: 10,
  background: "#fff",
};

const orderHeader = { display: "flex", justifyContent: "space-between", marginBottom: 6 };
const itemRow = { display: "flex", justifyContent: "space-between" };
const totalRow = { display: "flex", justifyContent: "space-between", fontWeight: 700, marginTop: 6 };

const statusBadge = {
  background: "#e5e7eb",
  padding: "2px 8px",
  borderRadius: 12,
  color: "#000",
};

const trackBtn = {
  marginTop: 12,
  padding: "10px",
  background: "#2563eb",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
  fontWeight: 600,
};

const addressCard = {
  border: "1px solid #000",
  padding: 16,
  borderRadius: 8,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 12,
};

const removeBtn = {
  background: "#dc2626",
  color: "#fff",
  border: "none",
  padding: "8px 14px",
  cursor: "pointer",
  borderRadius: 6,
};

const primaryBtn = {
  background: "#000",
  color: "#fff",
  padding: "10px 16px",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
  marginTop: 8,
};

const exportBtn = {
  background: "#16a34a",
  color: "#fff",
  padding: "10px 16px",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
  fontWeight: 600,
};

export default ProfilePage;
