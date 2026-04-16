import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import Modal from 'react-bootstrap/Modal';
import Spinner from 'react-bootstrap/Spinner';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import axios from 'axios';
import 'swiper/css';
import 'swiper/css/navigation';
import ProductCard from '../components/ProductCard';
import videos from '../videoData';

// ─── CSS imports ───────────────────────────────────────────────
import './Home.css';

// ─── Static data ───────────────────────────────────────────────
const services = [
  { img: 'img/ser-1.png', title: 'Free Shipping',   text: 'Free Shipping All Order' },
  { img: 'img/ser-2.png', title: 'Quality Support', text: 'Contact us Anytime' },
  { img: 'img/ser-3.png', title: 'Money Return',    text: '30 days for free return' },
  { img: 'img/ser-4.png', title: 'Secure payment',  text: 'Payment card are secure' },
];

const brandSlides = [
  { img: 'img/brand-1.png',  label: 'new! Jewellery' },
  { img: 'img/brand-2.webp', label: 'new! Jewellery' },
  { img: 'img/brand-3.avif', label: 'Big! Sale' },
  { img: 'img/brand-4.webp', label: 'Flat 10% off' },
  { img: 'img/brand-5.png',  label: 'new! arrival' },
  { img: 'img/brand-6.png',  label: 'Deals! inside' },
  { img: 'img/brand-7.webp', label: 'New! arrivals' },
];

