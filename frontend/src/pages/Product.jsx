import { useParams, useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Link } from 'react-router-dom';
import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";
import ProductCard from '../components/ProductCard';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import React, { useState, useEffect, useContext } from 'react';
import { FreeMode, Navigation, Thumbs, Autoplay as SwiperAutoplay } from 'swiper/modules'
import './Product.css'
import { useCart } from "../Context/CartContext";
import { useBuynow } from "../Context/BuynowContext";
import { WishlistContext } from "../Context/WhishlistContext";

const VideoSlide = ({ src }) => {
  const videoRef = React.useRef(null);
  const [playing, setPlaying] = React.useState(false);
  const isGif = src?.toLowerCase().endsWith('.gif');

  const toggle = () => {
    if (!videoRef.current) return;
    if (playing) { videoRef.current.pause(); setPlaying(false); }
    else { videoRef.current.play(); setPlaying(true); }
  };

  if (isGif) {
    return (
      <div className="video-slide-wrapper">
        <img src={src} alt="product gif" style={{width:'100%', height:'100%', objectFit:'cover', borderRadius:'16px'}} />
      </div>
    );
  }

  return (
    <div className="video-slide-wrapper" onClick={toggle}>
      <video
        ref={videoRef}
        src={src}
        muted
        loop
        playsInline
        onEnded={() => setPlaying(false)}
        style={{width:'100%', height:'100%', objectFit:'cover', borderRadius:'16px'}}
      />
      <div className={`video-play-btn ${playing ? 'playing' : ''}`}>
        <i className={`fa-solid ${playing ? 'fa-pause' : 'fa-play'}`}></i>
      </div>
    </div>
  );
};

