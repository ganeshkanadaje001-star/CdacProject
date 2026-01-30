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
    } catch {
      console.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (e, product) => {
    e.stopPropagation();
    try {
      await axiosInstance.post(API.CART.ADD, {
        productId: product.id,
        quantity: 1
      });
      alert("Added to cart!");
      window.dispatchEvent(new Event("cart:updated"));
    } catch (err) {
      if (err.response?.status === 401) navigate("/login");
      else alert("Failed to add to cart");
    }
  };

  const handleBuyNow = async (e, product) => {
    e.stopPropagation();
    try {
      await axiosInstance.post(API.CART.ADD, {
        productId: product.id,
        quantity: 1
      });
      navigate("/checkout");
    } catch (err) {
      if (err.response?.status === 401) navigate("/login");
      else alert("Failed to start checkout");
    }
  };

  const filteredProducts = products.filter(p => {
    if (!(p.isActive ?? true)) return false;
    if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase()))
      return false;
    if (catQuery && Number(p.categoryId) !== Number(catQuery)) return false;
    return true;
  });

  return (
    <CustomerLayout>
      {/* INLINE CSS */}
      <style>{`
        .horizontal-list {
          display: flex;
          gap: 20px;
          overflow-x: auto;
          padding-bottom: 10px;
        }

        .horizontal-list::-webkit-scrollbar {
          height: 8px;
        }

        .horizontal-list::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }

        .product-card {
          min-width: 260px;
          max-width: 260px;
          background: #fff;
          border-radius: 16px;
          border: 1px solid #e5e7eb;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }

        .product-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 12px 30px rgba(0,0,0,0.12);
        }

        .badge {
          position: absolute;
          top: 12px;
          right: 12px;
          padding: 4px 10px;
          font-size: 12px;
          font-weight: 600;
          border-radius: 999px;
        }

        .in {
          background: #dcfce7;
          color: #166534;
        }

        .out {
          background: #fee2e2;
          color: #991b1b;
        }

        .img-box {
          height: 180px;
          background: #f1f5f9;
          overflow: hidden;
        }

        .img-box img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .product-card:hover img {
          transform: scale(1.08);
        }

        .card-body {
          padding: 14px;
        }

        .card-body h3 {
          font-size: 15px;
          font-weight: 600;
          color: #111827;
          margin-bottom: 6px;
        }

        .price {
          font-size: 18px;
          font-weight: 700;
          color: #16a34a;
          margin-bottom: 10px;
        }

        .btn-row {
          display: flex;
          gap: 8px;
        }

        button {
          flex: 1;
          padding: 8px;
          border-radius: 10px;
          border: none;
          font-weight: 600;
          cursor: pointer;
        }

        .buy {
          background: #16a34a;
          color: #fff;
        }

        .cart {
          background: #2563eb;
          color: #fff;
        }

        .disabled {
          background: #cbd5e1;
          color: #475569;
          cursor: not-allowed;
        }

        .loading,
        .empty {
          text-align: center;
          padding: 60px;
          color: #64748b;
        }
      `}</style>

      {loading ? (
        <div className="loading">Loading products…</div>
      ) : filteredProducts.length === 0 ? (
        <div className="empty">
          <h2>No products found</h2>
        </div>
      ) : (
        <div className="horizontal-list">
          {filteredProducts.map(p => (
            <div
              key={p.id}
              className="product-card"
              onClick={() => navigate(`/product/${p.id}`)}
            >
              <span className={`badge ${p.stock > 0 ? "in" : "out"}`}>
                {p.stock > 0 ? "In Stock" : "Out"}
              </span>

              <div className="img-box">
                <img src={getImageUrl(p.imageUrl)} alt={p.name} />
              </div>

              <div className="card-body">
                <h3>{p.name}</h3>
                <p className="price">${p.price.toFixed(2)}</p>

                {p.stock > 0 ? (
                  <div className="btn-row">
                    <button
                      className="buy"
                      onClick={e => handleBuyNow(e, p)}
                    >
                      Buy
                    </button>
                    <button
                      className="cart"
                      onClick={e => handleAddToCart(e, p)}
                    >
                      Cart
                    </button>
                  </div>
                ) : (
                  <button className="disabled" disabled>
                    Out of Stock
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </CustomerLayout>
  );
};

export default HomePage;
