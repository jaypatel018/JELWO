import React, { useEffect, useState } from 'react';
import './AdminCategories.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';

const API = `${import.meta.env.VITE_API_URL}/categories`;

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productCounts, setProductCounts] = useState({});
  const navigate = useNavigate();

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API);
      setCategories(res.data);
      
      // Fetch products to count by category
      const productsRes = await axios.get(`${import.meta.env.VITE_API_URL}/products`);
      const products = productsRes.data;
      
      // Count products per category
      const counts = {};
      res.data.forEach(cat => {
        counts[cat._id] = products.filter(p => p.category?._id === cat._id).length;
      });
      setProductCounts(counts);
      
      setLoading(false);
    } catch (err) {
      console.error("Error fetching categories", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Navigate to edit page
  const handleEdit = (cat) => {
    navigate(`/admin/addcategorie?id=${cat._id}`);
  };

  // Delete category
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await axios.delete(`${API}/${id}`);
        fetchCategories();
      } catch (err) {
        console.error("Error deleting category", err);
        alert("Error deleting category");
      }
    }
  };

  return (
    <div className="admin-product-page">
      <div className='top-bar d-flex justify-content-between align-items-center mb-4'>
        <h2>All Categories</h2>
        <Link to="/admin/addcategorie">
          <button className='addbtn'>
            <i className="fa-solid fa-plus me-2"></i>
            Add Category
          </button>
        </Link>
      </div>

      {loading ? (
        <div className="text-center p-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading categories...</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="categories-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Category Name</th>
                <th>Item Count</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.length > 0 ? (
                categories.map((cat) => (
                  <tr key={cat._id}>
                    <td>
                      <img
                        className="category-table-img"
                        src={`${import.meta.env.VITE_API_IMAGE}/${cat.image}`}
                        alt={cat.name}
                      />
                    </td>
                    <td className="category-name">{cat.name}</td>
                    <td className="item-count">
                      <span className="item-count-badge">
                        <i className="fa-solid fa-box"></i>
                        {productCounts[cat._id] || 0} products
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="btn-edit" 
                          onClick={() => handleEdit(cat)}
                        >
                          <i className="fa-solid fa-pen-to-square me-1"></i>
                          Edit
                        </button>
                        <button 
                          className="btn-delete" 
                          onClick={() => handleDelete(cat._id)}
                        >
                          <i className="fa-solid fa-trash me-1"></i>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="no-data">
                    <i className="fa-solid fa-inbox"></i>
                    <p>No categories found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;
