import React, { useEffect, useState } from "react";
import "./AdminProduct.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const API = `${import.meta.env.VITE_API_URL}/products`;

const AdminProduct = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const res = await axios.get(API);
      setProducts(res.data);
      setFilteredProducts(res.data);
    } catch (err) {
      console.error("Error fetching products", err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/categories`);
      setCategories(res.data);
    } catch (err) {
      console.error("Error fetching categories", err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // Filter products when category changes
  useEffect(() => {
    if (selectedCategory === "all") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(
        (p) => p.category?._id === selectedCategory
      );
      setFilteredProducts(filtered);
    }
  }, [selectedCategory, products]);

  // → Navigate to edit page
  const handleEdit = (p) => {
    navigate(`/admin/addproduct?id=${p._id}`);
  };

  // Delete
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await axios.delete(`${API}/${id}`);
      fetchProducts();
    }
  };

  return (
    <div className="admin-product-page">

      <div className="top-bar d-flex justify-content-between align-items-center flex-wrap gap-3">
        <h2>All Products</h2>

        <div className="d-flex gap-3 align-items-center flex-wrap">
          {/* Category Filter */}
          <div className="category-filter">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="category-select"
            >
              <option value="all">All Products</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <Link to="/admin/addproduct">
            <button className="addbtn">
              <i className="fa-solid fa-plus me-2"></i>
              Add Product
            </button>
          </Link>
        </div>
      </div>

      {/* Product Count */}
      <div className="product-count">
        Showing {filteredProducts.length} of {products.length} products
      </div>

      <div className="product-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((p) => (
            <div className="product-card" key={p._id}>
              <img src={`${import.meta.env.VITE_API_IMAGE}/${p.frontImg}`} alt={p.title} />

              <h3>{p.title}</h3>
              
              {p.category && (
                <p className="category-badge">
                  <i className="fa-solid fa-tag"></i> {p.category.name || 'Uncategorized'}
                </p>
              )}

              <p>
                <span className="price">Rs. {p.price}</span>
                {p.discountPercentage > 0 && <span className="discount"> {p.discountPercentage}% OFF</span>}
              </p>

              <div className="actions">
                <button className="edit-btn" onClick={() => handleEdit(p)}>
                  <i className="fa-solid fa-pen-to-square me-1"></i>
                  Edit
                </button>

                <button className="delete-btn" onClick={() => handleDelete(p._id)}>
                  <i className="fa-solid fa-trash me-1"></i>
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-products">
            <i className="fa-solid fa-box-open"></i>
            <p>No products found in this category</p>
          </div>
        )}
      </div>

    </div>
  );
};
export default AdminProduct;

