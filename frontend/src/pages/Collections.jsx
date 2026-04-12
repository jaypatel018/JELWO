import { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Offcanvas from "react-bootstrap/Offcanvas";
import Slider from "@mui/material/Slider";
import { WishlistContext } from "../Context/WhishlistContext";
import { useCart } from "../Context/CartContext";
import ProductCard from "../components/ProductCard";
import './Collections.css';

const Collections = () => {
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
  const [selectedGenders, setSelectedGenders] = useState([]);
  const [selectedOccasions, setSelectedOccasions] = useState([]);
  const [selectedCollections, setSelectedCollections] = useState([]);
  const [sortKey, setSortKey] = useState("best selling");

  const handleCategoryChange = (id) => setSelectedCategories(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);
  const handleColorChange = (color) => setSelectedColors(prev => prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]);
  const handleGenderChange = (g) => setSelectedGenders(prev => prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g]);
  const handleOccasionChange = (o) => setSelectedOccasions(prev => prev.includes(o) ? prev.filter(x => x !== o) : [...prev, o]);
  const handleCollectionChange = (c) => setSelectedCollections(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);
  const resetFilters = () => { setSelectedCategories([]); setSelectedColors([]); setAvailabilityFilter([]); setSelectedGenders([]); setSelectedOccasions([]); setSelectedCollections([]); setValue([0, maxPrice]); };

  useEffect(() => {
    setLoading(true);
    axios.get(`${import.meta.env.VITE_API_URL}/products`).then(res => {
      setProducts(res.data);
      const highest = Math.max(...res.data.map(p => p.price), 300);
      setMaxPrice(highest);
      setValue([0, highest]);
      setLoading(false);
    }).catch(() => setLoading(false));
    axios.get(`${import.meta.env.VITE_API_URL}/categories`).then(res => setCategories(res.data)).catch(() => {});
  }, []);

  const filterProducts = products.filter(p => {
    const priceMatch = p.price >= value[0] && p.price <= value[1];
    const catMatch = selectedCategories.length === 0 || selectedCategories.some(id => p.category?._id === id);
    const colorMatch = selectedColors.length === 0 || selectedColors.some(c => p.metalColor?.toLowerCase() === c.toLowerCase());
    const availMatch = availabilityFilter.length === 0 ||
      (availabilityFilter.includes('instock') && p.stock > 0) ||
      (availabilityFilter.includes('outofstock') && p.stock === 0);
    const genderMatch = selectedGenders.length === 0 || selectedGenders.includes(p.gender);
    const occasionMatch = selectedOccasions.length === 0 || selectedOccasions.includes(p.occasion);
    const collectionMatch = selectedCollections.length === 0 || selectedCollections.includes(p.collection);
    return priceMatch && catMatch && colorMatch && availMatch && genderMatch && occasionMatch && collectionMatch;
  }).sort((a, b) => {
    if (sortKey === 'price-asc') return a.price - b.price;
    if (sortKey === 'price-dsc') return b.price - a.price;
    if (sortKey === 'name-asc') return a.title.localeCompare(b.title);
    if (sortKey === 'name-dsc') return b.title.localeCompare(a.title);
    return 0;
  });

  return (
    <div className="collections-page">
      {/* Banner */}
      <div className="collections-banner">
        <img src="/img/collections.jpg" alt="Collections" className="collections-banner-img" />
      </div>

      {/* Title + Breadcrumb */}
      <div className="coll-title-section">
        <h1 className="coll-page-title">COLLECTIONS</h1>
        <p className="coll-breadcrumb"><Link to="/" style={{color:'inherit',textDecoration:'none'}}>Home</Link> &gt; COLLECTIONS</p>
      </div>

      {/* Content */}
      <div className="col-12 px-2 px-md-4 px-lg-5">
        {/* Sort Bar */}
        <div className="coll-sort-bar">
          <span onClick={() => setShow(true)} className="coll-filter-btn">
            <i className="fa-solid fa-sliders"></i> FILTER
          </span>
          <select className="coll-sort-select" value={sortKey} onChange={e => setSortKey(e.target.value)}>
            <option value="best selling">Best selling</option>
            <option value="price-asc">Price low to high</option>
            <option value="price-dsc">Price high to low</option>
            <option value="name-asc">Alphabetically, A-Z</option>
            <option value="name-dsc">Alphabetically, Z-A</option>
          </select>
        </div>

        {/* Active filters row */}
        <div className="coll-filter-info">
          <span className="coll-count">{filterProducts.length} Products Found</span>
          {selectedCategories.map(catId => {
            const cat = categories.find(c => c._id === catId);
            return cat ? (
              <span key={catId} className="coll-tag">
                <i className="fa-solid fa-xmark" onClick={() => handleCategoryChange(catId)}></i> {cat.name}
              </span>
            ) : null;
          })}
          {selectedColors.map(color => (
            <span key={color} className="coll-tag">
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
          <div className="coll-grid">
            {filterProducts.length > 0 ? filterProducts.map(product => (
              <ProductCard key={product._id} product={product} onScrollTop />
            )) : (
              <div className="text-center mt-5" style={{gridColumn:'1/-1'}}>
                <h5>No Products Found</h5>
                <p className="text-muted">Try clearing some filters.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Filter Offcanvas */}
      <Offcanvas show={show} onHide={() => setShow(false)} placement="start">
        <Offcanvas.Header className="coll-offcanvas-header">
          <span className="coll-offcanvas-title">FILTER</span>
          <div className="d-flex align-items-center gap-3">
            
            <button className="coll-offcanvas-close" onClick={() => setShow(false)}>
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
        </Offcanvas.Header>
        <div className="coll-filter-divider"></div>
        <Offcanvas.Body className="coll-offcanvas-body">

          {/* Price */}
          <div className="coll-filter-section">
            <p className="coll-filter-heading">PRICE</p>
            <Slider value={value} onChange={(e, v) => setValue(v)} valueLabelDisplay="off" min={0} max={maxPrice} />
            <p className="coll-price-range">Price: ₹{value[0].toLocaleString('en-IN')} — ₹{value[1].toLocaleString('en-IN')}</p>
            <button className="coll-apply-btn" onClick={() => {}}>FILTER</button>
          </div>

          <div className="coll-filter-divider"></div>

          {/* Product Type */}
          <div className="coll-filter-section">
            <div className="coll-filter-heading-row inline">
              <span className="coll-filter-headinginline">PRODUCT TYPE</span>
              <span className="coll-reset-link " onClick={resetFilters}>Reset All</span>
            </div>
            
            <ul className="list-unstyled coll-type-list">
              <li>
                <label>
                  <input type="checkbox" checked={selectedCategories.length === 0} onChange={() => setSelectedCategories([])} />
                  All Products
                </label>
              </li>
              {categories.map(cat => (
                <li key={cat._id}>
                  <label>
                    <input type="checkbox" checked={selectedCategories.includes(cat._id)} onChange={() => handleCategoryChange(cat._id)} />
                    {cat.name}
                  </label>
                </li>
              ))}
            </ul>
          </div>

          <div className="coll-filter-divider"></div>

          {/* Gender */}
          <div className="coll-filter-section">
            <p className="coll-filter-heading">GENDER</p>
            <ul className="list-unstyled coll-type-list">
              {['Men', 'Women', 'Unisex'].map(g => (
                <li key={g}><label><input type="checkbox" checked={selectedGenders.includes(g)} onChange={() => handleGenderChange(g)} />{g}</label></li>
              ))}
            </ul>
          </div>

          <div className="coll-filter-divider"></div>

          {/* Occasion */}
          <div className="coll-filter-section">
            <p className="coll-filter-heading">OCCASION</p>
            <ul className="list-unstyled coll-type-list">
              {['Party Wear', 'Daily Wear', 'Festive Collections', 'Wedding Collections'].map(o => (
                <li key={o}><label><input type="checkbox" checked={selectedOccasions.includes(o)} onChange={() => handleOccasionChange(o)} />{o}</label></li>
              ))}
            </ul>
          </div>

          <div className="coll-filter-divider"></div>

          {/* Collections */}
          <div className="coll-filter-section">
            <p className="coll-filter-heading">COLLECTIONS</p>
            <ul className="list-unstyled coll-type-list">
              {['Statement Collections', 'Vintage Collections', 'Luxury Collections', 'Branded Collections'].map(c => (
                <li key={c}><label><input type="checkbox" checked={selectedCollections.includes(c)} onChange={() => handleCollectionChange(c)} />{c}</label></li>
              ))}
            </ul>
          </div>

          <div className="coll-filter-divider"></div>

          {/* Availability */}
          <div className="coll-filter-section">
            <p className="coll-filter-heading">AVAILABILITY</p>
            <div className="d-flex justify-content-between mb-3">
              <span className="coll-selected-count">{availabilityFilter.length} selected</span>
              <span className="coll-reset-link" onClick={() => setAvailabilityFilter([])}>Reset</span>
            </div>
            <div className="coll-avail-item">
              <label>
                <input type="checkbox" checked={availabilityFilter.includes('instock')} onChange={() => setAvailabilityFilter(prev => prev.includes('instock') ? prev.filter(x => x !== 'instock') : [...prev, 'instock'])} />
                In stock
              </label>
              <span>({products.filter(p => p.stock > 0).length})</span>
            </div>
            <div className="coll-avail-item">
              <label>
                <input type="checkbox" checked={availabilityFilter.includes('outofstock')} onChange={() => setAvailabilityFilter(prev => prev.includes('outofstock') ? prev.filter(x => x !== 'outofstock') : [...prev, 'outofstock'])} />
                Out of stock
              </label>
              <span>({products.filter(p => p.stock === 0).length})</span>
            </div>
          </div>

          <div className="coll-filter-divider"></div>

          {/* Color */}
          <div className="coll-filter-section">
            <p className="coll-filter-heading">COLOR</p>
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

          {/* Side Banner */}
          <div className="coll-filter-section">
            <img src="/img/side-banner.webp" alt="Promo" className="coll-side-banner" />
          </div>

        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
};

export default Collections;
