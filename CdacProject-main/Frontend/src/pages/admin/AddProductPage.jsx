import { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import axiosInstance from "../../api/axiosInstance";
import { API } from "../../api/endpoints";
import { useNavigate } from "react-router-dom";

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "dtff0pqmj";
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "product_images";
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

const AddProductPage = () => {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    categoryId: "",
    isActive: true,
    imageFile: null,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axiosInstance.get(API.CATEGORIES.GET_ALL);
      setCategories(res.data);
    } catch {
      setCategories([]);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0] || null;
    setForm({ ...form, imageFile: file });
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (!form.name || form.name.trim().length === 0) {
        setError("Product name is required");
        setLoading(false);
        return;
      }
      if (Number(form.price) <= 0) {
        setError("Price must be greater than 0");
        setLoading(false);
        return;
      }
      if (Number(form.stock) < 0) {
        setError("Stock cannot be negative");
        setLoading(false);
        return;
      }
      if (!form.categoryId) {
        setError("Please select a category");
        setLoading(false);
        return;
      }
      let imageUrl = "";
      if (form.imageFile) {
        const fd = new FormData();
        fd.append("file", form.imageFile);
        fd.append("upload_preset", UPLOAD_PRESET);
        fd.append("folder", "products");
        const resp = await fetch(CLOUDINARY_UPLOAD_URL, {
          method: "POST",
          body: fd,
        });
        const data = await resp.json();
        if (!resp.ok || !data.secure_url) {
          throw new Error("Cloudinary upload failed");
        }
        imageUrl = data.secure_url;
      }

      const payload = {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        stock: Number(form.stock),
        imageUrl,
        isActive: form.isActive,
        categoryId: Number(form.categoryId),
      };

      await axiosInstance.post(API.PRODUCTS.CREATE, payload);
      setSuccess("Product created successfully");
      setTimeout(() => navigate("/admin/products", { replace: true }), 800);
    } catch (err) {
      setError("Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <h1 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "16px" }}>Add Product</h1>
      {error && <div style={{ background: "#fee2e2", color: "#b91c1c", padding: "10px", borderRadius: "6px", marginBottom: "12px" }}>{error}</div>}
      {success && <div style={{ background: "#dcfce7", color: "#166534", padding: "10px", borderRadius: "6px", marginBottom: "12px" }}>{success}</div>}

      <form onSubmit={handleSubmit} style={{ background: "#fff", padding: "16px", borderRadius: "8px", maxWidth: "600px" }}>
        <label style={labelStyle}>Name</label>
        <input style={inputStyle} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />

        <label style={labelStyle}>Description</label>
        <textarea style={inputStyle} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />

        <label style={labelStyle}>Price</label>
        <input type="number" min="0" style={inputStyle} value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />

        <label style={labelStyle}>Stock</label>
        <input type="number" min="0" style={inputStyle} value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} required />

        <label style={labelStyle}>Category</label>
        <select style={inputStyle} value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} required>
          <option value="">Select a category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <label style={labelStyle}>Image</label>
        <input type="file" accept="image/*" onChange={handleFileChange} style={{ marginBottom: "12px" }} />
        {previewUrl && (
          <div style={{ marginBottom: "12px", border: "1px solid #e5e7eb", borderRadius: "8px", overflow: "hidden", width: "240px", height: "180px" }}>
            <img src={previewUrl} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        )}

        <div>
          <button type="submit" disabled={loading} style={btnStyle}>
            {loading ? "Saving..." : "Save Product"}
          </button>
          <button type="button" onClick={() => navigate("/admin/products")} style={{ ...btnStyle, background: "#64748b", marginLeft: "8px" }}>
            Cancel
          </button>
        </div>
      </form>
    </AdminLayout>
  );
};

const labelStyle = { display: "block", marginBottom: "6px", color: "#334155" };
const inputStyle = { width: "100%", padding: "10px", border: "1px solid #e5e7eb", borderRadius: "6px", marginBottom: "12px" };
const btnStyle = { padding: "10px 14px", background: "#2563eb", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" };

export default AddProductPage;
