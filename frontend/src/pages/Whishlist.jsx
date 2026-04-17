import React, { useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Whishlist.css';
import { WishlistContext } from "../Context/WhishlistContext";
import ProductCard from "../components/ProductCard";

const Whishlist = () => {
  const navigate = useNavigate();
  const { wishlist } = useContext(WishlistContext);

  return (
    <div>
      <div className="wl-title-section">
        <h1 className="wl-page-title">WISHLIST</h1>
        <p className="wl-breadcrumb"><Link to="/" style={{color:'inherit',textDecoration:'none'}}>Home</Link> &gt; WISHLIST</p>
      </div>
      <div className="whish-grid pt-5 pb-5">
        {wishlist.length === 0 ? (
          <div className="wl-empty" style={{gridColumn: '1 / -1'}}>
            <img src="/img/heartlogo.svg" alt="empty wishlist" className="wl-empty-icon" />
            <h2 className="wl-empty-title">Wishlist is empty.</h2>
            <p className="wl-empty-text">
              You don't have any products in the wishlist yet.<br />
              You will find a lot of interesting products on our "Shop" page.
            </p>
            <button className="wl-empty-btn" onClick={() => navigate('/showmore')}>
              RETURN TO SHOP
            </button>
          </div>
        ) : (
          wishlist.map((item) => (
            <ProductCard key={item._id} product={item} onScrollTop showRemove />
          ))
        )}
      </div>
    </div>
  );
};

export default Whishlist;
