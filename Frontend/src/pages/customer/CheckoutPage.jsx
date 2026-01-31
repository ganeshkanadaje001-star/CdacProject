import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CustomerLayout from "../../components/layout/CustomerLayout";
import axiosInstance from "../../api/axiosInstance";
import { API } from "../../api/endpoints";

const CheckoutPage = () => {
  const [step, setStep] = useState(1);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddr, setSelectedAddr] = useState(null);
  const [newAddr, setNewAddr] = useState({
    addressLine: "",
    city: "",
    state: "",
    pincode: "",
    country: "India"
  });
  const [loading, setLoading] = useState(false);
  const [cartTotal, setCartTotal] = useState(0);
  const [orderInfo, setOrderInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance.get(API.CART.GET).then(res => {
      if (!res.data.cartItems?.length) navigate("/cart");
      setCartTotal(res.data.totalAmount);
    });

    axiosInstance.get(API.ADDRESS.GET_ALL).then(res => {
      setAddresses(res.data || []);
      if (res.data?.length) setSelectedAddr(res.data[0].id);
    });
  }, []);

  const loadRazorpayScript = () => new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post(API.ADDRESS.ADD, newAddr);
      setAddresses(prev => [...prev, res.data]);
      setSelectedAddr(res.data.id);
      setNewAddr({ addressLine: "", city: "", state: "", pincode: "", country: "India" });
    } catch {
      alert("Failed to save address");
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddr) return alert("Please select address");
    setLoading(true);
    try {
      const orderRes = await axiosInstance.post(API.ORDERS.PLACE, { addressId: selectedAddr });
      const { orderId, totalAmount } = orderRes.data;

      const payRes = await axiosInstance.post(API.PAYMENTS.CREATE, { orderId, amount: totalAmount });
      const { razorpayOrderId, amount, currency } = payRes.data;

      const loaded = await loadRazorpayScript();
      if (!loaded || !window.Razorpay) throw new Error("Razorpay SDK not loaded");

      const key = import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_SATMpZTlmHmY8v";
      const options = {
        key,
        amount,
        currency,
        name: "FreshBasket",
        description: `Order #${orderId}`,
        order_id: razorpayOrderId,
        handler: async function (response) {
          try {
            await axiosInstance.post(API.PAYMENTS.VERIFY, {
              razorpayOrderId,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
            setOrderInfo(orderRes.data);
            setStep(3);
            window.dispatchEvent(new Event("cart:updated"));
          } catch (_err) {
            alert("Payment verification failed");
          }
        },
        theme: { color: "#16a34a" },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (_err) {
      alert("Order failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= SUCCESS ================= */
  if (step === 3 && orderInfo) {
    return (
      <CustomerLayout>
        <div style={container}>
          <div style={card}>
            <div style={successIcon}>✔</div>
            <h2 style={{ marginBottom: 8 }}>Order Placed Successfully</h2>
            <p style={{ color: "#475569" }}>Thank you for shopping with us</p>

            <div style={summaryBox}>
              <p><b>Order ID:</b> {orderInfo.orderId}</p>
              <p><b>Total Paid:</b> ₹{orderInfo.totalAmount}</p>
            </div>

            <button style={primaryBtn} onClick={() => navigate("/")}>
              Continue Shopping
            </button>
          </div>
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <div style={container}>
        <div style={card}>
          <h1 style={{ textAlign: "center" }}>Checkout</h1>

          {/* STEPS */}
          <div style={stepper}>
            <span style={step === 1 ? activeStep : inactiveStep}>① Address</span>
            <span style={step === 2 ? activeStep : inactiveStep}>② Payment</span>
          </div>

          {/* ADDRESS */}
          {step === 1 && (
            <>
              <h3>Select Delivery Address</h3>

              {addresses.length === 0 && (
                <p style={{ color: "#64748b" }}>No saved addresses</p>
              )}

              {addresses.map(addr => (
                <div
                  key={addr.id}
                  onClick={() => setSelectedAddr(addr.id)}
                  style={{
                    ...addrCard,
                    borderColor: selectedAddr === addr.id ? "#2563eb" : "#cbd5e1",
                    background: selectedAddr === addr.id ? "#eff6ff" : "#fff"
                  }}
                >
                  <input type="radio" checked={selectedAddr === addr.id} readOnly />
                  <div>
                    <div style={{ fontWeight: 600, color: "#0f172a" }}>
                      {addr.addressLine}
                    </div>
                    <div style={{ color: "#475569", fontSize: 14 }}>
                      {addr.city}, {addr.state} - {addr.pincode}
                    </div>
                  </div>
                </div>
              ))}

              <h4 style={{ marginTop: 20 }}>Add New Address</h4>
              <form onSubmit={handleAddAddress}>
                <input style={input} placeholder="Address Line"
                  value={newAddr.addressLine}
                  onChange={e => setNewAddr({ ...newAddr, addressLine: e.target.value })} required />

                <div style={row}>
                  <input style={input} placeholder="City"
                    value={newAddr.city}
                    onChange={e => setNewAddr({ ...newAddr, city: e.target.value })} required />
                  <input style={input} placeholder="State"
                    value={newAddr.state}
                    onChange={e => setNewAddr({ ...newAddr, state: e.target.value })} required />
                </div>

                <div style={row}>
                  <input style={input} placeholder="Pincode"
                    value={newAddr.pincode}
                    onChange={e => setNewAddr({ ...newAddr, pincode: e.target.value })} required />
                  <input style={input} value="India" disabled />
                </div>

                <button style={secondaryBtn}>Save Address</button>
              </form>

              <button style={primaryBtn} onClick={() => setStep(2)}>
                Proceed to Payment
              </button>
            </>
          )}

          {/* PAYMENT */}
          {step === 2 && (
            <>
              <h3>Payment Method</h3>

              <div style={paymentBox}>
                🪙 Razorpay (UPI/Card/NetBanking)
              </div>

              <div style={totalRow}>
                <span>Total Payable</span>
                <b>₹{cartTotal}</b>
              </div>

              <button style={primaryBtn} disabled={loading} onClick={handlePlaceOrder}>
                {loading ? "Processing..." : "Pay & Place Order"}
              </button>

              <button style={backBtn} onClick={() => setStep(1)}>
                Back
              </button>
            </>
          )}
        </div>
      </div>
    </CustomerLayout>
  );
};

/* ================= STYLES ================= */

const container = {
  maxWidth: "520px",
  margin: "40px auto",
  padding: "0 16px"
};

const card = {
  background: "#fff",
  padding: 28,
  borderRadius: 14,
  boxShadow: "0 10px 25px rgba(0,0,0,0.12)"
};

const stepper = {
  display: "flex",
  justifyContent: "center",
  gap: 24,
  marginBottom: 20
};

const activeStep = { fontWeight: 700, color: "#2563eb" };
const inactiveStep = { color: "#94a3b8" };

const addrCard = {
  display: "flex",
  gap: 12,
  padding: 14,
  border: "2px solid",
  borderRadius: 10,
  cursor: "pointer",
  marginBottom: 12
};

const input = {
  width: "100%",
  padding: 10,
  marginBottom: 10,
  borderRadius: 6,
  border: "1px solid #cbd5e1"
};

const row = { display: "flex", gap: 10 };

const primaryBtn = {
  width: "100%",
  padding: 12,
  background: "#16a34a",
  color: "#fff",
  border: "none",
  borderRadius: 8,
  fontWeight: 700,
  cursor: "pointer",
  marginTop: 12
};

const secondaryBtn = {
  width: "100%",
  padding: 10,
  background: "#334155",
  color: "#fff",
  border: "none",
  borderRadius: 8,
  marginBottom: 10
};

const backBtn = {
  ...secondaryBtn,
  background: "#94a3b8"
};

const paymentBox = {
  padding: 16,
  border: "1px solid #2563eb",
  borderRadius: 8,
  background: "#eff6ff",
  color: "#1e3a8a",
  marginBottom: 16
};

const totalRow = {
  display: "flex",
  justifyContent: "space-between",
  fontSize: 18,
  marginBottom: 16
};

const summaryBox = {
  background: "#f8fafc",
  padding: 16,
  borderRadius: 8,
  margin: "16px 0"
};

const successIcon = {
  width: 56,
  height: 56,
  borderRadius: "50%",
  background: "#16a34a",
  color: "#fff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 28,
  margin: "0 auto 16px"
};

export default CheckoutPage;
