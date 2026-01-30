import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomerLayout from "../../components/layout/CustomerLayout";
import axiosInstance from "../../api/axiosInstance";
import { API } from "../../api/endpoints";
import { getImageUrl } from "../../utils/image";

const CartPage = () => {
  const [cart, setCart] = useState(null);
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadCart();
  }, []);

  /* ---------------- LOAD CART ---------------- */

  const loadCart = async () => {
    try {
      const res = await axiosInstance.get(API.CART.GET);
      const cartData = res.data;
      setCart(cartData);

      const productIds = (cartData.cartItems || [])
        .map(item => item.productId)
        .filter(Boolean);

      if (productIds.length) {
        await loadProducts(productIds);
      }
    } catch (err) {
      console.error("Failed to load cart", err);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- LOAD PRODUCTS ---------------- */

  const loadProducts = async (ids) => {
    const uniqueIds = [...new Set(ids)];

    const responses = await Promise.all(
      uniqueIds.map(id =>
        axiosInstance.get(API.PRODUCTS.GET_BY_ID(id))
          .then(res => [id, res.data])
      )
    );

    const map = {};
    responses.forEach(([id, product]) => {
      map[id] = product;
    });

    setProducts(map);
  };

  /* ---------------- UPDATE QUANTITY ---------------- */

  const updateQty = async (productId, newQty) => {
    if (newQty < 1) return;

    try {
      setUpdatingId(productId);
      await axiosInstance.put(API.CART.UPDATE, {
        productId,
        quantity: newQty
      });
      await loadCart();
      window.dispatchEvent(new Event("cart:updated"));
    } catch {
      alert("Failed to update quantity");
    } finally {
      setUpdatingId(null);
    }
  };

  /* ---------------- REMOVE ITEM ---------------- */

  const removeItem = async (productId) => {
    if (!window.confirm("Remove this item from cart?")) return;

    try {
      setUpdatingId(productId);
      await axiosInstance.delete(API.CART.REMOVE(productId));
      await loadCart();
      window.dispatchEvent(new Event("cart:updated"));
    } catch {
      alert("Failed to remove item");
    } finally {
      setUpdatingId(null);
    }
  };

  /* ---------------- UI STATES ---------------- */

  if (loading) {
    return (
      <CustomerLayout>
        <div style={{ padding: 60, textAlign: "center" }}>
          Loading cart…
        </div>
      </CustomerLayout>
    );
  }

  if (!cart?.cartItems?.length) {
    return (
      <CustomerLayout>
        <div style={{ padding: 60, textAlign: "center" }}>
          <h2>Your cart is empty 🛒</h2>
          <button className="checkout-btn" onClick={() => navigate("/")}>
            Continue Shopping
          </button>
        </div>

      </CustomerLayout>
    );
  }

  /* ---------------- RENDER ---------------- */

  return (
    <CustomerLayout>
      <style>{`
        .cart-item {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 20px;
          margin-bottom: 16px;
          background: #fff;
          border-radius: 14px;
          box-shadow: 0 6px 18px rgba(0,0,0,0.06);
          transition: transform .2s ease, box-shadow .2s ease, opacity .2s ease;
        }

        .cart-item:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 28px rgba(0,0,0,0.12);
        }

        .cart-item.loading {
          opacity: 0.6;
          pointer-events: none;
        }
          .cart-container {
  max-width: 1100px;
  margin: auto;
  padding: 20px;
  width: 100%;
}


        .product-img {
          width: 90px;
          height: 90px;
          object-fit: cover;
          border-radius: 10px;
          background: #f8fafc;
        }

        .product-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .product-name {
          font-size: 16px;
          font-weight: 600;
          color: #0f172a;
        }

        .qty-box {
          display: inline-flex;
          align-items: center;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          overflow: hidden;
        }

        .qty-box button {
          width: 36px;
          height: 36px;
          background: #f8fafc;
          border: none;
          font-size: 18px;
          cursor: pointer;
        }

        .qty-box button:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .qty-box span {
          width: 40px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 15px;
          color: #0f172a;
          background: #fff;
        }

        .price-box {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 6px;
          min-width: 110px;
        }

        .unit-price {
          font-size: 13px;
          color: #64748b;
        }

        .total-price {
          font-size: 16px;
          font-weight: 700;
        }

        .remove-btn {
          background: none;
          border: none;
          color: #ef4444;
          font-size: 18px;
          cursor: pointer;
          margin-left: 10px;
        }

        /* ---------- SUMMARY ---------- */

        .summary {
  margin-top: 32px;
  padding: 24px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.08);
  max-width: 420px;
  margin-left: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.grand-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #f8fafc;
  border-radius: 12px;
  font-size: 22px;
  font-weight: 800;
  color: #0f172a;
}


        .checkout-btn {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg,#22c55e,#16a34a);
          color: #fff;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
        }
      `}</style>
     <div className="cart-container">
      <h1>🛒 Shopping Cart</h1>

      {/* PRODUCTS – VERTICAL */}
      {cart.cartItems.map((item, index) => {
        const product = products[item.productId];
        if (!product) return null;

        const unitPrice = item.totalPrice / item.quantity;

        return (
          <div
            key={index}
            className={`cart-item ${updatingId === item.productId ? "loading" : ""}`}
          >
            <img
              src={getImageUrl(product.imageUrl)}
              alt={product.name}
              className="product-img"
            />

            <div className="product-info">
              <div className="product-name">{product.name}</div>

              <div className="qty-box">
                <button
                  disabled={item.quantity === 1 || updatingId === item.productId}
                  onClick={() => updateQty(item.productId, item.quantity - 1)}
                >
                  −
                </button>

                <span>{item.quantity}</span>

                <button
                  disabled={updatingId === item.productId}
                  onClick={() => updateQty(item.productId, item.quantity + 1)}
                >
                  +
                </button>
              </div>
            </div>

            <div className="price-box">
              <div className="unit-price">₹{unitPrice.toFixed(2)} / item</div>
              <div className="total-price">₹{item.totalPrice}</div>
            </div>
               
            <button
              className="remove-btn"
              title="Remove item"
              onClick={() => removeItem(item.productId)}
            >
              ❌
            </button>
          </div>
        );
      })}
{/* SUMMARY */}
<div className="summary">
  <div className="grand-total">
    <span>Grand Total</span>
    <span>₹{cart.totalAmount}</span>
  </div>

  <button
    className="checkout-btn"
    onClick={() => navigate("/checkout")}
  >
    Proceed to Checkout
  </button>
</div>
</div>
    </CustomerLayout>
  );
};

export default CartPage;
