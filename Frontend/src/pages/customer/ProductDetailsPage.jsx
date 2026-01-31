import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CustomerLayout from "../../components/layout/CustomerLayout";
import axiosInstance from "../../api/axiosInstance";
import { API } from "../../api/endpoints";
import { getImageUrl } from "../../utils/image";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axiosInstance.get(API.PRODUCTS.GET_BY_ID(id));
        setProduct(res.data);
      } catch (err) {
        console.error("Failed to fetch product");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    try {
      await axiosInstance.post(API.CART.ADD, { productId: product.id, quantity: qty });
      window.dispatchEvent(new Event("cart:updated"));
      alert("Added to cart");
    } catch (err) {
      if (err.response?.status === 401) navigate("/login");
      else alert("Failed to add to cart");
    }
  };

  if (loading) return <CustomerLayout><div>Loading...</div></CustomerLayout>;
  if (!product) return <CustomerLayout><div>Product not found</div></CustomerLayout>;

  return (
    <CustomerLayout>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px", background: "#fff", padding: "32px", borderRadius: "16px" }}>
        {/* IMAGE */}
        <div style={{ height: "400px", background: "#f8fafc", borderRadius: "12px", overflow: "hidden" }}>
          <img src={getImageUrl(product.imageUrl)} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
        </div>

        {/* DETAILS */}
        <div>
          <h1 style={{ fontSize: "32px", color: "#0f172a", marginBottom: "16px" }}>{product.name}</h1>
          <p style={{ fontSize: "24px", color: "#2563eb", fontWeight: "700", marginBottom: "24px" }}>${product.price.toFixed(2)}</p>
          
          <div style={{ marginBottom: "24px" }}>
            <span style={{ 
              background: product.stock > 0 ? "#dcfce7" : "#fee2e2", 
              color: product.stock > 0 ? "#166534" : "#b91c1c",
              padding: "6px 12px", borderRadius: "99px", fontWeight: "600", fontSize: "14px"
            }}>
              {product.stock > 0 ? `${product.stock} In Stock` : "Out of Stock"}
            </span>
          </div>

          <p style={{ color: "#475569", lineHeight: "1.6", marginBottom: "32px" }}>
            {product.description}
          </p>

          {product.stock > 0 && (
            <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", border: "1px solid #cbd5e1", borderRadius: "8px" }}>
                <button onClick={() => setQty(Math.max(1, qty - 1))} style={qtyBtn}>-</button>
                <span style={{ padding: "0 16px", fontWeight: "600" }}>{qty}</span>
                <button onClick={() => setQty(Math.min(product.stock, qty + 1))} style={qtyBtn}>+</button>
              </div>
              <button onClick={handleAddToCart} style={addBtn}>
                Add to Cart
              </button>
            </div>
          )}
        </div>
      </div>
    </CustomerLayout>
  );
};

const qtyBtn = { padding: "10px 16px", background: "none", border: "none", cursor: "pointer", fontSize: "18px", color: "#334155" };
const addBtn = { padding: "12px 32px", background: "#16a34a", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "700", fontSize: "16px", cursor: "pointer" };

export default ProductDetailsPage;
