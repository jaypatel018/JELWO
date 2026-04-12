import React from "react";
import Offcanvas from "react-bootstrap/Offcanvas";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useCart } from "./Context/CartContext";
import { useBuynow } from './Context/BuynowContext';
import "./CartOffcanvas.css";

const Cartoffacnvas = () => {
  const {addBuyNow, selectedBuy, increaseBuyQty, decreaseBuyQty, removeFromBuyNow} = useBuynow();
  const { cart, showCart, closeCart, removeFromCart, totalQty, increaseQty, decreaseQty } = useCart();
  const navigate = useNavigate();
  
  const handleBuyNow = () => {
    addBuyNow(cart);
    closeCart();
    navigate("/buynow");
  };
  
  // Sync increase quantity with buynow
  const handleIncreaseQty = (id) => {
    increaseQty(id);
    // Also update buynow if item exists there
    if (selectedBuy.some(item => item._id === id)) {
      increaseBuyQty(id);
    }
  };
  
  // Sync decrease quantity with buynow
  const handleDecreaseQty = (id) => {
    decreaseQty(id);
    // Also update buynow if item exists there
    if (selectedBuy.some(item => item._id === id)) {
      decreaseBuyQty(id);
    }
  };
  
  // Sync remove item with buynow
  const handleRemoveItem = (id) => {
    removeFromCart(id);
    // Also remove from buynow if item exists there
    if (selectedBuy.some(item => item._id === id)) {
      removeFromBuyNow(id);
    }
  };
  
  const subtotal = cart.reduce((total, item) => total + (item.price * item.qty), 0);
  
  return (
    <>
      <Offcanvas
        show={showCart}
        onHide={closeCart}
        scroll={true}
        backdrop={false}
        placement="end"
        className="cart-offcanvas"
      >
        <Offcanvas.Body className="p-0">
          {cart.length === 0 ? (
            <div className="empty-cart">
              <button className="cart-close-btn" onClick={closeCart}>
                <i className="fa-solid fa-xmark"></i>
              </button>
              <div className="empty-cart-content">
                <i className="fa-solid fa-bag-shopping empty-cart-icon"></i>
                <h4>Your cart is empty</h4>
                <p>Add items to get started</p>
                <button className="shop-now-btn" onClick={() => { closeCart(); navigate('/shop'); }}>
                  Shop Now
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="cart-header">
                <div className="cart-promo">
                  <i className="fa-solid fa-tag"></i>
                  <span>New customers save 10% with code <strong>WELCOME10</strong></span>
                </div>
                <div className="cart-title-bar">
                  <h5 className="cart-title">
                    <i className="fa-solid fa-bag-shopping me-2"></i>
                    Shopping Cart ({totalQty})
                  </h5>
                  <button className="cart-close-btn" onClick={closeCart}>
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                </div>
              </div>

              {/* Cart Items */}
              <div className="cart-items-container">
                {cart.map(item => (
                  <div key={item._id} className="cart-item-card">
                    <div className="cart-item-image">
                      <img
                        src={`${import.meta.env.VITE_API_IMAGE}/${item.frontImg}`}
                        alt={item.title}
                      />
                    </div>
                    <div className="cart-item-details">
                      <h6 className="cart-item-title">{item.title}</h6>
                      <div className="cart-item-price">
                        <span className="current-price">Rs. {item.price}</span>
                        {item.discount && (
                          <del className="original-price">Rs. {item.price + item.discount}</del>
                        )}
                      </div>
                      {item.selectedSize && (
                        <div className="cart-item-meta">
                          <span><i className="fa-solid fa-ruler"></i> Size: {item.selectedSize}</span>
                        </div>
                      )}
                      <div className="cart-item-actions">
                        <div className="quantity-controls">
                          <button 
                            className="qty-btn" 
                            onClick={() => handleDecreaseQty(item._id)}
                            disabled={item.qty <= 1}
                          >
                            <i className="fa-solid fa-minus"></i>
                          </button>
                          <span className="qty-display">{item.qty}</span>
                          <button 
                            className="qty-btn" 
                            onClick={() => handleIncreaseQty(item._id)}
                          >
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                        <button 
                          className="remove-btn" 
                          onClick={() => handleRemoveItem(item._id)}
                          title="Remove item"
                        >
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="cart-footer">
                <div className="cart-summary">
                  <div className="summary-row">
                    <span>Subtotal</span>
                    <span className="summary-value">Rs. {subtotal.toFixed(2)}</span>
                  </div>
                </div>
                <button className="checkout-btn" onClick={handleBuyNow}>
                  <i className="fa-solid fa-lock me-2"></i>
                  Proceed to Checkout
                </button>
                <button className="continue-shopping-btn" onClick={closeCart}>
                  Continue Shopping
                </button>
              </div>
            </>
          )}
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default Cartoffacnvas;
