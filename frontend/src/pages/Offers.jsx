import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Offers.css';

const Offers = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/products`);
      // Filter products with discount percentage >= 20%
      const discountedProducts = response.data.filter(
        product => product.discountPercentage >= 20
      );
      setProducts(discountedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="offers-loading">
        <div className="spinner-border text-danger" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="offers-page">
      {/* Hero Section */}
      <div className="offers-hero">
        <div className="container">
          <h1>Special Offers</h1>
          <p>Exclusive deals with 20% or more discount on premium jewellery</p>
        </div>
      </div>

      {/* Offers Grid */}
      <div className="container offers-container">
        <div className="offers-header">
          <h2>Limited Time Offers</h2>
          <p>{products.length} products with 20%+ discount</p>
        </div>

        {products.length === 0 ? (
          <div className="no-offers">
            <i className="fa-solid fa-tag"></i>
            <h3>No offers available at the moment</h3>
            <p>Check back soon for exciting deals!</p>
            <Link to="/collections" className="btn btn-danger">
              Browse All Products
            </Link>
          </div>
        ) : (
          <div className="offers-grid">
            {products.map((product) => (
              <div key={product._id} className="offer-card">
                <Link to={`/product/${product._id}`} className="offer-link">
                  <div className="offer-image-wrapper">
                    <img
                      src={`${import.meta.env.VITE_API_IMAGE}/${product.frontImg}`}
                      alt={product.title}
                      className="offer-image"
                    />
                    <div className="offer-badge">
                      {product.discountPercentage}% OFF
                    </div>
                  </div>
                  <div className="offer-content">
                    <h3 className="offer-title">{product.title}</h3>
                    <div className="offer-rating">
                      {[...Array(5)].map((_, index) => (
                        <i
                          key={index}
                          className={`fa-star ${
                            index < product.rating ? 'fa-solid' : 'fa-regular'
                          }`}
                        ></i>
                      ))}
                    </div>
                    <div className="offer-price">
                      <span className="current-price">₹{product.discount}</span>
                      <span className="original-price">₹{product.price}</span>
                      <span className="save-amount">
                        Save ₹{product.price - product.discount}
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Promotional Banner */}
      <div className="promo-banner">
        <div className="container">
          <div className="promo-content">
            <i className="fa-solid fa-gift"></i>
            <div>
              <h3>Sign up for exclusive offers</h3>
              <p>Get notified about new deals and special promotions</p>
            </div>
            <Link to="/sign-up" className="btn btn-light">
              Sign Up Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Offers;
