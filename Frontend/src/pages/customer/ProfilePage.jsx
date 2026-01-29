import { useState, useEffect } from "react";
import CustomerLayout from "../../components/layout/CustomerLayout";
import axiosInstance from "../../api/axiosInstance";
import { API } from "../../api/endpoints";
import { decodeJwt } from "../../utils/jwt";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("info"); // info, orders, addresses
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [newAddr, setNewAddr] = useState({ addressLine: "", city: "", state: "", pincode: "", country: "India" });
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setUser(decodeJwt(token));
      fetchOrders();
      fetchAddresses();
    }
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axiosInstance.get(API.ORDERS.MY_ORDERS);
      setOrders(res.data);
    } catch (err) {
      console.error("Failed to fetch orders");
    }
  };

  const fetchAddresses = async () => {
    try {
      const res = await axiosInstance.get(API.ADDRESS.GET_ALL);
      setAddresses(res.data);
    } catch (err) {
      console.error("Failed to fetch addresses");
    }
  };

  const handleAddAddress = (e) => {
    e.preventDefault();
    axiosInstance.post(API.ADDRESS.ADD, newAddr)
      .then(() => {
        setNewAddr({ addressLine: "", city: "", state: "", pincode: "", country: "India" });
        fetchAddresses();
      })
      .catch(() => {
        alert("Failed to save address");
      });
  };

  const handleDeleteAddress = (id) => {
    axiosInstance.delete(API.ADDRESS.DELETE(id))
      .then(() => fetchAddresses())
      .catch(() => {
        alert("Failed to remove address");
      });
  };

  if (!user) return <CustomerLayout><div>Please login</div></CustomerLayout>;

  return (
    <CustomerLayout>
      <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: "32px" }}>
        {/* SIDEBAR */}
        <div style={{ background: "#fff", padding: "16px", borderRadius: "12px", height: "fit-content" }}>
          <div style={{ marginBottom: "24px", textAlign: "center" }}>
            <div style={{ width: "64px", height: "64px", background: "#2563eb", borderRadius: "99px", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", margin: "0 auto 12px" }}>
              {user.sub?.charAt(0).toUpperCase()}
            </div>
            <h3 style={{ margin: 0 }}>{user.sub}</h3>
            <p style={{ margin: 0, fontSize: "12px", color: "#64748b" }}>{user.user_role}</p>
          </div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <button onClick={() => setActiveTab("info")} style={activeTab === "info" ? activeBtn : menuBtn}>Personal Info</button>
            <button onClick={() => setActiveTab("orders")} style={activeTab === "orders" ? activeBtn : menuBtn}>Order History</button>
            <button onClick={() => setActiveTab("addresses")} style={activeTab === "addresses" ? activeBtn : menuBtn}>Addresses</button>
          </div>
        </div>

        {/* CONTENT */}
        <div style={{ background: "#fff", padding: "32px", borderRadius: "12px" }}>
          {activeTab === "info" && (
            <div>
              <h2>Personal Information</h2>
              <div style={{ display: "grid", gap: "16px", maxWidth: "400px" }}>
                <div>
                  <label style={labelStyle}>Email</label>
                  <input style={inputStyle} value={user.sub} disabled />
                </div>
                <div>
                  <label style={labelStyle}>Role</label>
                  <input style={inputStyle} value={user.user_role} disabled />
                </div>
                {/* Add more fields if available in user details endpoint */}
              </div>
            </div>
          )}

          {activeTab === "orders" && (
            <div>
              <h2>Order History</h2>
              {orders.length === 0 ? (
                <p style={{ color: "#64748b" }}>No orders found.</p>
              ) : (
                <div style={{ display: "grid", gap: "16px" }}>
                  {orders.map(order => (
                    <div key={order.orderId} style={orderCard}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                        <div>
                          <span style={{ fontWeight: "700" }}>#{order.orderId}</span>
                          <span style={{ marginLeft: "12px", fontSize: "13px", color: "#64748b" }}>
                            {new Date(order.orderDate).toLocaleDateString()}
                          </span>
                        </div>
                        <span style={{ 
                          padding: "2px 8px", borderRadius: "99px", fontSize: "12px", fontWeight: "600",
                          background: order.status === "DELIVERED" ? "#dcfce7" : "#fef3c7",
                          color: order.status === "DELIVERED" ? "#166534" : "#92400e"
                        }}>
                          {order.status}
                        </span>
                      </div>
                      <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: "12px" }}>
                        {order.items.map((item, idx) => (
                          <div key={idx} style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", marginBottom: "4px" }}>
                            <span>{item.quantity} x {item.productName}</span>
                            <span>${item.subTotal.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                      <div style={{ borderTop: "1px solid #f1f5f9", marginTop: "12px", paddingTop: "12px", display: "flex", justifyContent: "space-between", fontWeight: "700" }}>
                        <span>Total</span>
                        <span>${order.totalAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "addresses" && (
            <div>
              <h2>Saved Addresses</h2>
              {addresses.length === 0 ? (
                <p style={{ color: "#64748b" }}>No saved addresses yet.</p>
              ) : (
                <div style={{ display: "grid", gap: "12px", margin: "16px 0" }}>
                  {addresses.map(addr => (
                    <div key={addr.id} style={addressCard}>
                      <div>
                        <p style={addressLine}>{addr.addressLine}</p>
                        <p style={addressMeta}>{addr.city}, {addr.state} - {addr.pincode}</p>
                      </div>
                      <button onClick={() => handleDeleteAddress(addr.id)} style={deleteBtn}>Remove</button>
                    </div>
                  ))}
                </div>
              )}
              <h3>Add New Address</h3>
              <form onSubmit={handleAddAddress} style={{ display: "grid", gap: "12px", maxWidth: "400px" }}>
                <input
                  style={inputStyle}
                  placeholder="Address Line"
                  value={newAddr.addressLine}
                  onChange={e => setNewAddr({ ...newAddr, addressLine: e.target.value })}
                  required
                />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <input
                    style={inputStyle}
                    placeholder="City"
                    value={newAddr.city}
                    onChange={e => setNewAddr({ ...newAddr, city: e.target.value })}
                    required
                  />
                  <input
                    style={inputStyle}
                    placeholder="State"
                    value={newAddr.state}
                    onChange={e => setNewAddr({ ...newAddr, state: e.target.value })}
                    required
                  />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <input
                    style={inputStyle}
                    placeholder="Pincode"
                    value={newAddr.pincode}
                    onChange={e => setNewAddr({ ...newAddr, pincode: e.target.value })}
                    required
                  />
                  <input
                    style={inputStyle}
                    placeholder="Country"
                    value={newAddr.country}
                    disabled
                  />
                </div>
                <button type="submit" style={addressBtn}>Save Address</button>
              </form>
            </div>
          )}
        </div>
      </div>
    </CustomerLayout>
  );
};

const menuBtn = { padding: "10px", textAlign: "left", background: "none", border: "none", borderRadius: "6px", cursor: "pointer", color: "#64748b", fontWeight: "500" };
const activeBtn = { ...menuBtn, background: "#eff6ff", color: "#2563eb", fontWeight: "700" };
const labelStyle = { display: "block", fontSize: "13px", color: "#64748b", marginBottom: "4px" };
const inputStyle = { width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #e2e8f0", background: "#f8fafc" };
const orderCard = { border: "1px solid #e2e8f0", borderRadius: "8px", padding: "16px" };
const addressCard = { border: "1px solid #e2e8f0", borderRadius: "8px", padding: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" };
const addressLine = { margin: 0, fontWeight: "600" };
const addressMeta = { margin: 0, fontSize: "14px", color: "#64748b" };
const deleteBtn = { padding: "6px 10px", borderRadius: "6px", border: "none", background: "#fee2e2", color: "#b91c1c", cursor: "pointer", fontSize: "12px" };
const addressBtn = { marginTop: "8px", padding: "10px 16px", borderRadius: "8px", border: "none", background: "#2563eb", color: "#fff", fontWeight: "600", cursor: "pointer", fontSize: "14px" };

export default ProfilePage;
