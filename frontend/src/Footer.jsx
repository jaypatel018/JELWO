import { useState } from 'react';
import './Footer.css';
import Collapse from 'react-bootstrap/Collapse';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import { Link } from 'react-router-dom';

const Footer = () => {
  const [activeTab, setActiveTab] = useState(null);

  const toggle = (tab) => setActiveTab(prev => prev === tab ? null : tab);

  return (
    <footer className="ft-root">

      {/* ── Top strip ── */}
      <div data-aos="fade-up" className="ft-top">
        <div className="ft-top-inner">
          <div className="ft-brand">
            <img src="/img/logo.avif" alt="JELWO" className="ft-logo" />
            <span className="ft-brand-pipe"></span>
            <p className="ft-tagline">Discover handcrafted fine jewellery — rings, necklaces, earrings &amp; more. Crafted with love for every occasion.</p>
          </div>
          <div className="ft-social-block">
            <p className="ft-section-label">Contact Us</p>
            <div data-aos="fade-up" className="ft-social-icons">
              <span><i className="fa-brands fa-facebook-f"></i></span>
              <span><i className="fa-brands fa-x-twitter"></i></span>
              <span><i className="fa-brands fa-instagram"></i></span>
              <span><i className="fa-brands fa-pinterest-p"></i></span>
              <span><i className="fa-brands fa-square-youtube"></i></span>
            </div>
          </div>
          <div className="ft-hours">
            <p className="ft-section-label">Shop Opening Time</p>
            <p className="ft-hours-line">Monday to Saturday: 10AM – 11PM</p>
            <p className="ft-hours-line">Sunday Time: 10AM – 4PM</p>
          </div>
        </div>
      </div>

      {/* ── Bottom columns ── */}
      <div data-aos="flip-left" data-aos-duration="2000" className="ft-bottom">
        <div className="ft-bottom-inner">

          {/* Information */}
          <div className="ft-col">
            <div className="ft-col-desktop">
              <h4 className="ft-col-title">Information</h4>
              <ul className="ft-link-list">
                <li><Link to="/aboutus">About us</Link></li>
                <li><Link to="/contact">Contact us</Link></li>
                <li><Link to="/faqpage">FAQS</Link></li>
                <li><Link to="/blog">News</Link></li>
              </ul>
            </div>
            <div className="ft-col-mobile">
              <button className="ft-acc-btn" onClick={() => toggle('info')}>
                <span>Information</span>
                <FontAwesomeIcon icon={activeTab === 'info' ? faMinus : faPlus} />
              </button>
              <Collapse in={activeTab === 'info'}>
                <ul className="ft-link-list ft-acc-body">
                  <li><Link to="/aboutus">About us</Link></li>
                  <li><Link to="/contact">Contact us</Link></li>
                  <li><Link to="/faqpage">FAQS</Link></li>
                  <li><Link to="/blog">News</Link></li>
                </ul>
              </Collapse>
            </div>
          </div>

          {/* Privacy & Terms */}
          <div className="ft-col">
            <div className="ft-col-desktop">
              <h4 className="ft-col-title">Privacy &amp; Terms</h4>
              <ul className="ft-link-list">
                <li><Link to="/privacy">Privacy policy</Link></li>
                <li><Link to="/storelocation">Store location</Link></li>
                <li><Link to="/showmore">Shipping &amp; return</Link></li>
                <li><Link to="/term">Terms &amp; Condition</Link></li>
              </ul>
            </div>
            <div className="ft-col-mobile">
              <button className="ft-acc-btn" onClick={() => toggle('privacy')}>
                <span>Privacy &amp; Terms</span>
                <FontAwesomeIcon icon={activeTab === 'privacy' ? faMinus : faPlus} />
              </button>
              <Collapse in={activeTab === 'privacy'}>
                <ul className="ft-link-list ft-acc-body">
                  <li><Link to="/privacy">Privacy policy</Link></li>
                  <li><Link to="/storelocation">Store location</Link></li>
                  <li><Link to="/showmore">Shipping &amp; return</Link></li>
                  <li><Link to="/term">Terms &amp; Condition</Link></li>
                </ul>
              </Collapse>
            </div>
          </div>

          {/* Category */}
          <div className="ft-col">
            <div data-aos="flip-right" data-aos-duration="2000" className="ft-col-desktop">
              <h4 className="ft-col-title">Category</h4>
              <ul className="ft-link-list">
                <li><Link to="/filter/category/Ring">Rings</Link></li>
                <li><Link to="/filter/category/Earrings">Earrings</Link></li>
                <li><Link to="/filter/category/Neclace">Necklaces</Link></li>
                <li><Link to="/filter/category/Bracelets">Bracelets</Link></li>
                <li><Link to="/filter/category/Pendants">Pendants</Link></li>
              </ul>
            </div>
            <div className="ft-col-mobile">
              <button className="ft-acc-btn" onClick={() => toggle('category')}>
                <span>Category</span>
                <FontAwesomeIcon icon={activeTab === 'category' ? faMinus : faPlus} />
              </button>
              <Collapse in={activeTab === 'category'}>
                <ul className="ft-link-list ft-acc-body">
                  <li><Link to="/filter/category/Ring">Rings</Link></li>
                  <li><Link to="/filter/category/Earrings">Earrings</Link></li>
                  <li><Link to="/filter/category/Neclace">Necklaces</Link></li>
                  <li><Link to="/filter/category/Bracelets">Bracelets</Link></li>
                  <li><Link to="/filter/category/Pendants">Pendants</Link></li>
                </ul>
              </Collapse>
            </div>
          </div>

          {/* Contact */}
          <div className="ft-col">
            <div className="ft-col-desktop">
              <h4 className="ft-col-title">Contact us</h4>
              <ul className="ft-link-list">
                <li><span>720, Bodakdev, Ahmedabad, Gujarat, 380059</span></li>
                <li>
                  <i className="fa-solid fa-phone ft-icon-red"></i>
                  <a href="tel:+916355520913">+(91) 635 552 0913</a>
                </li>
                <li>
                  <i className="fa-solid fa-envelope ft-icon-red"></i>
                  <a href="mailto:jelwo1824@gmail.com">jelwo1824@gmail.com</a>
                </li>
              </ul>
            </div>
            <div className="ft-col-mobile">
              <button className="ft-acc-btn" onClick={() => toggle('contact')}>
                <span>Contact us</span>
                <FontAwesomeIcon icon={activeTab === 'contact' ? faMinus : faPlus} />
              </button>
              <Collapse in={activeTab === 'contact'}>
                <div className="ft-acc-body">
                  <ul className="ft-link-list">
                    <li><span>720, Bodakdev, Ahmedabad, Gujarat, 380059</span></li>
                    <li>
                      <i className="fa-solid fa-phone ft-icon-red"></i>
                      <a href="tel:+916355520913">+(91) 635 552 0913</a>
                    </li>
                    <li>
                      <i className="fa-solid fa-envelope ft-icon-red"></i>
                      <a href="mailto:jelwo1824@gmail.com">jelwo1824@gmail.com</a>
                    </li>
                  </ul>
                  <div className="ft-map ft-map-mobile">
                    <iframe
                      title="Jelwo Store Location Mobile"
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3671.5!2d72.5!3d23.05!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e848aba5bd449%3A0x4fcedd11614f6516!2sBodyakdev%2C%20Ahmedabad%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1"
                      width="100%"
                      height="160"
                      style={{ border: 0, borderRadius: '8px', display: 'block' }}
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                  </div>
                </div>
              </Collapse>
            </div>
          </div>

          {/* Map - desktop only */}
          <div className="ft-col">
            <div className="ft-col-desktop">
              <h4 className="ft-col-title">Our Location</h4>
              <div className="ft-map">
                <iframe
                  title="Jelwo Store Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3671.5!2d72.5!3d23.05!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e848aba5bd449%3A0x4fcedd11614f6516!2sBodyakdev%2C%20Ahmedabad%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1"
                  width="100%"
                  height="160"
                  style={{ border: 0, borderRadius: '8px', display: 'block' }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── Copyright ── */}
      <div className="ft-copy">
        <p>© {new Date().getFullYear()} Jelwo. All rights reserved.</p>
      </div>

    </footer>
  );
};

export default Footer;
