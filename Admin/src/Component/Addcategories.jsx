import React from 'react'
import  { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "./AdminProduct.css";

const API = `${import.meta.env.VITE_API_URL}/categories`;

const Addcategories = () => {
    const [form, setForm] = useState({
    name: "",
    image: null,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [productCount, setProductCount] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  const id = new URLSearchParams(location.search).get("id");

  // LOAD CATEGORY WHEN EDITING
  useEffect(() => {
    if (id) {
      axios.get(`${API}/${id}`).then((res) => {
        setForm({
          name: res.data.name,
          image: null,
        });
        
        // Set existing image preview
        setImagePreview(`${import.meta.env.VITE_API_IMAGE}/${res.data.image}`);
        
        // Fetch product count for this category
        axios.get(`${import.meta.env.VITE_API_URL}/products`)
          .then(productsRes => {
            const count = productsRes.data.filter(p => p.category?._id === id).length;
            setProductCount(count);
          })
          .catch(err => console.error("Error fetching product count", err));
      });
    }
  }, [id]);

  // Handle image preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setForm({ ...form, image: file });
      };
      reader.readAsDataURL(file);
    }
  };

  // ADD / UPDATE
  const handleSubmit = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    fd.append("name", form.name);
    
    // Only append image if a new one is selected
    if (form.image) {
      fd.append("image", form.image);
    }
    
    try {
      if (!id) {
        await axios.post(`${API}/add`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await axios.put(`${API}/${id}`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      navigate("/admin/admincategories");

    } catch (err) {
      console.error("Submit Error", err);
      alert(err.response?.data?.message || "Error saving category");
    }
  };

  return (
    <div className="add-product-container">
      <form className="product-form-compact category-form" onSubmit={handleSubmit}>
        <h2 className="form-title">{id ? "Update Category" : "Add New Category"}</h2>

        <div className="category-form-content">
          {/* Left Side - Form Fields */}
          <div className="category-fields">
            <div className="form-group">
              <label>Category Name *</label>
              <input
                type="text"
                placeholder="Enter category name (e.g., Rings, Necklaces)"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>

            {id && (
              <div className="form-group">
                <label>Product Count</label>
                <div className="display-only-field">
                  <i className="fa-solid fa-box me-2"></i>
                  {productCount} products in this category
                </div>
                <small className="text-muted">This count is automatically calculated</small>
              </div>
            )}
          </div>

          {/* Right Side - Image Upload */}
          <div className="category-image-section">
            <label>Category Image *</label>
            <div className="category-image-upload">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                required={!id}
                id="category-image-input"
              />
              <label htmlFor="category-image-input" className="image-upload-label">
                {imagePreview ? (
                  <img src={imagePreview} alt="Category preview" className="category-preview" />
                ) : (
                  <div className="upload-placeholder">
                    <i className="fa-solid fa-cloud-arrow-up"></i>
                    <p>Click to upload image</p>
                    <span>PNG, JPG, WEBP (Max 5MB)</span>
                  </div>
                )}
              </label>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-submit">
            <i className="fa-solid fa-check me-2"></i>
            {id ? "Update Category" : "Add Category"}
          </button>
          <button
            type="button"
            onClick={() => {
              setForm({ name: "", image: null });
              setImagePreview(null);
              setProductCount(0);
            }}
            className="btn-reset"
          >
            <i className="fa-solid fa-rotate-right me-2"></i>
            Reset
          </button>
        </div>
      </form>
    </div>
  )
}

export default Addcategories