const Home = () => {
  // Modal
  const [show, setShow] = useState(false);

  // Newsletter
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterLoading, setNewsletterLoading] = useState(false);
  const [newsletterMsg, setNewsletterMsg] = useState('');

  const handleNewsletterSubscribe = async () => {
    if (!newsletterEmail.trim() || !newsletterEmail.includes('@')) {
      setNewsletterMsg('Please enter a valid email address.');
      return;
    }
    setNewsletterLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/users/newsletter-subscribe`, {
        email: newsletterEmail.trim()
      });
      setNewsletterMsg('🎉 Coupon sent! Check your email for FIRST10 — 10% off your first order.');
      setNewsletterEmail('');
    } catch (err) {
      setNewsletterMsg(err.response?.data?.message || 'Something went wrong. Try again.');
    } finally {
      setNewsletterLoading(false);
    }
  };
  // Data
  const [categories, setCategories] = useState([]);
  const [products, setProducts]     = useState([]);
  const [reviews, setReviews]       = useState([]);
  const [catLoading, setCatLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 4000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Fetch products and categories together so count is accurate
    Promise.all([
      axios.get(`${import.meta.env.VITE_API_URL}/products`),
      axios.get(`${import.meta.env.VITE_API_URL}/categories`),
    ]).then(([prodRes, catRes]) => {
      const allProducts = prodRes.data || [];
      setProducts(allProducts);

      // Calculate real product count per category
      const cats = (catRes.data || []).map(cat => ({
        ...cat,
        item: allProducts.filter(p =>
          p.category?._id === cat._id || p.category === cat._id
        ).length
      }));
      setCategories(cats);
      setCatLoading(false);
    }).catch(() => setCatLoading(false));

    axios.get(`${import.meta.env.VITE_API_URL}/reviews`)
      .then(res => setReviews(res.data))
      .catch(err => console.log(err));
  }, []);

  const swiperBreakpoints = {
    320: { slidesPerView: 1 }, 450: { slidesPerView: 1 },
    562: { slidesPerView: 2 }, 900: { slidesPerView: 3 }, 1200: { slidesPerView: 4 },
  };

  return (
    <div>

      {/* ── HERO ── */}
      <section>
        <div className="main-section">
          <div className="main-relative">
            <img className="w-100" src="img/jelwo-6-slider-1.webp" alt="" />
            <div className="container-section main-absolute">
              <div className="row">
                <div className="col">
                  <h1 data-aos="fade-right" data-aos-duration="1000">Luxury in <br /> Every details</h1>
                  <p data-aos="fade-left" data-aos-duration="1000">Golden deals you can't miss!</p>
                  <Link to="/showmore"><button data-aos="fade-right" data-aos-duration="2500" className="btn btn-danger">SHOP NOW</button></Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <div className="border-bottom border-secondary">
        <div className="container-section pt-5 pb-5">
          <div className="card-section">
            {services.map((s, i) => (
              <div className="service-box" key={i} data-aos="fade-up" data-aos-delay={i * 100}>
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: 'linear' }} className="service-icon-wrapper">
                  <img className="service-icon" src={s.img} alt={s.title} />
                </motion.div>
                <h6 className="service-title">{s.title}</h6>
                <p className="service-text">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CATEGORIES ── */}
      <div>
        <div className="conatiner-section">
          <div className="text-center pb-4"><h1 data-aos="fade-up">Jewellery Categories</h1></div>
          {catLoading
            ? <div className="text-center pt-2 pb-2"><Spinner animation="border" role="status"><span className="visually-hidden">Loading...</span></Spinner></div>
            : <Swiper modules={[Autoplay]} autoplay={{ delay: 2000, disableOnInteraction: false }} spaceBetween={30} slidesPerView={5}
                breakpoints={{ 320: { slidesPerView: 1 }, 370: { slidesPerView: 2 }, 600: { slidesPerView: 3 }, 900: { slidesPerView: 4 }, 1200: { slidesPerView: 5 } }}
                className="mySwiper">
                {categories.map(item => (
                  <SwiperSlide key={item._id}>
                    <div data-aos="zoom-in" data-aos-duration="1000" className="card-banner text-center">
                      <img className="w-100 back" src="img/cat-bg.avif" alt="" />
                      <Link to="/showmore">
                        <div className="card-content"><img className="w-100" src={`${import.meta.env.VITE_API_IMAGE}/${item.image}`} alt="" /></div>
                      </Link>
                      <div className="fs-4"><span className="name">{item.name}</span></div>
                      <div className="pre-count">{`${item.item || 0} + items`}</div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
          }
        </div>
      </div>

      {/* ── ARRIVAL BANNERS ── */}
      <div className="container-section pt-4 pb-4">
        <div className="row justify-content-center">
          <div data-aos="zoom-in" data-aos-duration="1000" className="col-12 col-lg-8 p-3">
            <div className="momentum-top">
              <picture>
                <source className="w-100 design" media="(max-width:600px)" srcSet="img/jelwo-6-mobile-since-banner.webp" />
                <img className="w-100 design" src="img/momentum.webp" alt="" />
                <div className="momentum-bottom text-white">
                  <h2 data-aos="fade-up">Moments captured in gold & stone</h2>
                  <p data-aos="fade-up" className="fs-5">Jewellery isn't just something you wear — it's a memory, a milestone, a message.</p>
                  <div data-aos="flip-right"><Link to="/showmore"><button className="btn1 btn-m">EXPLORE NOW</button></Link></div>
                </div>
              </picture>
            </div>
          </div>
          <div className="col-12 col-lg-4 p-3">
            <div data-aos="zoom-in" data-aos-duration="1000" className="arrival-top">
              <img className="w-100 design" src="img/arrival.webp" alt="" />
              <div className="arrival-bottom text-center text-white w-100">
                <p data-aos="fade-up" className="fs-5">Jewellery deals that sparkle!</p>
                <h2 data-aos="fade-up">New arrivals that glow</h2>
                <div data-aos="flip-left"><Link to="/showmore"><button className="btn1">SHOP NOW</button></Link></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── LUXURY PRODUCTS ── */}
      <div className="container-section border-bottom">
        <div className="text-center luxury-top pt-4 pb-4">
          <h2 data-aos="fade-up">Luxury product</h2>
          <ul className="list-unstyled d-flex flex-wrap justify-content-center align-items-center gap-4 mt-3 order">
            <li>Bracelets</li><i className="fa-solid fa-star-of-life"></i>
            <li>Necklace</li><i className="fa-solid fa-star-of-life"></i>
            <li>Earring</li>
          </ul>
        </div>
        <div className="luxury-bottom pb-5">
          <Swiper modules={[Autoplay, Navigation]} autoplay={{ delay: 3000, disableOnInteraction: false }} spaceBetween={20} slidesPerView={5} breakpoints={swiperBreakpoints} className="mySwiper">
            {products.map(product => (
              <SwiperSlide key={product._id}>
                <div data-aos="zoom-out" data-aos-duration="1000"><ProductCard product={product} onScrollTop /></div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {/* ── BRANDS ── */}
      <div className="brand">
        <div data-aos="fade-up" className="container-section pt-5 pb-5">
          <Swiper modules={[Autoplay]} autoplay={{ delay: 2000, disableOnInteraction: false }} spaceBetween={30} slidesPerView={5} loop
            breakpoints={{ 320: { slidesPerView: 1 }, 375: { slidesPerView: 2 }, 762: { slidesPerView: 3 }, 900: { slidesPerView: 4 }, 1200: { slidesPerView: 5 } }}
            className="mySwiper">
            {brandSlides.map((b, i) => (
              <SwiperSlide key={i}>
                <div className="brand-card">
                  <div className="brand-hover text-center"><span className="brand-span">{b.label}</span></div>
                  <div><img className="w-100 brand-img" src={b.img} alt="" /></div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {/* ── VIDEO SECTION ── */}
      <div className="container-section mt-3 mb-3">
        <div className="row justify-content-center pt-4 pb-4">
          {[
            { top: 'img/traditional.webp', text: 'Jewellery that tells your story with sparkle' },
            null,
            { top: 'img/handcraft.webp',   text: 'A little shine for your biggest moments' },
          ].map((item, i) => (
            <div key={i} className={`col-12 col-sm-6 col-lg-4 mb-4 mb-sm-0 order-${i === 2 ? '2 order-sm-3 mb-4' : i === 1 ? '3 order-sm-2' : '1'}`}>
              {item ? (
                <div className="traditional">
                  <div className="tradition-top"><img className="w-100 top" src={item.top} alt="" /></div>
                  <div className="tradition-bottom">
                    <img className="w-100 bottom" src="img/traditional-back.webp" alt="" />
                    <div className="tradition-content text-center text-white ps-4 pe-4 w-100">
                      <h4 data-aos="fade-up">{item.text}</h4>
                      <div><Link to="/showmore" className="text-decoration-none"><button data-aos="fade-up" className="btn1">SHOP NOW</button></Link></div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="traditional">
                  <a href=""><img className="w-100 video" src="img/video.webp" alt="" /></a>
                  <div className="text-white text-center video-rel">
                    <a href="https://www.youtube.com/watch?v=QaNrBVqmsNc"><span className="play-btn"><i className="fa-solid fa-play"></i></span></a>
                    <h2 data-aos="fade-up" className="mt-5">Watch Video</h2>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── NEW ARRIVALS CAROUSEL ── */}
      <div className="container-section border-bottom">
        <div className="text-center luxury-top pt-4 pb-4"><h2 data-aos="fade-up">New Arrivals</h2></div>
        <div className="luxury-bottom pb-5">
          <Swiper modules={[Autoplay]} autoplay={{ delay: 3000, disableOnInteraction: false }} spaceBetween={20} slidesPerView={4} breakpoints={swiperBreakpoints} className="mySwiper">
            {products.map(product => (
              <SwiperSlide key={product._id}>
                <div data-aos="zoom-in" data-aos-duration="2000"><ProductCard product={product} onScrollTop /></div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {/* ── REVIEWS + NEWSLETTER ── */}
      <div className="container-section pt-5 pb-5 border-top">
        <div className="customer">
          <div data-aos="fade-up" className="text-center pb-5"><h1>Customer love</h1></div>
        </div>
        <Swiper modules={[Autoplay]} autoplay={{ delay: 2000, disableOnInteraction: false }} spaceBetween={20} slidesPerView={3}
          breakpoints={{ 320: { slidesPerView: 1 }, 762: { slidesPerView: 2 }, 1200: { slidesPerView: 3 } }} className="mySwiper">
          {reviews.map(review => (
            <SwiperSlide key={review._id}>
              <div data-aos="zoom-in" data-aos-duration="1000" className="user">
                <div className="row justify-content-center align-items-center p-4">
                  <div className="d-flex align-items-center gap-2">
                    <div><img className="w-100 user-img" src={review.img} alt="" /></div>
                    <div>
                      <h5>{review.name}</h5>
                      <Stack spacing={1}><Rating name="half-rating-read" defaultValue={review.rating} precision={0.5} readOnly /></Stack>
                    </div>
                  </div>
                  <div className="mt-3"><p>{review.description}</p></div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* ── NEWSLETTER BANNER ── */}
      <div className="container-section banner mt-5 mb-5">
        <div className="row justify-content-center search-banner">
          <div className="col-12 col-md-6 text-center pt-5 pb-5">
            <h1>Sign up for our newsletter to receive special offers.</h1>
            <div className="search-top mt-4 mb-4">
              <input className="w-100 search-bar" type="text" placeholder="Enter your email" />
              <div className="search-bottom"><button className="sub">SUBSCRIBE</button></div>
            </div>
            <div>
              <input type="checkbox" id="terms" name="terms" />
              <label htmlFor="terms">I have read and agree with the <span className="fw-bold">Terms and condition</span></label>
            </div>
          </div>
        </div>
      </div>

      {/* ── WATCH & SHOP REELS ── */}
      <div className="container-section mt-5 mb-5">
        <div className="text-center pt-3 pb-5"><h2 data-aos="fade-up">Watch & Shop Reels</h2></div>
        <Swiper modules={[Autoplay]} autoplay={{ delay: 2000, disableOnInteraction: false }} spaceBetween={20} slidesPerView={5}
          breakpoints={{ 320: { slidesPerView: 1 }, 375: { slidesPerView: 2 }, 762: { slidesPerView: 2 }, 900: { slidesPerView: 3 }, 1200: { slidesPerView: 5 } }}
          className="mySwiper">
          {videos.map(video => (
            <SwiperSlide key={video.id}>
              <div data-aos="zoom-out" data-aos-duration="1000" className="video1">
                <div>
                  <video autoPlay loop muted playsInline className="w-100 video-auto">
                    <source src={video.screen} type="video/mp4" />
                  </video>
                </div>
                <div className="p-3 video-abs">
                  <div className="row text-white justify-content-center align-items-center">
                    
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* ── NEWSLETTER MODAL ── */}
      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton />
        <Modal.Body>
          <div>
            <div className="modal-nl-inner">
              <h5 className="text-center">Don't miss a thing</h5>
              <div className="text-center"><h1>Join Our newsletter and get 10% off your first order</h1></div>
              <div className="search-bar">
                <div className="subrel">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={newsletterEmail}
                    onChange={e => { setNewsletterEmail(e.target.value); setNewsletterMsg(''); }}
                  />
                  <div className="subs">
                    <button
                      className="subs-btn"
                      onClick={handleNewsletterSubscribe}
                      disabled={newsletterLoading}
                    >
                      {newsletterLoading ? 'Sending...' : 'SUBSCRIBE'}
                    </button>
                  </div>
                </div>
              </div>
              {newsletterMsg && (
                <p style={{textAlign:'center', marginTop:'10px', color: newsletterMsg.includes('sent') ? '#16a34a' : '#ef4444', fontSize:'14px', fontWeight:500}}>
                  {newsletterMsg}
                </p>
              )}
            </div>
            <div className="p-2"><img className="w-100 rounded-3" src="img/modalimg.webp" alt="" /></div>
          </div>
        </Modal.Body>
      </Modal>

    </div>
  );
};

export default Home;
