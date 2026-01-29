import { useState, useEffect } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import axiosInstance from "../../api/axiosInstance";
import { API } from "../../api/endpoints";

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    name: "",
    description: ""
  });

  const fetchCategories = async () => {
    try {
      const res = await axiosInstance.get(API.CATEGORIES.GET_ALL);
      setCategories(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await axiosInstance.delete(API.CATEGORIES.DELETE(id));
      await fetchCategories();
      setSuccess("Category deleted successfully");
      setTimeout(() => setSuccess(""), 1200);
    } catch (err) {
      alert("Failed to delete category");
    }
  };

  const openEdit = (c) => {
    setEditing(c.id);
    setForm({
      name: c.name || "",
      description: c.description || ""
    });
  };

  const saveEdit = async () => {
    try {
      await axiosInstance.put(API.CATEGORIES.UPDATE(editing), form);
      setEditing(null);
      await fetchCategories();
      setSuccess("Category updated successfully");
      setTimeout(() => setSuccess(""), 1200);
    } catch (err) {
      alert("Failed to update category");
    }
  };

  const cancelEdit = () => {
    setEditing(null);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <AdminLayout>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h1>Categories</h1>
        <button style={btnStyle} onClick={() => alert("Add Category Modal (To be implemented)")}>+ Add Category</button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff", borderRadius: "8px", overflow: "hidden" }}>
          <thead style={{ background: "#f1f5f9", textAlign: "left" }}>
            <tr>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Description</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.id} style={{ borderBottom: "1px solid #e2e8f0" }}>
                <td style={tdStyle}>{c.id}</td>
                <td style={tdStyle}>
                  {editing === c.id ? (
                    <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                  ) : (
                    c.name
                  )}
                </td>
                <td style={tdStyle}>
                  {editing === c.id ? (
                    <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                  ) : (
                    c.description
                  )}
                </td>
                <td style={tdStyle}>
                  {editing === c.id ? (
                    <>
                      <button style={{ ...actionBtn, color: "green", marginRight: "10px" }} onClick={saveEdit}>Save</button>
                      <button style={{ ...actionBtn, color: "gray", marginRight: "10px" }} onClick={cancelEdit}>Cancel</button>
                    </>
                  ) : (
                    <button style={{ ...actionBtn, color: "blue", marginRight: "10px" }} onClick={() => openEdit(c)}>Update</button>
                  )}
                  <button style={{ ...actionBtn, color: "red" }} onClick={() => handleDelete(c.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {success && <div style={{ marginTop: "12px", background: "#dcfce7", color: "#166534", padding: "10px", borderRadius: "6px" }}>{success}</div>}
    </AdminLayout>
  );
};

const thStyle = { padding: "12px", fontSize: "14px", color: "#64748b" };
const tdStyle = { padding: "12px", fontSize: "14px", color: "#334155" };
const btnStyle = { padding: "10px 16px", background: "#2563eb", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" };
const actionBtn = { background: "none", border: "none", cursor: "pointer", fontSize: "14px" };

export default CategoriesPage;
