import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CustomerLayout from "../../components/layout/CustomerLayout";
import axiosInstance from "../../api/axiosInstance";
import { API } from "../../api/endpoints";
import { getImageUrl } from "../../utils/image";

const CartPage = () => {
  const [cart, setCart] = useState(null);
  const [productInfo, setProductInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await axiosInstance.get(API.CART.GET);
      setCart(res.data);
      const items = Array.isArray(res.data?.cartItems) ? res.data.cartItems : [];
      await loadProductInfo(items);
    } catch (err) {
      console.error("Failed to fetch cart");
    } finally {
      setLoading(false);
    }
  };

  const loadProductInfo = async (items) => {
    const ids = Array.from(new Set(items.map(i => i.productId).filter(Boolean)));
    if (!ids.length) {
      setProductInfo({});
      return;
    }
    try {
      const results = await Promise.all(
        ids.map(id =>
          axiosInstance.get(API.PRODUCTS.GET_BY_ID(id))
            .then(r => ({ id, data: r.data }))
            .catch(() => ({ id, data: null }))
        )
      );
      const map = {};
      results.forEach(({ id, data }) => {
        if (data) map[id] = data;
      });
      setProductInfo(map);
    } catch (_e) {
      setProductInfo({});
    }
  };

  const updateQty = async (productId, newQty) => {
    if (newQty < 1) return;
    try {
      await axiosInstance.put(API.CART.UPDATE, { productId, quantity: newQty });
      fetchCart();
      window.dispatchEvent(new Event("cart:updated"));
    } catch (err) {
      alert("Failed to update quantity");
    }
  };

  const removeItem = async (productId) => {
    if (!window.confirm("Remove item?")) return;
    try {
      await axiosInstance.delete(API.CART.REMOVE(productId));
      fetchCart();
      window.dispatchEvent(new Event("cart:updated"));
    } catch (err) {
      alert("Failed to remove item");
    }
  };

  if (loading) return <CustomerLayout><div>Loading cart...</div></CustomerLayout>;

  if (!cart || !cart.cartItems || cart.cartItems.length === 0) {
    return (
      <CustomerLayout>
        <div style={{ textAlign: "center", padding: "60px" }}>
          <h2>Your cart is empty</h2>
          <button onClick={() => navigate("/")} style={btnStyle}>Continue Shopping</button>
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <h1>Shopping Cart</h1>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "24px", marginTop: "24px" }}>
        {/* ITEMS */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {cart.cartItems.map((item, idx) => (
            <div key={item.cartItemId ?? item.productId ?? idx} style={itemStyle}>
              <img src={getImageUrl(productInfo[item.productId]?.imageUrl)} alt={(productInfo[item.productId]?.name) || `Product #${item.productId}`} style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "8px" }} />
              <div style={{ flex: 1, padding: "0 16px" }}>
                <h3 style={{ margin: "0 0 4px", fontSize: "16px" }}>{(productInfo[item.productId]?.name) || `Product #${item.productId}`}</h3>
                <p style={{ margin: 0, color: "#64748b" }}>${(item.totalPrice / item.quantity).toFixed(2)} each</p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ display: "flex", alignItems: "center", border: "1px solid #cbd5e1", borderRadius: "6px" }}>
                  <button onClick={() => updateQty(item.productId, item.quantity - 1)} style={qtyBtn}>-</button>
                  <span style={{ padding: "0 10px", fontSize: "14px" }}>{item.quantity}</span>
                  <button onClick={() => updateQty(item.productId, item.quantity + 1)} style={qtyBtn}>+</button>
                </div>
                <p style={{ fontWeight: "700", minWidth: "60px", textAlign: "right" }}>${item.totalPrice.toFixed(2)}</p>
                <button onClick={() => removeItem(item.productId)} style={{ color: "#ef4444", background: "none", border: "none", cursor: "pointer" }}>✕</button>
              </div>
            </div>
          ))}
        </div>

        {/* SUMMARY */}
        <div style={{ background: "#fff", padding: "24px", borderRadius: "12px", height: "fit-content" }}>
          <h2 style={{ marginTop: 0 }}>Order Summary</h2>
          <div style={{ display: "flex", justifyContent: "space-between", margin: "16px 0", fontSize: "18px", fontWeight: "700" }}>
            <span>Total</span>
            <span>${cart.totalAmount.toFixed(2)}</span>
          </div>
          <button onClick={() => navigate("/checkout")} style={{ ...btnStyle, width: "100%" }}>Proceed to Checkout</button>
        </div>
      </div>
    </CustomerLayout>
  );
};

const itemStyle = { background: "#fff", padding: "16px", borderRadius: "12px", display: "flex", alignItems: "center" };
const qtyBtn = { padding: "4px 8px", background: "none", border: "none", cursor: "pointer" };
const btnStyle = { padding: "12px 24px", background: "#16a34a", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer", fontSize: "16px" };

export default CartPage;
