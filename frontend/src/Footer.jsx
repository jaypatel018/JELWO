import React from 'react'
import './Footer.css'
import { useState } from 'react';
import Collapse from 'react-bootstrap/Collapse';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import { Link } from 'react-router-dom';
const Footer = () => {
    const [open, setOpen] = useState(false);
    const [open1, setOpen1] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [open3, setOpen3] = useState(false);
  return (
    <div>
        <div data-aos="fade-up" class="container-section footer ">
             <div class="row pt-5 pb-5 border-bottom">
                <div class="col-12 col-sm-6 col-md-4 mb-3 m-sm-0">
                    <div>
                        <img class="footer-logo" src="/img/logo.avif" alt="JELWO"/>
                        <div class="pt-3 "><p>Jelwo product showcase site...</p></div>
                    </div>
                </div>
                <div class="col-12 col-sm-6 col-md-5 mb-5 m-sm-0">
                    <h5>Contact Us</h5>
                    <div data-aos="fade-up" class="social-icon mt-4">
                        <span><i class="fa-brands fa-facebook-f"></i></span>
                        <span><i class="fa-brands fa-x-twitter"></i></span>
                        <span><i class="fa-brands fa-instagram"></i></span>
                        <span><i class="fa-brands fa-pinterest-p"></i></span>
                        <span><i class="fa-brands fa-square-youtube"></i></span>
                    </div>
                </div>
                <div class="col-12 col-sm-6 col-md-3 mb-3 m-sm-0">
                    <div>
                        <h5 data-aos="fade-up">Shop Opening Time</h5>
                        <p  class="m-0">Monday to Saturday: 10AM - 11PM</p>
                        <span>Sunday Time: 10AM - 4PM</span>
                    </div>
                </div>
             </div>
             {/* react  collapse */}
             <div data-aos="flip-left" data-aos-duration="2000" className='second-footer pt-5 pb-5 ' >
                    <ul class="list-unstyled order-list">
                     <li class="ftlist">
                        <div class="d-none d-sm-block">
                            <h3 >Information</h3>
                        <ul class="list-unstyled list-item">
                            <li><Link to='/aboutus'className='text-decoration-none text-secondary' >About us</Link></li>
                            <li><Link to='/contact'className='text-decoration-none text-secondary' >Contact us</Link></li>
                            <li><Link to='/faqpage'className='text-decoration-none text-secondary' >FAQS</Link></li>
                            <li className='text-secondary'>News</li>
                        </ul>
                        </div>
                        {/* small screen collapse */}
                        <div class="d-block d-sm-none">
                        <div class="d-flex justify-content-between ps-2 pe-2">
                            <div><h3>Information</h3></div>
                            <div  
                            onClick={() => setOpen(!open)}
                            aria-controls="example-collapse-text"
                            aria-expanded={open}>
                                <FontAwesomeIcon icon={open ? faMinus : faPlus}/>
                            </div>
                        </div> 
                         <Collapse in={open}>
                                <ul id="example-collapse-text" className='list-unstyled pe-2 ps-2' >
                                    <li><Link to='/aboutus'className='text-decoration-none text-secondary' >About us</Link></li>
                                    <li><Link to='/contact'className='text-decoration-none text-secondary' >Contact us</Link></li>
                                    <li><Link to='/faqpage'className='text-decoration-none text-secondary' >FAQS</Link></li>
                                    <li className='text-secondary'>News</li>
                                </ul> 
                        </Collapse>                         
                     </div>
                    </li>
                    <li class="ftlist">
                        <div class="d-none d-sm-block">
                            <h3 >Privacy & Terms</h3>
                        <ul class="list-unstyled">
                            <li><Link to='/privacy' className='text-decoration-none text-secondary'>Privacy policy</Link></li>
                            <li><Link to='/storelocation' className='text-decoration-none text-secondary' >Store location</Link></li>
                            <li className='text-secondary'>Shipping & return</li>
                            <li><Link to='term' className='text-decoration-none text-secondary'>Terms & Condition</Link></li>
                        </ul>
                        </div>
                        {/* small screen collapse */}
                        <div class="d-block d-sm-none">
                        <div class="d-flex justify-content-between ps-2 pe-2">
                            <div><h3>Privacy & Terms</h3></div>
                            <div  
                            onClick={() => setOpen1(!open1)}
                            aria-controls="example-collapse-text"
                            aria-expanded={open1}>
                                <FontAwesomeIcon icon={open1 ? faMinus : faPlus}/>
                            </div>
                        </div> 
                         <Collapse in={open1}>
                                <ul id="example-collapse-text" className='list-unstyled pe-2 ps-2' >
                                     <li><Link to='/privacy' className='text-decoration-none text-secondary'>Privacy policy</Link></li>
                                     <li><Link to='/storelocation' className='text-decoration-none text-secondary' >Store location</Link></li>
                                     <li className='text-secondary'>Shipping & Return</li>
                                     <li><Link to='term' className='text-decoration-none text-secondary'>Terms & Condition</Link></li>
                                </ul> 
                        </Collapse>                         
                     </div>
                    </li>
                     <li class="ftlist">
                        <div data-aos="flip-right" data-aos-duration="2000" class="d-none d-sm-block">
                            <h3 >Category</h3>
                        <ul class="list-unstyled">
                             <li>Rings</li>
                            <li>Earning</li>
                            <li>Pendents</li>
                            <li>Necklaces</li>
                            <li>Bracelets</li>
                        </ul>
                        </div>
                        {/* small screen collapse */}
                        <div class="d-block d-sm-none">
                        <div class="d-flex justify-content-between ps-2 pe-2">
                            <div><h3>Category</h3></div>
                            <div  
                            onClick={() => setOpen2(!open2)}
                            aria-controls="example-collapse-text"
                            aria-expanded={open2}>
                                <FontAwesomeIcon icon={open2 ? faMinus : faPlus}/>
                            </div>
                        </div> 
                         <Collapse in={open2}>
                                <ul id="example-collapse-text" className='list-unstyled pe-2 ps-2' >
                                    <li>Rings</li>
                                    <li>Earning</li>
                                    <li>Pendents</li>
                                    <li>Necklaces</li>
                                    <li>Bracelets</li>
                                </ul> 
                        </Collapse>                         
                     </div>
                    </li>
                    <li class="ftlist">
                        <div class="d-none d-sm-block">
                            <h3 >Contact us</h3>
                        <ul class="list-unstyled">
                            <li>720,Bodakdev,Ahemdabad,Gujarat,380059</li>
                            <li> <i class="fa-solid fa-phone text-danger"></i> +(91)635 552 0913</li>
                            <li><i class="fa-solid fa-envelope text-danger"></i> jelwo1824@gmail.com</li>
                        </ul>
                        </div>
                        {/* small screen collapse */}
                        <div class="d-block d-sm-none">
                        <div class="d-flex justify-content-between ps-2 pe-2">
                            <div><h3>Contact us</h3></div>
                            <div  
                            onClick={() => setOpen3(!open3)}
                            aria-controls="example-collapse-text"
                            aria-expanded={open1}>
                                <FontAwesomeIcon icon={open3 ? faMinus : faPlus}/>
                            </div>
                        </div> 
                         <Collapse in={open3}>
                                <ul id="example-collapse-text" className='list-unstyled pe-2 ps-2' >
                                      <li>55 East 10th street,new york, united states</li>
                                      <li> <i class="fa-solid fa-phone text-danger"></i> +(91)635 552 0913</li>
                                      <li><i class="fa-solid fa-envelope text-danger"></i>jelwo1824@gmail.com</li>
                                </ul> 
                        </Collapse>                         
                     </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
  )
}

export default Footer
