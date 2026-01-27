import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../components/layout/AdminLayout";
import axiosInstance from "../../api/axiosInstance";
import { API } from "../../api/endpoints";

const ProductsPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: 0,
    stock: 0,
    imageUrl: "",
    isActive: true,
    categoryId: null,
  });

  // --- HELPER TO HANDLE CLOUDINARY URLS ---
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://via.placeholder.com/300?text=No+Image";

    // 1. If it's a full URL (starts with http/https), return it as is
    if (imagePath.startsWith("http") || imagePath.startsWith("data:")) {
      return imagePath;
    }

    // 2. If your DB only stores the filename (e.g., "shoe.png"), uncomment and configure this:
    // const cloudName = "YOUR_CLOUD_NAME"; 
    // return `https://res.cloudinary.com/${cloudName}/image/upload/v1/${imagePath}`;

    // Default return
    return imagePath;
  };

  const fetchProducts = async () => {
    try {
      const res = await axiosInstance.get(API.PRODUCTS.GET_ALL);
      setProducts(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await axiosInstance.delete(API.PRODUCTS.DELETE(id));
      await fetchProducts();
    } catch (err) {
      alert("Failed to delete product");
    }
  };

  const openEdit = (p) => {
    setEditing(p.id);
    setForm({
      name: p.name || "",
      description: p.description || "",
      price: p.price || 0,
      stock: p.stock || 0,
      imageUrl: p.imageUrl || "",
      isActive: p.isActive ?? true,
      categoryId: p.categoryId || null,
    });
  };

  const saveEdit = async () => {
    try {
      await axiosInstance.put(API.PRODUCTS.UPDATE(editing), form);
      setEditing(null);
      await fetchProducts();
    } catch (err) {
      alert("Failed to update product");
    }
  };

  const cancelEdit = () => {
    setEditing(null);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <AdminLayout>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h1>Products</h1>
        <button style={headerBtnStyle} onClick={() => navigate("/admin/products/add")}>
          + Add Product
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        // --- GRID LAYOUT ---
        <div style={gridContainerStyle}>
          {products.map((p) => (
            <div key={p.id} style={cardStyle}>
              
              {/* IMAGE SECTION */}
              <div style={imageContainerStyle}>
                <img 
                  // If editing, show the preview of the URL in the input, otherwise show the saved URL
                  src={editing === p.id ? getImageUrl(form.imageUrl) : getImageUrl(p.imageUrl)}
                  alt={p.name} 
                  style={imageStyle}
                  onError={(e) => e.target.src = "https://via.placeholder.com/300?text=Error"}
                />
              </div>

              {/* DETAILS & ACTIONS SECTION */}
              <div style={cardContentStyle}>
                {editing === p.id ? (
                  // --- EDIT MODE ---
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <input 
                      style={inputStyle} 
                      value={form.name} 
                      placeholder="Name"
                      onChange={(e) => setForm({ ...form, name: e.target.value })} 
                    />
                    <input 
                      style={inputStyle} 
                      value={form.imageUrl} 
                      placeholder="Cloudinary Image URL"
                      onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} 
                    />
                    <div style={{ display: "flex", gap: "5px" }}>
                        <input style={inputStyle} type="number" value={form.price} placeholder="Price" onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
                        <input style={inputStyle} type="number" value={form.stock} placeholder="Stock" onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} />
                    </div>
                    <input 
                      style={inputStyle} 
                      type="number" 
                      value={form.categoryId ?? ""} 
                      placeholder="Category ID" 
                      onChange={(e) => setForm({ ...form, categoryId: e.target.value ? Number(e.target.value) : null })} 
                    />
                    
                    <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                      <button style={saveBtnStyle} onClick={saveEdit}>Save</button>
                      <button style={cancelBtnStyle} onClick={cancelEdit}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  // --- VIEW MODE ---
                  <>
                    <h3 style={titleStyle}>{p.name}</h3>
                    <div style={infoRowStyle}>
                        <span style={{color: "#2563eb", fontWeight: "bold"}}>${p.price}</span>
                        <span style={{color: p.stock > 0 ? "green" : "red"}}>
                          {p.stock > 0 ? `${p.stock} in Stock` : "Out of Stock"}
                        </span>
                    </div>
                    <p style={{ fontSize: "13px", color: "#64748b", marginTop: "4px" }}>
                      Category: {p.categoryName || "N/A"}
                    </p>
                    
                    <div style={{ display: "flex", gap: "10px", marginTop: "auto", paddingTop: "15px" }}>
                      <button style={updateBtnStyle} onClick={() => openEdit(p)}>Update</button>
                      <button style={deleteBtnStyle} onClick={() => handleDelete(p.id)}>Delete</button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

// --- STYLES ---
const headerBtnStyle = { padding: "10px 16px", background: "#2563eb", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "500" };

const gridContainerStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
  gap: "24px",
  paddingBottom: "40px"
};

const cardStyle = {
  background: "#fff",
  borderRadius: "12px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
  border: "1px solid #e2e8f0",
  transition: "transform 0.2s",
};

const imageContainerStyle = {
  width: "100%",
  height: "180px",
  background: "#f1f5f9",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  overflow: "hidden"
};

const imageStyle = {
  width: "100%",
  height: "100%",
  objectFit: "cover" // Keeps the image proportion correct within the square
};

const cardContentStyle = {
  padding: "16px",
  flex: 1,
  display: "flex",
  flexDirection: "column"
};

const titleStyle = { margin: "0 0 8px 0", fontSize: "16px", color: "#1e293b", fontWeight: "600", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" };
const infoRowStyle = { display: "flex", justifyContent: "space-between", fontSize: "14px" };
const inputStyle = { padding: "8px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "13px", width: "100%", boxSizing: "border-box" };

// Action Buttons
const updateBtnStyle = { flex: 1, padding: "8px", background: "#3b82f6", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "13px" };
const deleteBtnStyle = { flex: 1, padding: "8px", background: "#ef4444", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "13px" };
const saveBtnStyle = { flex: 1, padding: "8px", background: "#22c55e", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "13px" };
const cancelBtnStyle = { flex: 1, padding: "8px", background: "#94a3b8", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "13px" };

export default ProductsPage;