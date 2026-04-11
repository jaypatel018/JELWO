import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { WishlistContext } from '../Context/WhishlistContext';
import { useCart } from '../Context/CartContext';
import { trackAddToCart, trackProductClick } from '../utils/trackStats';
import './ProductCard.css';

const ProductCard = ({ product, onScrollTop, showRemove }) => {
  const navigate = useNavigate();
  const { wishlist, toggleWishlist } = useContext(WishlistContext);
  const { addToCart, openCart } = useCart();
  const [frontLoaded, setFrontLoaded] = useState(false);
  const [backLoaded, setBackLoaded] = useState(false);

  const isWished = wishlist.some(i => i._id === product._id);
  const salePrice = product.price;
  const origPrice = product.price + (product.discount || 0);
  const pct = product.discountPercentage;

  const handleLink = () => {
    trackProductClick();
    if (onScrollTop) window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="pc-card">
      <Link to={`/product/${product._id}`} className="pc-img-wrap" onClick={handleLink}>
        {!frontLoaded && <div className="pc-skeleton" />}
        <img
          className="pc-front"
          src={`${import.meta.env.VITE_API_IMAGE}/${product.frontImg}`}
          alt={product.title}
          style={{ opacity: frontLoaded ? 1 : 0 }}
          onLoad={() => setFrontLoaded(true)}
        />
        <img
          className="pc-back"
          src={`${import.meta.env.VITE_API_IMAGE}/${product.backImg}`}
          alt={product.title}
          style={{ opacity: backLoaded ? undefined : 0 }}
          onLoad={() => setBackLoaded(true)}
        />
        {pct > 0 && <span className="pc-badge">{pct}% OFF</span>}
        <button className="pc-wish" onClick={e => { e.preventDefault(); toggleWishlist(product, navigate); }}>
          {showRemove
            ? <i className="fa-solid fa-xmark"></i>
            : <i className={isWished ? 'fa-solid fa-heart' : 'fa-regular fa-heart'}></i>
          }
        </button>
      </Link>
      <div className="pc-body">
        <p className="pc-title">{product.title}</p>
        <div className="pc-price-row">
          <span className="pc-price">₹{salePrice?.toLocaleString('en-IN')}</span>
          {pct > 0 && <>
            <del className="pc-orig">₹{origPrice?.toLocaleString('en-IN')}</del>
            <span className="pc-pct">({pct}%)</span>
          </>}
        </div>
        <button className="pc-btn" onClick={() => { trackAddToCart(); const ok = addToCart(product, navigate); if (ok) openCart(); }}>
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
