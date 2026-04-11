import { useState, useEffect, useContext } from 'react';
import { Collapse } from 'react-bootstrap'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import './Navbar.css'
import { Link } from 'react-router-dom';
import {Swiper, SwiperSlide} from "swiper/react";
import "swiper/css";
import { Navigation , Autoplay} from 'swiper/modules';
import "swiper/css/navigation";
import { WishlistContext } from "./Context/WhishlistContext";
import { useCart } from "./Context/CartContext";
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import { UserButton, SignedIn, SignedOut } from '@clerk/clerk-react';
import { trackSearch, trackProductClick } from './utils/trackStats';
const Navbar = () => {
    // state for admin email and password store
    const [email, setEmail]= useState("");
    const [password, setPassword]= useState("");
    const navigate = useNavigate();
    const { openCart,cart } = useCart();
    const [open, setOpen] = useState(false);
    const [open1, setOpen1] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [open3, setOpen3] = useState(false);
    const {  wishlistCount } = useContext(WishlistContext);
    const cartTotal = cart.reduce((sum, item) => sum + item.qty, 0);
    
    // Function to handle menu toggle - closes others when opening one
    const handleMenuToggle = (menuNumber) => {
        if (menuNumber === 0) {
            setOpen(!open);
            setOpen1(false);
            setOpen2(false);
            setOpen3(false);
        } else if (menuNumber === 1) {
            setOpen(false);
            setOpen1(!open1);
            setOpen2(false);
            setOpen3(false);
        } else if (menuNumber === 2) {
            setOpen(false);
            setOpen1(false);
            setOpen2(!open2);
            setOpen3(false);
        } else if (menuNumber === 3) {
            setOpen(false);
            setOpen1(false);
            setOpen2(false);
            setOpen3(!open3);
        }
    };
    
    // Function to handle navigation and close offcanvas
    const handleNavigation = (path) => {
        // Close the offcanvas
        const offcanvasElement = document.getElementById('offcanvasExample');
        if (offcanvasElement) {
            // Try to get existing instance or create new one
            let bsOffcanvas = window.bootstrap?.Offcanvas?.getInstance(offcanvasElement);
            if (!bsOffcanvas && window.bootstrap?.Offcanvas) {
                bsOffcanvas = new window.bootstrap.Offcanvas(offcanvasElement);
            }
            if (bsOffcanvas) {
                bsOffcanvas.hide();
            }
        }
        // Small delay to ensure offcanvas closes before navigation
        setTimeout(() => {
            navigate(path);
        }, 100);
    };
    
    // Search functionality states
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showSearchDropdown, setShowSearchDropdown] = useState(false);
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

    // Typing placeholder animation
    const placeholderItems = ["Mangalsutra...", "Gold Rings...", "Diamond Earrings...", "Bangles...", "Necklace...", "Bracelets..."];
    const [placeholderText, setPlaceholderText] = useState("");
    const [plIndex, setPlIndex] = useState(0);
    const [plCharIndex, setPlCharIndex] = useState(0);
    const [plDeleting, setPlDeleting] = useState(false);

    useEffect(() => {
        const current = placeholderItems[plIndex];
        const speed = plDeleting ? 50 : 100;
        const timeout = setTimeout(() => {
            if (!plDeleting && plCharIndex < current.length) {
                setPlaceholderText(current.slice(0, plCharIndex + 1));
                setPlCharIndex(c => c + 1);
            } else if (!plDeleting && plCharIndex === current.length) {
                setTimeout(() => setPlDeleting(true), 1200);
            } else if (plDeleting && plCharIndex > 0) {
                setPlaceholderText(current.slice(0, plCharIndex - 1));
                setPlCharIndex(c => c - 1);
            } else {
                setPlDeleting(false);
                setPlIndex(i => (i + 1) % placeholderItems.length);
            }
        }, speed);
        return () => clearTimeout(timeout);
    }, [plCharIndex, plDeleting, plIndex]);
    
    // Search products function
    const searchProducts = async (query) => {
        if (!query.trim()) {
            setSearchResults([]);
            setShowSearchDropdown(false);
            return;
        }
        setIsSearching(true);
        setShowSearchDropdown(true);
        trackSearch();
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/products/search`, {
                params: { q: query }
            });
            setSearchResults(response.data);
        } catch (error) {
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    };
    
    // Handle search input change
    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        
        // Debounce search
        if (window.searchTimeout) {
            clearTimeout(window.searchTimeout);
        }
        
        window.searchTimeout = setTimeout(() => {
            searchProducts(query);
        }, 300);
    };
    
    // Handle search result click
    const handleResultClick = (productId) => {
        trackProductClick();
        navigate(`/product/${productId}`);
        setSearchQuery("");
        setSearchResults([]);
        setShowSearchDropdown(false);
    };
    
    // Clear search
    const clearSearch = () => {
        setSearchQuery("");
        setSearchResults([]);
        setShowSearchDropdown(false);
    };
    
    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.navbar-search')) {
                setShowSearchDropdown(false);
            }
        };
        
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    
    // admin login function
     const submit = async (e) => {
  e.preventDefault();

  try {
    const res = await axios.post(`${import.meta.env.VITE_API_URL}/admin/login`, {
      email,
      password,
    });

    if (res.data.msg === "Login success") {
      alert("Admin Login Successful");
      document.body.classList.remove("modal-open");
      document.querySelector(".modal-backdrop")?.remove();
      document.body.style.overflow = "auto";
      navigate("/admin");
    }

  } catch (error) {
    if (error.response) {
      alert(error.response.data.msg); 
      
    } else {
      alert("Server error");
    }
  }
};


  return (
   <>
    <div>   
<header>

<div className="announcement-bar">
  <Swiper
    modules={[Autoplay]}
    autoplay={{ delay: 1000, disableOnInteraction: false }}
    loop={true}
    speed={600}
    allowTouchMove={false}
    className="announcement-swiper"
  >
    <SwiperSlide><span>✦ FREE STUDS worth ₹1495 on orders above ₹2999</span></SwiperSlide>
    <SwiperSlide><span>🚚 FREE SHIPPING on all orders above ₹999</span></SwiperSlide>
    <SwiperSlide><span>💎 Use code <strong>FIRST10</strong> for 10% off your first order</span></SwiperSlide>
    <SwiperSlide><span>🎁 Gift wrapping available on all orders</span></SwiperSlide>
  </Swiper>
</div>

{/* Top Navbar - Search, Logo, Icons */}
<nav className="navbar-top">
  <div className="container-fluid">
    <div className="navbar-top-content">
      {/* Left Side - Toggle + Search */}
      <div className="navbar-left-side">
        {/* Mobile/Tablet Menu Toggle */}
        <button className="mobile-menu-toggle" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasExample">
          <i className="fa-solid fa-bars"></i>
        </button>
        
        {/* Search Bar */}
        <div className="navbar-search">
        <div className="search-wrapper">
          <input 
            type="text" 
            className="search-input" 
            placeholder={`Search for ${placeholderText}`}
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={() => searchQuery && setShowSearchDropdown(true)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && searchQuery.trim()) {
                setShowSearchDropdown(false);
                navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
              }
            }}
          />
          {searchQuery ? (
            <i 
              className="fa-solid fa-xmark search-icon clear-icon" 
              onClick={clearSearch}
              style={{cursor: 'pointer'}}
            ></i>
          ) : (
            <i className="fa-solid fa-search search-icon"></i>
          )}
        </div>
        
        {/* Search Results Dropdown */}
        {showSearchDropdown && (
          <div className="search-dropdown">
            {isSearching ? (
              <div className="search-loading">
                <div className="spinner-border spinner-border-sm text-danger" role="status">
                  <span className="visually-hidden">Searching...</span>
                </div>
                <p>Searching...</p>
              </div>
            ) : searchResults.length > 0 ? (
              <>
                <div className="search-header">
                  <strong>{searchResults.length} product{searchResults.length !== 1 ? 's' : ''} found</strong>
                </div>
                <div className="search-results-list">
                  {searchResults.map(product => (
                    <div 
                      key={product._id}
                      className="search-result-item"
                      onClick={() => handleResultClick(product._id)}
                    >
                      <img 
                        src={`${import.meta.env.VITE_API_IMAGE}/${product.frontImg}`}
                        alt={product.title}
                        className="search-result-img"
                      />
                      <div className="search-result-info">
                        <div className="search-result-title">{product.title}</div>
                        <div className="search-result-price">₹{product.price}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="search-empty">
                <i className="fa-solid fa-search"></i>
                <p>No products found for "{searchQuery}"</p>
                <span>Try different keywords</span>
              </div>
            )}
          </div>
        )}
      </div>
      </div>
      
      {/* Center - Logo */}
      <div className="navbar-logo">
        <Link to='/'>
          <img className="logo-img" src="/img/logo.avif" alt="JELWO"/>
        </Link>
      </div>
      
      {/* Right - Icons */}
      <div className="navbar-icons-right">
        <SignedOut>
          <Link to='/sign-in' className='icon-item mobile-hide-profile' title="Sign In">
            <img src="/img/prologo.svg" alt="Profile" style={{width:'24px', height:'24px'}} />
          </Link>
        </SignedOut>
        <SignedIn>
          <Link to='/profile' className='icon-item mobile-hide-profile' title="Profile">
            <img src="/img/prologo.svg" alt="Profile" style={{width:'24px', height:'24px'}} />
          </Link>
        </SignedIn>

        {/* Mobile Search Icon — before wishlist */}
        <button className="mobile-search-icon-btn" onClick={() => setMobileSearchOpen(true)}>
          <i className="fa-solid fa-search"></i>
        </button>
        
        <Link to="/wishlist" className='icon-item' title="Wishlist">
          <div className="icon-badge-wrap">
            <img src="/img/heartlogo.svg" alt="Wishlist" style={{width:'24px', height:'24px'}} />
            <span className="badge-num">{wishlistCount}</span>
          </div>
        </Link>
        
        <div onClick={openCart} className='icon-item' title="Cart">
          <div className="icon-badge-wrap">
            <img src="/img/cartlogo.svg" alt="Cart" style={{width:'24px', height:'24px'}} />
            <span className="badge-num">{cartTotal}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</nav>
{/* Bottom Navbar - Menu Items */}
<div className="navbar-bottom">
  <div className="container-fluid">
    <div className="navbar-bottom-content">
      {/* Left - Delivery Message */}
      <div className="delivery-message">
        <span className="text-danger">Free</span> uk standard delivery on all orders.
      </div>
      
      {/* Center - Menu Items */}
      <div className="navbar-menu">
        <ul className="menu-list">
          <li className="menu-item menu-hover">
            <Link to='/' className='menu-link'>HOME</Link>
            <div className="dropdown-menu dropdown-home">
              <div className="dropdown-content">
                <div className="d-flex gap-3">
                  <div>
                    <div className="banner-img"><img src="/img/demo-menu-banner-6.webp" alt=""/></div>
                    <div className="text-center pt-3"><p>01 Classical Jewellery</p></div>
                  </div>
                  <div>
                    <div className="banner-img"><img src="/img/demo-menu-banner-1.webp" alt=""/></div>
                    <div className="text-center pt-3"><p>02 Unique jewellery</p></div>
                  </div>
                  <div>
                    <div className="banner-img"><img src="/img/demo-menu-banner-2.webp" alt=""/></div>
                    <div className="text-center pt-3"><p>03 Modern jewellery</p></div>
                  </div>
                  <div>
                    <div className="banner-img"><img src="/img/demo-menu-banner-3.webp" alt=""/></div>
                    <div className="text-center pt-3"><p>04 Traditional jewellery</p></div>
                  </div>
                  <div>
                    <div className="banner-img"><img src="/img/demo-menu-banner-4.webp" alt=""/></div>
                    <div className="text-center pt-3"><p>05 Luxury jewellary</p></div>
                  </div>
                  <div>
                    <div className="banner-img"><img src="/img/demo-menu-banner-5.webp" alt=""/></div>
                    <div className="text-center pt-3"><p>06 Classical Jewellery</p></div>
                  </div>
                </div>
              </div>
            </div>
          </li>
          
          <li className="menu-item menu-hover">
            <Link to='/showmore' className='menu-link'>SHOP</Link>
            <div className="dropdown-menu dropdown-shop-simple">
              <ul className="list-unstyled shop-simple-list">
                <li><Link to='/filter/category/Ring'>Rings</Link></li>
                <li><Link to='/filter/category/Neclace'>Necklaces</Link></li>
                <li><Link to='/filter/category/Earrings'>Earrings</Link></li>
                <li><Link to='/filter/category/Bracelets'>Bracelets</Link></li>
              </ul>
            </div>
          </li>
          
          <li className="menu-item menu-hover">
            <Link to='/collections' className='menu-link'>COLLECTIONS</Link>
            <div className="dropdown-menu dropdown-products">
              <div className="mega-menu-grid">
                <div className="mega-col">
                  <p className="mega-heading">Gender</p>
                  <ul className="list-unstyled mega-list">
                    <li><Link to='/filter/gender/Men'>Men</Link></li>
                    <li><Link to='/filter/gender/Women'>Women</Link></li>
                  </ul>
                </div>
                <div className="mega-col mega-col-border">
                  <p className="mega-heading">Occasion</p>
                  <ul className="list-unstyled mega-list">
                    <li><Link to='/filter/occasion/Party Wear'>Party Wear</Link></li>
                    <li><Link to='/filter/occasion/Daily Wear'>Daily Wear</Link></li>
                    <li><Link to='/filter/occasion/Festive Collections'>Festive Collections</Link></li>
                    <li><Link to='/filter/occasion/Wedding Collections'>Wedding Collections</Link></li>
                  </ul>
                </div>
                <div className="mega-col mega-col-border">
                  <p className="mega-heading">Collections</p>
                  <ul className="list-unstyled mega-list">
                    <li><Link to='/filter/collection/Statement Collections'>Statement Collections</Link></li>
                    <li><Link to='/filter/collection/Vintage Collections'>Vintage Collections</Link></li>
                    <li><Link to='/filter/collection/Luxury Collections'>Luxury Collections</Link></li>
                    <li><Link to='/filter/collection/Branded Collections'>Branded Collections</Link></li>
                  </ul>
                </div>
                <div className="mega-col mega-col-border">
                  <p className="mega-heading">Updates</p>
                  <ul className="list-unstyled mega-list">
                    <li><Link to='/offers'>Offers</Link></li>
                    <li><Link to='/showmore'>Buy 1 Get 1</Link></li>
                    <li><Link to='/showmore'>Best Seller</Link></li>
                    <li><Link to='/filter/new/arrivals'>New Arrivals</Link></li>
                  </ul>
                </div>
              </div>
            </div>
          </li>
          
          <li className="menu-item">
            <Link to='/blog' className='menu-link'>BLOG</Link>
          </li>
          
          <li className="menu-item menu-hover">
            <a className="menu-link">PAGES</a>
            <div className="dropdown-menu dropdown-pages">
              <ul className="list-unstyled">
                <li><Link to='/aboutus'>About Us</Link></li>
                <li><Link to='/contact'>Contact</Link></li>
                <li><Link to='/faqpage'>FAQ</Link></li>
                <li><Link to="/privacy">Privacy policy</Link></li>
                <li><Link to='/storelocation'>Store location</Link></li>
                <li><Link to='/term'>Terms & Condition</Link></li>
              </ul>
            </div>
          </li>
        </ul>
      </div>
      
      {/* Right - Offers & Free Try */}
      <div className="navbar-right-info">
        <Link to="/offers" className="offers-link">OFFERS</Link>
        <div className="free-try">
          <i className="fa-solid fa-house text-danger"></i> Free try at home
        </div>
      </div>
    </div>
  </div>
</div>
</header>
{/*offcanvas for navbar */}
    <div class="offcanvas offcanvas-start mobile-menu-offcanvas" tabIndex="-1" id="offcanvasExample" aria-labelledby="offcanvasExampleLabel">
  <div class="offcanvas-heade mobile-menu-header">
    <h5 class="offcanvas-title mobile-menu-title" id="offcanvasExampleLabel">
      <i class="fa-solid fa-bars me-2"></i>
      Menu
    </h5>
    <button type="button" class="mobile-menu-close" data-bs-dismiss="offcanvas" aria-label="Close">
      <i class="fa-solid fa-xmark"></i>
    </button>
  </div>
  <div class="offcanvas-body mobile-menu-body">
    <div class="mobile-menu-list">

      {/* Home */}
      <div class="mobile-menu-item">
        <div class="mobile-menu-link-simple" onClick={() => handleNavigation('/')}>
          <span class="menu-text">Home</span>
        </div>
      </div>

      {/* Shop */}
      <div class="mobile-menu-item">
        <div class="mobile-menu-link" onClick={() => handleMenuToggle(1)} aria-expanded={open1}>
          <span class="menu-text">Shop</span>
          <i class={`fa-solid ${open1 ? 'fa-minus' : 'fa-plus'} menu-icon`}></i>
        </div>
        <Collapse in={open1}>
          <div class="mobile-submenu">
            <div class="submenu-link" onClick={() => handleNavigation('/filter/category/Ring')}>Rings</div>
            <div class="submenu-link" onClick={() => handleNavigation('/filter/category/Neclace')}>Necklaces</div>
            <div class="submenu-link" onClick={() => handleNavigation('/filter/category/Earrings')}>Earrings</div>
            <div class="submenu-link" onClick={() => handleNavigation('/filter/category/Bracelets')}>Bracelets</div>
          </div>
        </Collapse>
      </div>

      {/* Collections */}
      <div class="mobile-menu-item">
        <div class="mobile-menu-link" onClick={() => handleMenuToggle(2)} aria-expanded={open2}>
          <span class="menu-text">Collections</span>
          <i class={`fa-solid ${open2 ? 'fa-minus' : 'fa-plus'} menu-icon`}></i>
        </div>
        <Collapse in={open2}>
          <div class="mobile-submenu">
            <div class="mobile-submenu-section">GENDER</div>
            <div class="submenu-link" onClick={() => handleNavigation('/filter/gender/Men')}>Men</div>
            <div class="submenu-link" onClick={() => handleNavigation('/filter/gender/Women')}>Women</div>
            <div class="mobile-submenu-section">OCCASION</div>
            <div class="submenu-link" onClick={() => handleNavigation('/filter/occasion/Party Wear')}>Party Wear</div>
            <div class="submenu-link" onClick={() => handleNavigation('/filter/occasion/Daily Wear')}>Daily Wear</div>
            <div class="submenu-link" onClick={() => handleNavigation('/filter/occasion/Festive Collections')}>Festive Collections</div>
            <div class="submenu-link" onClick={() => handleNavigation('/filter/occasion/Wedding Collections')}>Wedding Collections</div>
            <div class="mobile-submenu-section">COLLECTIONS</div>
            <div class="submenu-link" onClick={() => handleNavigation('/filter/collection/Statement Collections')}>Statement Collections</div>
            <div class="submenu-link" onClick={() => handleNavigation('/filter/collection/Vintage Collections')}>Vintage Collections</div>
            <div class="submenu-link" onClick={() => handleNavigation('/filter/collection/Luxury Collections')}>Luxury Collections</div>
            <div class="submenu-link" onClick={() => handleNavigation('/filter/collection/Branded Collections')}>Branded Collections</div>
          </div>
        </Collapse>
      </div>

      {/* Offers */}
      <div class="mobile-menu-item">
        <div class="mobile-menu-link-simple" onClick={() => handleNavigation('/offers')}>
          <span class="menu-text">Offers</span>
        </div>
      </div>

      {/* Blog */}
      <div class="mobile-menu-item">
        <div class="mobile-menu-link-simple" onClick={() => handleNavigation('/blog')}>
          <span class="menu-text">Blog</span>
        </div>
      </div>

      {/* Pages */}
      <div class="mobile-menu-item">
        <div class="mobile-menu-link" onClick={() => handleMenuToggle(3)} aria-expanded={open3}>
          <span class="menu-text">Pages</span>
          <i class={`fa-solid ${open3 ? 'fa-minus' : 'fa-plus'} menu-icon`}></i>
        </div>
        <Collapse in={open3}>
          <div class="mobile-submenu">
            <div class="submenu-link" onClick={() => handleNavigation('/aboutus')}>About Us</div>
            <div class="submenu-link" onClick={() => handleNavigation('/contact')}>Contact</div>
            <div class="submenu-link" onClick={() => handleNavigation('/storelocation')}>Store Location</div>
            <div class="submenu-link" onClick={() => handleNavigation('/faqpage')}>FAQ's</div>
            <div class="submenu-link" onClick={() => handleNavigation('/term')}>Terms & Conditions</div>
            <div class="submenu-link" onClick={() => handleNavigation('/privacy')}>Privacy Policy</div>
          </div>
        </Collapse>
      </div>

      {/* Profile */}
      <SignedIn>
        <div class="mobile-menu-item">
          <div class="mobile-menu-link-simple" onClick={() => handleNavigation('/profile')}>
            <span class="menu-text">
              <i class="fa-regular fa-user me-2" style={{color:'#a52a2a'}}></i>My Profile
            </span>
          </div>
        </div>
      </SignedIn>
      <SignedOut>
        <div class="mobile-menu-item">
          <div class="mobile-menu-link-simple" onClick={() => handleNavigation('/sign-in')}>
            <span class="menu-text">
              <i class="fa-regular fa-user me-2" style={{color:'#a52a2a'}}></i>Sign In
            </span>
          </div>
        </div>
      </SignedOut>
    </div>
  </div>
</div>
{/*offcanvas for navbar end */}

    </div>
{/* modal for admin login */}
   
<div class="modal  fade" id="exampleModal1" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" data-bs-backdrop="false">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content ">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel"> <i class="fa-regular fa-user"></i> Admin Login </h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
       <form onSubmit={submit} >
         <div className='admin-field'>
            <input 
            type="text" 
            placeholder=' Enter email '
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
             />
         </div>
         <div className='admin-field mt-3'>
            <input 
            type="text"
            placeholder='Enter password ' 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            />
         </div>
        <div className='text-end mt-4'>
             <button type="submit" class="btn btn-danger"> <i class="fa-solid fa-lock"></i> Login</button>
        </div>
       </form>
      </div>
    </div>
  </div>
</div>
{/* modal end */}

{/* Mobile Search Modal */}
{mobileSearchOpen && (
  <div className="mobile-search-overlay" onClick={(e) => { if (e.target.classList.contains('mobile-search-overlay')) { setMobileSearchOpen(false); clearSearch(); }}}>
    <div className="mobile-search-modal">
      <div className="mobile-search-header">
        <div className="mobile-search-input-wrap">
          <i className="fa-solid fa-search mobile-search-modal-icon"></i>
          <input
            type="text"
            className="mobile-search-modal-input"
            placeholder="Search jewellery..."
            value={searchQuery}
            onChange={handleSearchChange}
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter' && searchQuery.trim()) {
                setMobileSearchOpen(false);
                setShowSearchDropdown(false);
                navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
                clearSearch();
              }
            }}
          />
          {searchQuery && <i className="fa-solid fa-xmark mobile-search-clear" onClick={clearSearch}></i>}
        </div>
        <button className="mobile-search-close" onClick={() => { setMobileSearchOpen(false); clearSearch(); }}>Cancel</button>
      </div>

      <div className="mobile-search-results">
        {isSearching ? (
          <div className="mobile-search-loading">
            <div className="spinner-border spinner-border-sm text-danger"></div>
            <span>Searching...</span>
          </div>
        ) : searchResults.length > 0 ? (
          searchResults.map(product => (
            <div key={product._id} className="mobile-search-item" onClick={() => { handleResultClick(product._id); setMobileSearchOpen(false); }}>
              <img src={`${import.meta.env.VITE_API_IMAGE}/${product.frontImg}`} alt={product.title} />
              <div>
                <p>{product.title}</p>
                <span>₹{product.price}</span>
              </div>
            </div>
          ))
        ) : searchQuery ? (
          <div className="mobile-search-empty">
            <i className="fa-solid fa-search"></i>
            <p>No results for "{searchQuery}"</p>
          </div>
        ) : (
          <div className="mobile-search-empty">
            <i className="fa-solid fa-gem"></i>
            <p>Search for rings, necklaces, earrings...</p>
          </div>
        )}
      </div>
    </div>
  </div>
)}

   </>
  )
}

export default Navbar
