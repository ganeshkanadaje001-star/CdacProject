import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CustomerLayout from "../../components/layout/CustomerLayout";
import axiosInstance from "../../api/axiosInstance";
import { API } from "../../api/endpoints";

const CheckoutPage = () => {
  const [step, setStep] = useState(1); // 1: Address, 2: Payment, 3: Success
  const [addresses, setAddresses] = useState([]);
  const [selectedAddr, setSelectedAddr] = useState(null);
  const [newAddr, setNewAddr] = useState({ addressLine: "", city: "", state: "", pincode: "", country: "India" });
  const [loading, setLoading] = useState(false);
  const [cartTotal, setCartTotal] = useState(0);
  const [orderInfo, setOrderInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check cart not empty
    axiosInstance.get(API.CART.GET).then(res => {
      if (!res.data.cartItems?.length) navigate("/cart");
      setCartTotal(res.data.totalAmount);
    });
    axiosInstance.get(API.ADDRESS.GET_ALL)
      .then(res => {
        setAddresses(res.data);
        if (Array.isArray(res.data) && res.data.length > 0) {
          setSelectedAddr(res.data[0].id);
        }
      })
      .catch(() => {
        setAddresses([]);
      });
  }, []);

  const handleAddAddress = (e) => {
    e.preventDefault();
    axiosInstance.post(API.ADDRESS.ADD, newAddr)
      .then(res => {
        const created = res.data;
        const next = [...addresses, created];
        setAddresses(next);
        setSelectedAddr(created.id);
        setNewAddr({ addressLine: "", city: "", state: "", pincode: "", country: "India" });
      })
      .catch(() => {
        alert("Failed to save address");
      });
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddr) return alert("Select an address");
    setLoading(true);
    try {
      const res = await axiosInstance.post(API.ORDERS.PLACE, { addressId: selectedAddr });
      setOrderInfo({
        orderId: res.data.orderId,
        total: res.data.totalAmount,
        address: addresses.find(a => a.id === selectedAddr)
      });
      setStep(3);
    } catch (err) {
      if (err.response?.status === 401) {
        navigate("/login");
        return;
      }
      alert("Order failed");
    } finally {
      setLoading(false);
    }
  };

  if (step === 3 && orderInfo) {
    return (
      <CustomerLayout>
        <div style={{ textAlign: "center", padding: "40px", background: "#fff", borderRadius: "12px", maxWidth: "600px", margin: "0 auto" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>🎉</div>
          <h1 style={{ color: "#16a34a" }}>Order Confirmed!</h1>
          <p style={{ fontSize: "18px", color: "#334155" }}>Thank you for your purchase.</p>
          
          <div style={{ textAlign: "left", background: "#f8fafc", padding: "24px", borderRadius: "8px", margin: "24px 0" }}>
            <p><strong>Order ID:</strong> {orderInfo.orderId}</p>
            <p><strong>Total Amount:</strong> ${orderInfo.total.toFixed(2)}</p>
            <p><strong>Delivery To:</strong></p>
            <p style={{ color: "#64748b" }}>
              {orderInfo.address.addressLine}, {orderInfo.address.city}, {orderInfo.address.state} - {orderInfo.address.pincode}
            </p>
          </div>
          
          <button onClick={() => navigate("/")} style={btnStyle}>Continue Shopping</button>
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <h1 style={{ marginBottom: "24px" }}>Checkout</h1>
        
        {/* STEPS */}
        <div style={{ display: "flex", gap: "16px", marginBottom: "32px" }}>
          <div style={{ ...stepStyle, opacity: step === 1 ? 1 : 0.5 }}>1. Address</div>
          <div style={{ ...stepStyle, opacity: step === 2 ? 1 : 0.5 }}>2. Payment</div>
        </div>

        {step === 1 && (
          <div style={cardStyle}>
            <h2>Select Delivery Address</h2>
            
            {addresses.length > 0 ? (
              <div style={{ display: "grid", gap: "12px", margin: "16px 0" }}>
                {addresses.map(addr => (
                  <label key={addr.id} style={{ ...addrCard, borderColor: selectedAddr === addr.id ? "#2563eb" : "#e2e8f0" }}>
                    <input 
                      type="radio" 
                      name="address" 
                      checked={selectedAddr === addr.id} 
                      onChange={() => setSelectedAddr(addr.id)}
                    />
                    <div>
                      <p style={{ margin: 0, fontWeight: "600" }}>{addr.addressLine}</p>
                      <p style={{ margin: 0, fontSize: "14px", color: "#64748b" }}>{addr.city}, {addr.state} - {addr.pincode}</p>
                    </div>
                  </label>
                ))}
              </div>
            ) : (
              <p style={{ color: "#64748b" }}>No saved addresses.</p>
            )}

            <h3>Add New Address</h3>
            <form onSubmit={handleAddAddress} style={{ display: "grid", gap: "12px" }}>
              <input style={inputStyle} placeholder="Address Line" value={newAddr.addressLine} onChange={e => setNewAddr({...newAddr, addressLine: e.target.value})} required />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <input style={inputStyle} placeholder="City" value={newAddr.city} onChange={e => setNewAddr({...newAddr, city: e.target.value})} required />
                <input style={inputStyle} placeholder="State" value={newAddr.state} onChange={e => setNewAddr({...newAddr, state: e.target.value})} required />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <input style={inputStyle} placeholder="Pincode" value={newAddr.pincode} onChange={e => setNewAddr({...newAddr, pincode: e.target.value})} required />
                <input style={inputStyle} placeholder="Country" value={newAddr.country} disabled />
              </div>
              <button type="submit" style={{ ...btnStyle, background: "#334155" }}>Save & Use Address</button>
            </form>

            {selectedAddr && (
              <button onClick={() => setStep(2)} style={{ ...btnStyle, marginTop: "24px", width: "100%" }}>Proceed to Payment</button>
            )}
          </div>
        )}

        {step === 2 && (
          <div style={cardStyle}>
            <h2>Payment Method</h2>
            <div style={{ padding: "16px", border: "1px solid #2563eb", borderRadius: "8px", background: "#eff6ff", color: "#1e40af", fontWeight: "600" }}>
              Credit / Debit Card (Simulated)
            </div>
            
            <div style={{ marginTop: "24px", borderTop: "1px solid #e2e8f0", paddingTop: "16px" }}>
               <div style={{ display: "flex", justifyContent: "space-between", fontSize: "18px", fontWeight: "700", marginBottom: "16px" }}>
                <span>Total to Pay</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <button onClick={handlePlaceOrder} disabled={loading} style={{ ...btnStyle, width: "100%" }}>
                {loading ? "Processing..." : "Pay & Place Order"}
              </button>
              <button onClick={() => setStep(1)} style={{ ...btnStyle, background: "#94a3b8", width: "100%", marginTop: "12px" }}>Back</button>
            </div>
          </div>
        )}

      </div>
    </CustomerLayout>
  );
};

const cardStyle = { background: "#fff", padding: "24px", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" };
const stepStyle = { fontSize: "18px", fontWeight: "700", color: "#0f172a" };
const addrCard = { display: "flex", gap: "12px", padding: "12px", border: "2px solid", borderRadius: "8px", cursor: "pointer" };
const inputStyle = { padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1", width: "100%", boxSizing: "border-box" };
const btnStyle = { padding: "12px 24px", background: "#16a34a", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer", fontSize: "16px" };

export default CheckoutPage;