const Product = () => {
     const { openCart, addToCart } = useCart();
     const { addBuyNow } = useBuynow();
     const { wishlist, toggleWishlist } = useContext(WishlistContext);
     const navigate = useNavigate();
     const { id } = useParams();
     
    //state for product
     const [product, setProduct] = useState(null);
     const [loading, setLoading] = useState(true);
     const [coupons, setCoupons] = useState([]);
     const [copiedCode, setCopiedCode] = useState(null);
     const copyTimeoutRef = React.useRef(null);
     const [error, setError] = useState(null);
      // function for increment
  const increment = () =>{
     setCount(count + 1);
  }
  // function for decrement
  const decrement = () =>{
     if(count > 1){
          setCount(count - 1);
     }
  }
  const handleAdd = () => {
    if (product) {
      const success = addToCart({...product, qty: count, selectedSize: size, selectedColor: color}, navigate);
      if (success) {
        openCart(); // open global offcanvas
      }
    }
  };
   // state for a size
    const [size, setSize] = useState("2-12")
    const [color, setColor] = useState("")
    const [variants, setVariants] = useState([])
    const [relatedProducts, setRelatedProducts] = useState([])
    const [thumbsSwiper, setThumbsSwiper] = useState(null);
    const [openAccordion, setOpenAccordion] = useState(null);
    const toggleAccordion = (key) => setOpenAccordion(prev => prev === key ? null : key);
  // state for count
     const [count, setCount] = useState(1);

  // Real countdown timer — 24h sale
  const [timeLeft, setTimeLeft] = useState(() => {
    const end = localStorage.getItem('saleEndTime');
    if (end && Date.now() < Number(end)) {
      return Math.floor((Number(end) - Date.now()) / 1000);
    }
    const newEnd = Date.now() + 24 * 60 * 60 * 1000;
    localStorage.setItem('saleEndTime', newEnd);
    return 24 * 60 * 60;
  });

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          const newEnd = Date.now() + 24 * 60 * 60 * 1000;
          localStorage.setItem('saleEndTime', newEnd);
          return 24 * 60 * 60;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (secs) => {
    const h = String(Math.floor(secs / 3600)).padStart(2, '0');
    const m = String(Math.floor((secs % 3600) / 60)).padStart(2, '0');
    const s = String(secs % 60).padStart(2, '0');
    return `${h}:${m}:${s}`;
  };
     
     // Fetch product data
      useEffect(() => {
        // Fetch active coupons
        fetch(`${import.meta.env.VITE_API_URL}/coupons/active`)
          .then(r => r.json())
          .then(data => setCoupons(data.coupons || []))
          .catch(() => {});

        setLoading(true);
        setError(null);
        setProduct(null);
        setThumbsSwiper(null);
        setCount(1);
        setSize("2-12");
        setVariants([]);
        setRelatedProducts([]);
        fetch(`${import.meta.env.VITE_API_URL}/products/${id}`)
          .then(res => {
            if (!res.ok) throw new Error('Product not found');
            return res.json();
          })
          .then(data => {
            setProduct(data);
            setColor(data.metalColor || 'Yellow Gold');
            // Fetch color variants if variantGroup is set
            if (data.variantGroup) {
              fetch(`${import.meta.env.VITE_API_URL}/products/variants/${data.variantGroup}`)
                .then(r => r.json())
                .then(v => setVariants(v))
                .catch(() => setVariants([]));
            }
            // Fetch related products from same category
            if (data.category?._id) {
              fetch(`${import.meta.env.VITE_API_URL}/products`)
                .then(r => r.json())
                .then(all => {
                  const related = all.filter(p => 
                    p.category?._id === data.category._id && p._id !== data._id
                  ).slice(0, 6);
                  setRelatedProducts(related);
                })
                .catch(() => {});
            }
            setLoading(false);
          })
          .catch(err => {
            console.error('Error fetching product:', err);
            setError(err.message);
            setLoading(false);
          });
      }, [id]);
      
      // Handle Buy Now
      const handleBuyNow = () => {
        if (product) {
          addBuyNow({...product, qty: count, selectedSize: size, selectedColor: color});
          navigate("/buynow");
        }
      };
      
      // Check if product is in wishlist
      const isInWishlist = wishlist.some(item => item._id === product?._id);

      // Handle Share
      const handleShare = async () => {
        const shareData = {
          title: product.title,
          text: `Check out ${product.title} - Rs. ${product.price}`,
          url: window.location.href
        };

        try {
          // Check if Web Share API is supported
          if (navigator.share) {
            await navigator.share(shareData);
          } else {
            // Fallback: Copy link to clipboard
            await navigator.clipboard.writeText(window.location.href);
            alert('Product link copied to clipboard!');
          }
        } catch (err) {
          // If user cancels or error occurs
          if (err.name !== 'AbortError') {
            console.error('Error sharing:', err);
            // Fallback: Copy to clipboard
            try {
              await navigator.clipboard.writeText(window.location.href);
              alert('Product link copied to clipboard!');
            } catch (clipboardErr) {
              console.error('Clipboard error:', clipboardErr);
            }
          }
        }
      };

  if (loading) return (
    <div className="text-center p-5">
      <div className="spinner-border text-danger" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="mt-3">Loading product details...</p>
    </div>
  );
  
  if (error) return (
    <div className="text-center p-5">
      <h3 className="text-danger">Error: {error}</h3>
      <Link to="/collections" className="btn btn-primary mt-3">Back to Shop</Link>
    </div>
  );
  
  if (!product) return (
    <div className="text-center p-5">
      <h3>Product not found</h3>
      <Link to="/collections" className="btn btn-primary mt-3">Back to Shop</Link>
    </div>
  );
  return (
    <div>
        <div className="container-section ">
            <div><p className="mt-5 mb-4 breadcrumb-text"><Link to="/" style={{color:'inherit',textDecoration:'none'}}>HOME</Link> / {product.title.toUpperCase()}</p></div>
                <div className="row mb-5 ">
                    <div className="col-12 col-lg-6 ">
                        <div style={{position: 'sticky', top: '20px'}}>
                           <Swiper
                                    key={`main-${id}`}
                                    loop={true}
                                    spaceBetween={10}
                                    navigation={{
                                                prevEl:".prev1",
                                                nextEl:".next1",
                                              }} 
                                    thumbs={{ swiper: thumbsSwiper }}
                                    modules={[FreeMode, Navigation,  Thumbs]}
                                    className="mySwiper2"
                                >
                                    <SwiperSlide className='swiper-slide1'>
                                      <img src={`${import.meta.env.VITE_API_IMAGE}/${product.frontImg}`} alt={product.title + ' front'}/>
                                    </SwiperSlide>
                                    <SwiperSlide className='swiper-slide1'>
                                      <img src={`${import.meta.env.VITE_API_IMAGE}/${product.backImg}`} alt={product.title + ' back'} />
                                    </SwiperSlide>
                                    {product.additionalImages && product.additionalImages.map((img, i) => (
                                      <SwiperSlide key={i} className='swiper-slide1'>
                                        <img src={`${import.meta.env.VITE_API_IMAGE}/${img}`} alt={`${product.title} view ${i + 3}`} />
                                      </SwiperSlide>
                                    ))}
                                    {product.video && (
                                      <SwiperSlide className='swiper-slide1'>
                                        <VideoSlide src={`${import.meta.env.VITE_API_IMAGE}/${product.video}`} />
                                      </SwiperSlide>
                                    )}
                                    <div className="swiper-button-prev prev1 fs-5">
                                        <i className="fa-solid fa-arrow-left"></i>
                                    </div>
                                    <div className="swiper-button-next next1 fs-5">
                                        <i className="fa-solid fa-arrow-right"></i>
                                    </div>
                                </Swiper>
                                <Swiper
                                    key={`thumb-${id}`}
                                    onSwiper={setThumbsSwiper}
                                    loop={true}
                                    spaceBetween={8}
                                    slidesPerView={4}
                                    freeMode={true}
                                    watchSlidesProgress={true}
                                    modules={[FreeMode, Navigation, Thumbs]}
                                    className="mySwiper"
                                >
                                    <SwiperSlide className='swiper-slide1'>
                                      <img src={`${import.meta.env.VITE_API_IMAGE}/${product.frontImg}`} alt="Thumbnail 1" />
                                    </SwiperSlide>
                                    <SwiperSlide className='swiper-slide1'>
                                      <img src={`${import.meta.env.VITE_API_IMAGE}/${product.backImg}`} alt="Thumbnail 2" />
                                    </SwiperSlide>
                                    {product.additionalImages && product.additionalImages.map((img, i) => (
                                      <SwiperSlide key={i} className='swiper-slide1'>
                                        <img src={`${import.meta.env.VITE_API_IMAGE}/${img}`} alt={`Thumbnail ${i + 3}`} />
                                      </SwiperSlide>
                                    ))}
                                    {product.video && (
                                      <SwiperSlide className='swiper-slide1'>
                                        <div className="video-thumb-wrapper">
                                          {product.video.toLowerCase().endsWith('.gif')
                                            ? <img src={`${import.meta.env.VITE_API_IMAGE}/${product.video}`} alt="GIF" style={{width:'100%', height:'100%', objectFit:'cover', borderRadius:'8px', display:'block'}} />
                                            : <>
                                                <video src={`${import.meta.env.VITE_API_IMAGE}/${product.video}`} muted playsInline preload="metadata" style={{width:'100%', height:'100%', objectFit:'cover', borderRadius:'8px', display:'block'}} />
                                                <div className="video-thumb-play"><i className="fa-solid fa-play"></i></div>
                                              </>
                                          }
                                        </div>
                                      </SwiperSlide>
                                    )}
                                </Swiper>
                         </div>
                     </div>  

                     <div className="col-12 col-lg-6  ps-3 ps-lg-5">
                    
                        <div className="product-title-row">
                          <h1 className="product-title">{product.title}</h1>
                          <div className="product-rating-inline">
                            <Box sx={{ "& > legend": { mt: 0 } }}>
                              <Rating name="product-rating" value={product.rating} readOnly size="small" precision={0.5} />
                            </Box>
                            <span className="product-rating-count">({product.rating || 0})</span>
                          </div>
                        </div>
                        
                        <div className="product-price-row">
                          <span className="product-mrp">MRP  <del>₹{product.price + (product.discount || 0)}</del></span>
                          <span className="product-sale-price">₹{product.price}</span>
                          {product.discountPercentage > 0 && (
                            <span className="product-save-badge">SAVE {product.discountPercentage}%</span>
                          )}
                        </div>
                        <p className="product-tax-note">Inclusive of all taxes</p>
                        
                        <div className="border-divider">
                            <div className={`stock-indicator ${product.stock === 0 ? 'out-of-stock' : product.stock < 10 ? 'low-stock' : 'in-stock'}`}>
                                <div className="color"></div>
                                <span>
                                  {product.stock === 0 ? 'Out of Stock' : `${product.stock} in stock`}
                                </span>
                            </div>
                        </div>
                        
                        <div className="count mt-3 mb-3">
                            <h6>Hurry up! Sales ends in : {formatTime(timeLeft)}</h6>
                        </div>

                        {/* ── Coupon Deals ── */}
                        {coupons.length > 0 && (
                        <div className="coupon-section">
                          <div className="coupon-heading">
                            <span className="coupon-icon">%</span>
                            <span className="coupon-title">Offers For You <span className="coupon-subtitle">(Can be applied at checkout)</span></span>
                          </div>
                          <div className="coupon-swiper-wrap">
                            <Swiper
                              modules={[SwiperAutoplay]}
                              spaceBetween={14}
                              slidesPerView={1.6}
                              breakpoints={{
                                320:  { slidesPerView: 1.1 },
                                480:  { slidesPerView: 1.4 },
                                640:  { slidesPerView: 1.7 },
                                900:  { slidesPerView: 2.1 },
                                1200: { slidesPerView: 2.4 },
                              }}
                            >
                              {coupons.map(c => (
                                <SwiperSlide key={c._id || c.code} style={{height:'auto'}}>
                                  <div className="coupon-card">
                                    <p className="coupon-card-title">
                                      {c.discountType === 'percentage'
                                        ? `Get ${c.discountValue}% Off`
                                        : `Get Flat ₹${c.discountValue} Off`}
                                      {c.minOrder > 0 ? ` on orders above ₹${c.minOrder}` : ''}
                                    </p>
                                    <p className="coupon-card-note">
                                      {c.minOrder > 0 ? `Min order: ₹${c.minOrder}` : 'No minimum order required.'}
                                    </p>
                                    <div className="coupon-code-row">
                                      <span className="coupon-code">{c.code}</span>
                                      <button
                                        className="coupon-copy-btn"
                                        onClick={() => {
                                          navigator.clipboard.writeText(c.code);
                                          setCopiedCode(c.code);
                                          if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
                                          copyTimeoutRef.current = setTimeout(() => setCopiedCode(null), 1500);
                                        }}
                                        title="Copy code"
                                      >
                                        {copiedCode === c.code
                                          ? <span className="coupon-copied-text">Copied</span>
                                          : <i className="fa-regular fa-copy"></i>
                                        }
                                      </button>
                                    </div>
                                  </div>
                                </SwiperSlide>
                              ))}
                            </Swiper>
                          </div>
                        </div>
                        )}                           <div className="size-selector-wrapper">
                                <span className="size-label">Select Size: {size}</span>
                                <div className="d-flex flex-wrap gap-2">
                                  <button onClick={() =>{setSize("2-12")}} className={`size ${ size === "2-12" ? "set" : ""}`}>2-12</button>
                                  <button onClick={() =>{setSize("2-14")}} className={`size ${ size === "2-14" ? "set" : ""}`}>2-14</button>
                                  <button onClick={() =>{setSize("2-16")}} className={`size ${ size === "2-16" ? "set" : ""}`}>2-16</button>
                                </div>
                              </div>
                              <div className="color-selector-wrapper">
                                <span className="size-label">Color: <span className="color-label-value">{color}</span></span>
                                <div className="d-flex gap-2">
                                  {variants.length > 1 ? (
                                    variants.map(v => (
                                      <button
                                        key={v._id}
                                        onClick={() => { window.scrollTo({top: 0, behavior: 'smooth'}); navigate(`/product/${v._id}`); }}
                                        className={`color-swatch ${
                                          v.metalColor === 'Rose Gold' ? 'rose-gold-swatch' :
                                          v.metalColor === 'White Gold' ? 'white-gold-swatch' :
                                          'gold-swatch'
                                        } ${v._id === product._id ? 'active' : ''}`}
                                        title={v.metalColor}
                                      />
                                    ))
                                  ) : (
                                    // No variants — show single swatch for current color
                                    <button
                                      className={`color-swatch active ${
                                        color === 'Rose Gold' ? 'rose-gold-swatch' :
                                        color === 'White Gold' ? 'white-gold-swatch' :
                                        'gold-swatch'
                                      }`}
                                      title={color}
                                    />
                                  )}
                                </div>
                              </div>

                            <div className="d-flex align-items-center gap-3 mb-4">
                                <span className="fw-bold" style={{color: '#374151'}}>Quantity:</span>
                                <div className="counter-btn">
                                    <button className="btn-3" onClick={decrement}><i className="fa-solid fa-minus"></i></button>
                                    <span id="count">{count}</span>
                                    <button className="btn-3" onClick={increment}><i className="fa-solid fa-plus"></i></button>
                                </div>
                            </div>
                            
                            <div className="action-buttons">
                                <div className="w-100">
                                  <button 
                                    onClick={handleAdd} 
                                    className="add w-100"
                                    disabled={product.stock === 0}
                                    style={product.stock === 0 ? {opacity: 0.5, cursor: 'not-allowed'} : {}}
                                  >
                                    <i className="fa-solid fa-cart-shopping me-2"></i>
                                    {product.stock === 0 ? 'OUT OF STOCK' : 'ADD TO CART'}
                                  </button>
                                </div>
                                <div className="w-100">
                                  <button 
                                    onClick={handleBuyNow} 
                                    className="add w-100" 
                                    style={product.stock === 0 ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                                    disabled={product.stock === 0}
                                  >
                                    <i className="fa-solid fa-bolt me-2"></i>
                                    BUY IT NOW
                                  </button>
                                </div>
                            </div>
                            <div className="mt-3 mb-3">
                                <ul className="list-unstyled brand d-flex  justify-content-between flex-wrap">
                                    <li 
                                      onClick={(e) => { e.preventDefault(); toggleWishlist(product, navigate); }}
                                      style={{cursor: 'pointer'}}
                                    > 
                                      <i class={isInWishlist ? "fa-solid fa-heart text-danger" : "fa-regular fa-heart"}></i> 
                                      {isInWishlist ? 'IN WISHLIST' : 'ADD TO WISHLIST'}
                                    </li>
                                    <li style={{cursor: 'pointer'}}> <i className="fa-solid fa-book"></i> SIZEGUIDE</li>
                                    <li style={{cursor: 'pointer'}}> <i className="fa-solid fa-book-open-reader"></i> QUESTION</li>
                                    <li onClick={handleShare} style={{cursor: 'pointer'}}> <i className="fa-solid fa-share-nodes"></i> SHARE</li>
                                </ul>
                            </div>

                            <div className="delivery-info">
                                <p><span>🚚 Delivery:</span> Estimated delivery time: 5-7 days</p>
                                <p><span>↩️ Returns:</span> Within 45 days of purchase</p>
                                <p className="mb-0"><span>📦 SKU:</span> 445</p>
                            </div>
                            <div className="payment-card">
                               <h6>Payment & Security</h6>
                               <ul className="list-unstyled d-flex  gap-3 payment">
                                <li><img src="/img/visa.png" alt=""/></li>
                                <li><img src="/img/paypal.png" alt=""/></li>
                                <li><img src="/img/contactless.png" alt=""/></li>
                                <li><img src="/img/discover.png" alt=""/></li>
                               </ul>
                               <p>Your payment information is processed securely. We do not store credit card details nor have access to your credit card information.</p>
                            </div>
                            <div className="icon-card d-flex justify-content-between">
                                <div className="text-center icon-card-item">
                                    <div className="icon-circle"><img src="/img/return.png" alt="Return" className="icon-img" /></div>
                                    <h6>2 Days Return</h6>
                                </div>
                                <div className="text-center icon-card-item icon-card-middle">
                                    <div className="icon-circle"><img src="/img/Exchange.png" alt="Exchange" className="icon-img" /></div>
                                    <h6>10 Days Exchange</h6>
                                </div>
                                <div className="text-center icon-card-item">
                                    <div className="icon-circle"><img src="/img/COD.png" alt="Cash On Delivery" className="icon-img" /></div>
                                    <h6>Cash On Delivery</h6>
                                </div>
                            </div>
                        </div>  
               </div>
               
               {/* Product Details Accordion Section */}
               <div className="row mt-5">
                 <div className="col-12">
                   <div className="custom-accordion">

                     {/* Metal Details */}
                     <div className="ca-item">
                       <div className="ca-header" onClick={() => toggleAccordion('metal')}>
                         <span className="ca-title">METAL DETAILS</span>
                         <span className="ca-icon">{openAccordion === 'metal' ? '−' : '+'}</span>
                       </div>
                       {openAccordion === 'metal' && (
                         <div className="ca-body">
                           <div className="row g-4">
                             <div className="col-md-3 col-6">
                               <h5 className="fw-bold mb-1">{product.karatage || '22K'}</h5>
                               <p className="text-muted mb-0">Karatage</p>
                             </div>
                             <div className="col-md-3 col-6">
                               <h5 className="fw-bold mb-1">{product.metalColor || 'Yellow'}</h5>
                               <p className="text-muted mb-0">Material Colour</p>
                             </div>
                             <div className="col-md-3 col-6">
                               <h5 className="fw-bold mb-1">{product.grossWeight || '—'}</h5>
                               <p className="text-muted mb-0">Gross Weight</p>
                             </div>
                             <div className="col-md-3 col-6">
                               <h5 className="fw-bold mb-1">{product.metal || 'Gold'}</h5>
                               <p className="text-muted mb-0">Metal</p>
                             </div>
                           </div>
                         </div>
                       )}
                     </div>

                     {/* General Details */}
                     <div className="ca-item">
                       <div className="ca-header" onClick={() => toggleAccordion('general')}>
                         <span className="ca-title">GENERAL DETAILS</span>
                         <span className="ca-icon">{openAccordion === 'general' ? '−' : '+'}</span>
                       </div>
                       {openAccordion === 'general' && (
                         <div className="ca-body">
                           <div className="row g-4">
                             <div className="col-md-6">
                               <p className="mb-2"><span className="fw-semibold">Collection:</span> Traditional</p>
                               <p className="mb-2"><span className="fw-semibold">Gender:</span> Women</p>
                               <p className="mb-2"><span className="fw-semibold">Occasion:</span> Wedding, Festival, Party</p>
                             </div>
                             <div className="col-md-6">
                               <p className="mb-2"><span className="fw-semibold">Product Type:</span> {product.category?.name || 'Jewelry'}</p>
                               <p className="mb-2"><span className="fw-semibold">Style:</span> Ethnic</p>
                               <p className="mb-2"><span className="fw-semibold">Warranty:</span> 1 Year Manufacturer Warranty</p>
                             </div>
                           </div>
                         </div>
                       )}
                     </div>

                     {/* Description */}
                     <div className="ca-item">
                       <div className="ca-header" onClick={() => toggleAccordion('desc')}>
                         <span className="ca-title">DESCRIPTION</span>
                         <span className="ca-icon">{openAccordion === 'desc' ? '−' : '+'}</span>
                       </div>
                       {openAccordion === 'desc' && (
                         <div className="ca-body">
                           {product.description
                             ? <p style={{lineHeight:'1.8', color:'#374151'}}>{product.description}</p>
                             : <p style={{color:'#9ca3af', fontStyle:'italic'}}>No description available.</p>
                           }
                         </div>
                       )}
                     </div>

                   </div>
                 </div>
               </div>

               {/* Related Products */}
               {relatedProducts.length > 0 && (
                 <div className="related-section">
                   <h3 className="related-title">Related Products</h3>
                   <Swiper
                     spaceBetween={16}
                     slidesPerView={3}
                     loop={relatedProducts.length > 4}
                     navigation={{ prevEl: '.rel-prev', nextEl: '.rel-next' }}
                     modules={[Navigation, FreeMode]}
                     breakpoints={{
                       0:   { slidesPerView: 1 },
                       768: { slidesPerView: 3 },
                       1024: { slidesPerView: 4 },
                     }}
                     className="related-swiper"
                   >
                     {relatedProducts.map(rp => (
                       <SwiperSlide key={rp._id}>
                         <ProductCard product={rp} onScrollTop />
                       </SwiperSlide>
                     ))}
                   </Swiper>
                   <div className="rel-prev related-nav-btn"><i className="fa-solid fa-arrow-left"></i></div>
                   <div className="rel-next related-nav-btn"><i className="fa-solid fa-arrow-right"></i></div>
                 </div>
               )}

        </div>
    </div>
        
  )
}

export default Product
