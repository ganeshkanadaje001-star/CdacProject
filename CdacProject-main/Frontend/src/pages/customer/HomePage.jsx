import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import CustomerLayout from "../../components/layout/CustomerLayout";
import axiosInstance from "../../api/axiosInstance";
import { API } from "../../api/endpoints";
import { getImageUrl } from "../../utils/image";

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const searchQuery = searchParams.get("search") || "";
  const catQuery = searchParams.get("cat") || "";

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axiosInstance.get(API.PRODUCTS.GET_ALL);
      setProducts(res.data);
    } catch (err) {
      console.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (e, product) => {
    e.stopPropagation();
    try {
      await axiosInstance.post(API.CART.ADD, { productId: product.id, quantity: 1 });
      alert("Added to cart!");
      window.dispatchEvent(new Event("cart:updated"));
    } catch (err) {
      if (err.response?.status === 401) {
        navigate("/login");
      } else {
        alert("Failed to add to cart");
      }
    }
  };

  const handleBuyNow = async (e, product) => {
    e.stopPropagation();
    try {
      await axiosInstance.post(API.CART.ADD, { productId: product.id, quantity: 1 });
      navigate("/checkout");
    } catch (err) {
      if (err.response?.status === 401) {
        navigate("/login");
      } else {
        alert("Failed to start checkout");
      }
    }
  };

  const filteredProducts = products.filter(p => {
    // 1. Must be active (treat null as active)
    const isActive = p.isActive ?? true;
    if (!isActive) return false;
    // 2. Search query
    if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    // 3. Category filter (by categoryId)
    if (catQuery) {
      const catId = Number(catQuery);
      if (Number.isFinite(catId) && p.categoryId !== catId) return false;
    }
    return true;
  });

  return (
    <CustomerLayout>
      {loading ? (
        <div style={{ textAlign: "center", padding: "40px" }}>Loading products...</div>
      ) : (
        <>
          {filteredProducts.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px", color: "#64748b" }}>
              <h2>No products found</h2>
              <p>Try adjusting your search or category filter.</p>
            </div>
          ) : (
            <div style={gridStyle}>
              {filteredProducts.map(p => (
                <div 
                  key={p.id} 
                  style={cardStyle}
                  onClick={() => navigate(`/product/${p.id}`)}
                >
                  <div style={imgContainer}>
                    <img src={getImageUrl(p.imageUrl)} alt={p.name} style={imgStyle} />
                  </div>
                  <div style={contentStyle}>
                    <h3 style={titleStyle}>{p.name}</h3>
                    <p style={priceStyle}>${p.price.toFixed(2)}</p>
                    <p style={{ fontSize: "12px", color: p.stock > 0 ? "green" : "red", marginBottom: "12px" }}>
                      {p.stock > 0 ? "In Stock" : "Out of Stock"}
                    </p>
                    {p.stock > 0 ? (
                      <div style={btnRowStyle}>
                        <button
                          style={{ 
                            ...btnStyle, 
                            background: "#16a34a" 
                          }}
                          onClick={(e) => handleBuyNow(e, p)}
                        >
                          Buy
                        </button>
                        <button
                          style={{ 
                            ...btnStyle, 
                            background: "#2563eb" 
                          }}
                          onClick={(e) => handleAddToCart(e, p)}
                        >
                          Add to Cart
                        </button>
                      </div>
                    ) : (
                      <div style={btnRowStyle}>
                        <button
                          style={{ 
                            ...btnStyle, 
                            background: "#cbd5e1", 
                            cursor: "not-allowed" 
                          }}
                          disabled
                        >
                          Out of Stock
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </CustomerLayout>
  );
};

// --- STYLES ---
const gridStyle = { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "24px" };
const cardStyle = { background: "#fff", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", overflow: "hidden", cursor: "pointer", transition: "transform 0.2s", display: "flex", flexDirection: "column", border: "1px solid #e2e8f0" };
const imgContainer = { width: "100%", height: "180px", background: "#f8fafc", display: "flex", justifyContent: "center", alignItems: "center", overflow: "hidden" };
const imgStyle = { width: "100%", height: "100%", objectFit: "cover" };
const contentStyle = { padding: "16px", flex: 1, display: "flex", flexDirection: "column" };
const titleStyle = { margin: "0 0 8px", fontSize: "16px", color: "#0f172a", fontWeight: "600" };
const priceStyle = { margin: "0 0 8px", fontSize: "18px", color: "#2563eb", fontWeight: "700" };
const btnRowStyle = { display: "flex", gap: "8px", marginTop: "auto" };
const btnStyle = { flex: 1, padding: "10px", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "600" };

export default HomePage;
