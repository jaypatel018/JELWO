import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import "./Man.css";
import "./Showmore.css";
import "../pages/Collections.css";
import ProductCard from "../components/ProductCard";
import Slider from "@mui/material/Slider";
import Offcanvas from "react-bootstrap/Offcanvas";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCart } from "../Context/CartContext";
import { WishlistContext } from "../Context/WhishlistContext";
import "swiper/css";

const Man = () => {
  const navigate = useNavigate();
  const { addToCart, openCart } = useCart();
  const { wishlist, toggleWishlist } = useContext(WishlistContext);

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const [value, setValue] = useState([0, 300]);
  const [maxPrice, setMaxPrice] = useState(300);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [availabilityFilter, setAvailabilityFilter] = useState([]);
  const [sortKey, setSortKey] = useState("best selling");

  useEffect(() => {
    setLoading(true);
    axios.get(`${import.meta.env.VITE_API_URL}/categories`).then(catRes => {
      setCategories(catRes.data || []);
    }).catch(() => {});

    axios.get(`${import.meta.env.VITE_API_URL}/products`).then(res => {
      const all = res.data?.products || res.data || [];
      // Show only Men or Unisex products
      const menProducts = all.filter(p => p.gender === 'Men' || p.gender === 'Unisex');
      setProducts(menProducts);
      if (menProducts.length > 0) {
        const highest = Math.max(...menProducts.map(p => p.price));
        setMaxPrice(highest);
        setValue([0, highest]);
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleCategoryChange = (id) => setSelectedCategories(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);
  const handleColorChange = (color) => setSelectedColors(prev => prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]);
  const handleAvailabilityChange = (s) => setAvailabilityFilter(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  const resetFilters = () => { setSelectedCategories([]); setSelectedColors([]); setAvailabilityFilter([]); setValue([0, maxPrice]); };

  const filtered = products.filter(p => {
    const priceMatch = p.price >= value[0] && p.price <= value[1];
    const catMatch = selectedCategories.length === 0 || selectedCategories.some(id => p.category?._id === id);
    const colorMatch = selectedColors.length === 0 || selectedColors.some(c => p.metalColor?.toLowerCase() === c.toLowerCase());
    const availMatch = availabilityFilter.length === 0 ||
      (availabilityFilter.includes('instock') && (p.stock || 0) > 0) ||
      (availabilityFilter.includes('outofstock') && (p.stock || 0) === 0);
    return priceMatch && catMatch && colorMatch && availMatch;
  }).sort((a, b) => {
    if (sortKey === 'price-asc') return a.price - b.price;
    if (sortKey === 'price-dsc') return b.price - a.price;
    if (sortKey === 'name-asc') return a.title.localeCompare(b.title);
    if (sortKey === 'name-dsc') return b.title.localeCompare(a.title);
    return 0;
  });

  return (
    <div className="showmore-page">

      {/* Banner */}
      <div className="man-banner">
        <img src="/img/Mens_ban.webp" alt="Men's Collection" className="man-banner-img" />
      </div>

      {/* Title + Breadcrumb */}
      <div className="sm-title-section">
        <h1 className="sm-page-title">MEN'S COLLECTION</h1>
        <p className="sm-breadcrumb"><Link to="/" className="text-decoration-none text-muted">Home</Link> &gt; MEN'S COLLECTION</p>
      </div>

      {/* Products section */}
      <div className="px-3 px-md-4 px-lg-5">

          {/* Sort Bar */}
          <div className="sort-bar">
            <div className="sort-bar-left">
              <span onClick={() => setShow(true)} className="filter-toggle-btn">
                <i className="fa-solid fa-sliders"></i> FILTER
              </span>
            </div>
            <div className="sort-bar-right">
              <select onChange={e => setSortKey(e.target.value)} value={sortKey} className="sort-select">
                <option value="best selling">Best selling</option>
                <option value="name-asc">Alphabetically, A-Z</option>
                <option value="name-dsc">Alphabetically, Z-A</option>
                <option value="price-asc">Price low to high</option>
                <option value="price-dsc">Price high to low</option>
              </select>
            </div>
          </div>

          {/* Filter tags + count */}
          <div className="filter-info-row">
            <span className="product-count">{filtered.length} Products Found</span>
            {selectedCategories.map(catId => {
              const cat = categories.find(c => c._id === catId);
              return cat ? (
                <span key={catId} className="filter-tag">
                  <i className="fa-solid fa-xmark" onClick={() => handleCategoryChange(catId)}></i> {cat.name}
                </span>
              ) : null;
            })}
            {selectedColors.map(color => (
              <span key={color} className="filter-tag">
                <i className="fa-solid fa-xmark" onClick={() => handleColorChange(color)}></i> {color}
              </span>
            ))}
          </div>

          {/* Grid */}
          {loading ? (
              <div className="text-center mt-5 mb-5">
                <div className="spinner-border text-danger" role="status"></div>
                <p className="mt-3">Loading products...</p>
              </div>
            ) : (
              <div className="grid-layout">
                {filtered.length > 0 ? (
                  filtered.map(product => (
                    <ProductCard key={product._id} product={product} onScrollTop />
                  ))
                ) : (
                  <div className="text-center mt-5 w-100">
                    <h1>No Products Found</h1>
                    <p className="text-muted">No men's products yet. Set Gender to "Men" or "Unisex" when adding products in the admin panel.</p>
                  </div>
                )}
              </div>
            )}
      </div>

      {/* Filter Offcanvas */}
        <Offcanvas show={show} onHide={() => setShow(false)} placement="start">
          <Offcanvas.Header className="coll-offcanvas-header">
            <span className="coll-offcanvas-title">FILTER</span>
            <button className="coll-offcanvas-close" onClick={() => setShow(false)}>
              <i className="fa-solid fa-xmark"></i>
            </button>
          </Offcanvas.Header>
          <Offcanvas.Body className="coll-offcanvas-body">

            {/* Price */}
            <div className="coll-filter-section">
              <p className="coll-filter-heading">PRICE</p>
              <Slider value={value} onChange={(e, v) => setValue(v)} valueLabelDisplay="off" min={0} max={maxPrice} step={1} />
              <p className="coll-price-range">Price: ₹{value[0].toLocaleString('en-IN')} — ₹{value[1].toLocaleString('en-IN')}</p>
            </div>
            <div className="coll-filter-divider"></div>

            {/* Categories */}
            <div className="coll-filter-section">
              <div className="coll-filter-heading-row">
                <span className="coll-filter-headinginline">PRODUCT TYPE</span>
                <span className="coll-reset-link" onClick={resetFilters}>Reset All</span>
              </div>
              <ul className="list-unstyled coll-type-list">
                <li>
                  <label><input type="checkbox" checked={selectedCategories.length === 0} onChange={() => setSelectedCategories([])} /> All Products</label>
                  <span className="coll-avail-count">({products.length})</span>
                </li>
                {categories.map(cat => (
                  <li key={cat._id}>
                    <label>
                      <input type="checkbox" checked={selectedCategories.includes(cat._id)} onChange={() => handleCategoryChange(cat._id)} />
                      {cat.name}
                    </label>
                    <span className="coll-avail-count">({products.filter(p => p.category?._id === cat._id).length})</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="coll-filter-divider"></div>

            {/* Availability */}
            <div className="coll-filter-section">
              <div className="d-flex justify-content-between mb-3">
                <p className="coll-filter-heading">AVAILABILITY</p>
                <span className="coll-reset-link" onClick={() => setAvailabilityFilter([])}>Reset</span>
              </div>
              <div className="coll-avail-item">
                <label><input type="checkbox" checked={availabilityFilter.includes('instock')} onChange={() => handleAvailabilityChange('instock')} /> In stock</label>
                <span>({products.filter(p => (p.stock || 0) > 0).length})</span>
              </div>
              <div className="coll-avail-item">
                <label><input type="checkbox" checked={availabilityFilter.includes('outofstock')} onChange={() => handleAvailabilityChange('outofstock')} /> Out of stock</label>
                <span>({products.filter(p => (p.stock || 0) === 0).length})</span>
              </div>
            </div>
            <div className="coll-filter-divider"></div>

            {/* Color */}
            <div className="coll-filter-section">
              <div className="coll-filter-heading-row">
                <span className="coll-filter-heading">COLOR</span>
                <span className="coll-reset-link" onClick={() => setSelectedColors([])}>Reset</span>
              </div>
              <div className="coll-color-list">
                {[
                  { name: 'Rose Gold', bg: 'linear-gradient(135deg,#f4c2a1,#c97b4b)' },
                  { name: 'White Gold', bg: 'linear-gradient(135deg,#f5f5f5,#b0b0b0)' },
                  { name: 'Yellow Gold', bg: 'linear-gradient(135deg,#f5d060,#d4af37)' },
                ].map(({ name, bg }) => (
                  <label key={name} className={`coll-color-option ${selectedColors.includes(name) ? 'active' : ''}`} onClick={() => handleColorChange(name)}>
                    <span className="coll-color-dot" style={{ background: bg }}></span>
                    {name}
                  </label>
                ))}
              </div>
            </div>
            <div className="coll-filter-divider"></div>

            <div className="coll-filter-section">
              <img src="/img/side-banner.webp" alt="Promo" className="coll-side-banner" />
            </div>

          </Offcanvas.Body>
        </Offcanvas>
    </div>
  );
};

export default Man;
