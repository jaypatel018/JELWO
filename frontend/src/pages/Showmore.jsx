import React from "react";
import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import "./Showmore.css";
import "../pages/Collections.css";
import ProductCard from "../components/ProductCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import Slider from "@mui/material/Slider";
import { useCart } from "../Context/CartContext";
import Offcanvas from "react-bootstrap/Offcanvas";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "swiper/css";
import "swiper/css/navigation";
import { WishlistContext } from "../Context/WhishlistContext";
const Showmore = () => {
  const navigate = useNavigate();
  const { addToCart, openCart } = useCart();
  const { wishlist, toggleWishlist } = useContext(WishlistContext);
  const [value, setValue] = useState([0, 300]);
  const [maxPrice, setMaxPrice] = useState(300);
  const [show, setShow] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [availabilityFilter, setAvailabilityFilter] = useState([]);
  const [sortKey, setSortKey] = useState("best selling");
  const [currentPage, setCurrentPage] = useState(1);
  const PRODUCTS_PER_PAGE = 24;
const handleCategoryChange = (category) => {
  setSelectedCategories(prev => 
    prev.includes(category) 
      ? prev.filter(c => c !== category)
      : [...prev, category]
  );
};

const handleColorChange = (color) => {
  setSelectedColors(prev => 
    prev.includes(color) 
      ? prev.filter(c => c !== color)
      : [...prev, color]
  );
};

const handleAvailabilityChange = (status) => {
  setAvailabilityFilter(prev => 
    prev.includes(status) 
      ? prev.filter(s => s !== status)
      : [...prev, status]
  );
};

const resetFilters = () => {
  setSelectedCategories([]);
  setSelectedColors([]);
  setAvailabilityFilter([]);
  setValue([0, maxPrice]);
  setCurrentPage(1);
};
  const handleShow = () => { setShow(true); };
  const handleClose = () => { setShow(false); };
  //useEffect for dipaly the data from api
  useEffect(() => {
    setLoading(true);
    // Fetch products
    axios
      .get(`${import.meta.env.VITE_API_URL}/products`)
      .then((res) => {
        setProducts(res.data);
        if (res.data.length > 0) {
          const highest = Math.max(...res.data.map(p => p.price));
          setMaxPrice(highest);
          setValue([0, highest]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log("data fething erro", err);
        setLoading(false);
      });
    
    // Fetch categories
    axios
      .get(`${import.meta.env.VITE_API_URL}/categories`)
      .then((res) => {
        setCategories(res.data);
      })
      .catch((err) => {
        console.log("categories fetching error", err);
      });
  }, []);
  //filter logic to display the cards
  const filterProducts = products.filter((product) => {
    const priceMatch = product.price >= value[0] && product.price <= value[1];
    const categoryMatch = selectedCategories.length === 0 || selectedCategories.some(catId => product.category?._id === catId);
    const colorMatch = selectedColors.length === 0 || selectedColors.some(color => product.metalColor?.toLowerCase() === color.toLowerCase());
    const availabilityMatch = availabilityFilter.length === 0 || 
      (availabilityFilter.includes('instock') && (product.stock || 16) > 0) ||
      (availabilityFilter.includes('outofstock') && (product.stock || 16) === 0);
    return priceMatch && categoryMatch && colorMatch && availabilityMatch;
  }).sort((a, b) => {
    if (sortKey === 'price-asc') return a.price - b.price;
    if (sortKey === 'price-dsc') return b.price - a.price;
    if (sortKey === 'name-asc') return a.title.localeCompare(b.title);
    if (sortKey === 'name-dsc') return b.title.localeCompare(a.title);
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(filterProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = filterProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  // Reset to page 1 whenever filters/sort change
  useEffect(() => { setCurrentPage(1); }, [selectedCategories, selectedColors, availabilityFilter, value, sortKey]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  return (
    <div className="showmore-page">
      <div className="showmore-banner">
        <img src="/img/Best_Sellers.jpg" alt="Best Sellers" className="showmore-banner-img" />
      </div>

      {/* Title + Breadcrumb */}
      <div className="sm-title-section">
        <h1 className="sm-page-title">BEST SELLER</h1>
        <p className="sm-breadcrumb"><Link to="/" style={{color:'inherit', textDecoration:'none'}}>Home</Link> &gt; BEST SELLER</p>
      </div>

      {/*  col */}
      <div className="row">
        <div className="col-12 col-xl-3 d-none">
          <div className="categories p-3 border-bottom ">
            <h4>Categories</h4>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>{selectedCategories.length} selected</div>
              <div onClick={resetFilters} style={{cursor: 'pointer'}}>
                <u>Reset</u>
              </div>
            </div>
            <ul className="list-unstyled categories-list m-0  p-0">
              <li className="d-flex justify-content-between align-items-center">
                <div>
                  <input
                    type="checkbox"
                    id="cat-all"
                    checked={selectedCategories.length === 0}
                    onChange={() => setSelectedCategories([])}
                  />
                  <label htmlFor="cat-all"> All Products</label>
                </div>
                <div>({products.length})</div>
              </li>
              {categories.map((category) => {
                const productCount = products.filter(p => p.category?._id === category._id).length;
                return (
                  <li key={category._id} className="d-flex justify-content-between align-items-center">
                    <div>
                      <input
                        type="checkbox"
                        id={`cat-${category._id}`}
                        checked={selectedCategories.includes(category._id)}
                        onChange={() => handleCategoryChange(category._id)}
                      />
                      <label htmlFor={`cat-${category._id}`}> {category.name}</label>
                    </div>
                    <div>({productCount})</div>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="filter p-3 border-bottom">
            <h3>Filter</h3>
          </div>

          {/* Active Filter Tags - sidebar */}
          {(selectedCategories.length > 0 || selectedColors.length > 0 || availabilityFilter.length > 0) && (
            <div className="active-filters-sidebar p-3 border-bottom">
              <div className="active-filters-sidebar-header">
                <span>Active Filters</span>
                <button className="clear-all-filters" onClick={resetFilters}>Clear All</button>
              </div>
              <div className="active-filter-tags mt-2">
                {selectedCategories.map(catId => {
                  const cat = categories.find(c => c._id === catId);
                  return cat ? (
                    <span key={catId} className="filter-tag">
                      {cat.name}
                      <button onClick={() => handleCategoryChange(catId)}>
                        <i className="fa-solid fa-xmark"></i>
                      </button>
                    </span>
                  ) : null;
                })}
                {selectedColors.map(color => (
                  <span key={color} className="filter-tag filter-tag-color">
                    <span className={`tag-color-dot ${color.toLowerCase().replace(' ', '-')}`}></span>
                    {color}
                    <button onClick={() => handleColorChange(color)}>
                      <i className="fa-solid fa-xmark"></i>
                    </button>
                  </span>
                ))}
                {availabilityFilter.map(status => (
                  <span key={status} className="filter-tag filter-tag-availability">
                    {status === 'instock' ? 'In Stock' : 'Out of Stock'}
                    <button onClick={() => handleAvailabilityChange(status)}>
                      <i className="fa-solid fa-xmark"></i>
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          <div class="border-bottom p-3">
            <h4>Availability</h4>
            <div class="d-flex justify-content-between align-items-center mt-2 mb-2">
              <div>{availabilityFilter.length} selected</div>
              <div onClick={() => setAvailabilityFilter([])} style={{cursor: 'pointer'}}>
                <u>Reset</u>
              </div>
            </div>
            <ul class="list-unstyled p-0 mt-2">
              <li className="pb-1">
                <div class="d-flex justify-content-between">
                  <div>
                    <input
                      type="checkbox"
                      id="instock"
                      checked={availabilityFilter.includes('instock')}
                      onChange={() => handleAvailabilityChange('instock')}
                    />
                    <label htmlFor="instock">In stock</label>
                  </div>
                  <div>
                    <span>({products.filter(p => (p.stock || 16) > 0).length})</span>
                  </div>
                </div>
              </li>
              <li>
                <div class="d-flex justify-content-between">
                  <div>
                    <input
                      type="checkbox"
                      id="outofstock"
                      checked={availabilityFilter.includes('outofstock')}
                      onChange={() => handleAvailabilityChange('outofstock')}
                    />
                    <label htmlFor="outofstock">Out of stock</label>
                  </div>
                  <div>
                    <span>({products.filter(p => (p.stock || 16) === 0).length})</span>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          {/*price filter */}
          <div className="range p-3 border-bottom">
            <h4>Price</h4>
            <div class="d-flex justify-content-between align-items-center mt-2 mb-2">
              <div>Highest price Rs.{maxPrice}</div>
              <div onClick={() => setValue([0, maxPrice])} className="reset">
                <u>Reset</u>
              </div>
            </div>
            <div>
              <Slider
                value={value}
                onChange={(e, newValue) => setValue(newValue)}
                valueLabelDisplay="off"
                min={0}
                max={maxPrice}
                step={1}
              />
              <div className="d-flex gap-4">
                <div>
                  <label>From</label>
                  <input
                    className="border"
                    type="number"
                    onChange={(e) =>
                      setValue([value[0], Number(e.target.value)])
                    }
                    value={value[0]}
                  />
                </div>

                <div>
                  <label>To</label>
                  <input
                    className=" border"
                    type="number"
                    onChange={(e) =>
                      setValue([value[1], Number(e.target.value)])
                    }
                    value={value[1]}
                  />
                </div>
              </div>
            </div>
          </div>
          {/* color */}
          <div class="color-section border-bottom p-3">
            <h4>Color</h4>
            <div class="d-flex justify-content-between align-items-center mt-2 mb-2">
              <div>{selectedColors.length} selected</div>
              <div onClick={() => setSelectedColors([])} style={{cursor: 'pointer'}}>
                <u>Reset</u>
              </div>
            </div>
            <div className="colorcheckbox mt-4">
              <label className="color-option d-flex justify-content-between mb-2 me-2">
                <div>
                  <input
                    type="checkbox"
                    checked={selectedColors.includes('Rose Gold')}
                    onChange={() => handleColorChange('Rose Gold')}
                  />
                  <span className="circle rose-gold"></span>
                  Rose Gold
                </div>
                <div><span className="num">({products.filter(p => p.metalColor?.toLowerCase() === 'rose gold').length})</span></div>
              </label>
              <label className="color-option d-flex justify-content-between mb-2 me-2">
                <div>
                  <input
                    type="checkbox"
                    checked={selectedColors.includes('White Gold')}
                    onChange={() => handleColorChange('White Gold')}
                  />
                  <span className="circle white-gold"></span>
                  White Gold
                </div>
                <div><span className="num">({products.filter(p => p.metalColor?.toLowerCase() === 'white gold').length})</span></div>
              </label>
              <label className="color-option d-flex justify-content-between mb-2 me-2">
                <div>
                  <input
                    type="checkbox"
                    checked={selectedColors.includes('Yellow Gold')}
                    onChange={() => handleColorChange('Yellow Gold')}
                  />
                  <span className="circle gold1"></span>
                  Yellow Gold
                </div>
                <div><span className="num">({products.filter(p => p.metalColor?.toLowerCase() === 'yellow gold').length})</span></div>
              </label>
            </div>
            <div class=" pt-4">
              <div class="side">
                <img class="w-100 " src="./img/side-banner.webp" alt="" />
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 px-3 px-md-4 px-lg-5">
          <div>
            {/* Sort Bar */}
            <div className="sort-bar">
              <div className="sort-bar-left">
                <span onClick={handleShow} className="filter-toggle-btn">
                  <i className="fa-solid fa-sliders"></i> FILTER
                </span>
              </div>
              <div className="sort-bar-right">
                <select onChange={(e) => setSortKey(e.target.value)} value={sortKey} className="sort-select">
                  <option value="best selling">Best selling</option>
                  <option value="featured">Featured</option>
                  <option value="name-asc">Alphabetically, A-Z</option>
                  <option value="name-dsc">Alphabetically, Z-A</option>
                  <option value="price-asc">Price low to high</option>
                  <option value="price-dsc">Price high to low</option>
                </select>
              </div>
            </div>

            {/* Active filters + count row */}
            <div className="filter-info-row">
              <span className="product-count">{filterProducts.length} Products Found</span>
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
              {availabilityFilter.map(status => (
                <span key={status} className="filter-tag">
                  <i className="fa-solid fa-xmark" onClick={() => handleAvailabilityChange(status)}></i>
                  {status === 'instock' ? 'In Stock' : 'Out of Stock'}
                </span>
              ))}
            </div>

            <div className="tab-content">
              {/* Grid View */}
              <div className={`mt-4 ${viewMode === 'grid' ? 'd-block' : 'd-none'}`}>
                {loading ? (
                  <div className="text-center mt-5 mb-5">
                    <div className="spinner-border text-danger" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3">Loading products...</p>
                  </div>
                ) : (
                <div className="grid-layout">
                  {paginatedProducts.length > 0 ? (
                    paginatedProducts.map((product) => (
                      <ProductCard key={product._id} product={product} onScrollTop />
                    ))
                  ) : (
                    <div className="text-center mt-5 w-100">
                      <h6>😊😊</h6>
                      <h1>No Products Found</h1>
                      <p className="text-danger">
                        There are no products matching from selection, please
                        select fewer or clear all.
                      </p>
                    </div>
                  )}
                </div>
                )}

                {/* Pagination */}
                {!loading && totalPages > 1 && (
                  <div className="sm-pagination">
                    <button
                      className="sm-page-btn sm-page-arrow"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <i className="fa-solid fa-chevron-left"></i>
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                      // show first, last, current ±1, and ellipsis
                      const show = page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1;
                      const showEllipsisBefore = page === currentPage - 2 && currentPage > 3;
                      const showEllipsisAfter  = page === currentPage + 2 && currentPage < totalPages - 2;
                      if (showEllipsisBefore || showEllipsisAfter) {
                        return <span key={page} className="sm-page-ellipsis">…</span>;
                      }
                      if (!show) return null;
                      return (
                        <button
                          key={page}
                          className={`sm-page-btn ${currentPage === page ? 'active' : ''}`}
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </button>
                      );
                    })}

                    <button
                      className="sm-page-btn sm-page-arrow"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      <i className="fa-solid fa-chevron-right"></i>
                    </button>
                  </div>
                )}
              </div>
              {/* List View */}
              <div className={`list-layout mt-4 ${viewMode === 'list' ? 'd-block' : 'd-none'}`}>
                {loading ? (
                  <div className="text-center mt-5 mb-5">
                    <div className="spinner-border text-danger" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3">Loading products...</p>
                  </div>
                ) : (
                  <>
                {filterProducts.length > 0 ? (
                  filterProducts.map((product) => (
                    <div class="row border rounded-3 m-3 justify-content-center align-items-center pt-3 pb-3  bg-white mt-3">
                      <div class="col-12 col-sm-4">
                        <Link to={`/product/${product._id}`}>
                          <div class="img-content">
                            <img
                              class=" w-100 front-img"
                              src={`${import.meta.env.VITE_API_IMAGE}/${product.frontImg}`}
                              alt=""
                            />
                            <img
                              class="w-100 back-img"
                              src={`${import.meta.env.VITE_API_IMAGE}/${product.backImg}`}
                              alt=""
                            />
                          </div>
                        </Link>
                      </div>
                      <div class="col-12 col-sm-8">
                        <p className="mb-1 fw-medium text-dark">{product.title}</p>
                        <div className="d-flex align-items-center gap-2 mb-2">
                          <span className="fw-bold text-dark">₹{product.price?.toLocaleString('en-IN')}</span>
                          {product.discountPercentage > 0 && <>
                            <del className="text-muted small">₹{(product.price + (product.discount || 0))?.toLocaleString('en-IN')}</del>
                            <span style={{color:'#a52a2a', fontSize:'13px', fontWeight:600}}>{product.discountPercentage}% OFF</span>
                          </>}
                        </div>
                        <p>
                          Product Specifications Care for fiber: 30% more
                          recycled polyester. We label garments manufactured
                          using environmentally friendly technologies and raw
                          materials with the Join Life label. Washing
                          Instructions Iron maximum 100ºC. Do not bleach/bleach.
                          Do not...
                        </p>
                        <div>
                          <a class="icon-1" href="" onClick={(e) => { e.preventDefault(); toggleWishlist(product, navigate); }}>
                            <i class={wishlist.some(item => item._id === product._id) ? "fa-solid fa-heart text-danger" : "fa-regular fa-heart"}></i>
                          </a>
                          <span
                            onClick={() => { const ok = addToCart(product, navigate); if (ok) openCart(); }}
                            class="icon-1"
                          >
                            <i class="fa-solid fa-bag-shopping"></i>
                          </span>
                          <a class="icon-1" href="" onClick={(e) => { e.preventDefault(); navigate(`/product/${product._id}`); }}>
                            <i class="fa-solid fa-eye"></i>
                          </a>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center mt-5 ">
                    <h6>😊😊</h6>
                    <h1>No Products Found</h1>
                    <p className="text-danger">
                      There are no products matching from selection, please
                      select fewer or clear all.
                    </p>
                  </div>
                )}
                </>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* offcanvas filter */}
        <Offcanvas show={show} onHide={handleClose} placement="start">
          <Offcanvas.Header className="coll-offcanvas-header">
            <span className="coll-offcanvas-title">FILTER</span>
            <div className="d-flex align-items-center gap-3">
              <button className="coll-offcanvas-close" onClick={handleClose}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
          </Offcanvas.Header>
          <Offcanvas.Body className="coll-offcanvas-body">

            {/* Price */}
            <div className="coll-filter-section">
              <p className="coll-filter-heading">PRICE</p>
              <Slider value={value} onChange={(e, v) => setValue(v)} valueLabelDisplay="off" min={0} max={maxPrice} step={1} />
              <p className="coll-price-range">Price: ₹{value[0].toLocaleString('en-IN')} — ₹{value[1].toLocaleString('en-IN')}</p>
              <button className="coll-apply-btn">FILTER</button>
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
                  <label>
                    <input type="checkbox" checked={selectedCategories.length === 0} onChange={() => setSelectedCategories([])} />
                    All Products
                  </label>
                  <span className="coll-avail-count">({products.length})</span>
                </li>
                {categories.map(cat => {
                  const count = products.filter(p => p.category?._id === cat._id).length;
                  return (
                    <li key={cat._id}>
                      <label>
                        <input type="checkbox" checked={selectedCategories.includes(cat._id)} onChange={() => handleCategoryChange(cat._id)} />
                        {cat.name}
                      </label>
                      <span className="coll-avail-count">({count})</span>
                    </li>
                  );
                })}
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
                <label>
                  <input type="checkbox" checked={availabilityFilter.includes('instock')} onChange={() => handleAvailabilityChange('instock')} />
                  In stock
                </label>
                <span>({products.filter(p => (p.stock || 0) > 0).length})</span>
              </div>
              <div className="coll-avail-item">
                <label>
                  <input type="checkbox" checked={availabilityFilter.includes('outofstock')} onChange={() => handleAvailabilityChange('outofstock')} />
                  Out of stock
                </label>
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

            {/* Side Banner */}
            <div className="coll-filter-section">
              <img src="/img/side-banner.webp" alt="Promo" className="coll-side-banner" />
            </div>

          </Offcanvas.Body>
        </Offcanvas>
      </div>
    </div>
  );
};

export default Showmore;
