import React from 'react'
import './Storelocation.css'
import { Link } from 'react-router-dom'

const Storelocation = () => {
  return (
    <div>
    <div className="page-title-section">
      <h1>STORE LOCATION</h1>
      <p><Link to="/">Home</Link> &gt; STORE LOCATION</p>
    </div>
    <div className="container-section pt-5 pb-5">
            <div data-aos="fade-up" className="row justify-content-center align-items-center ">
                <div className="col-12 col-md-6 p-2 p-md-5">
                    <div className="img-1">
                        <img className="w-100" src="img/Valsone-shop.webp" alt=""/>
                    </div>
                </div>
                <div data-aos="fade-up" className="col-12 col-md-6 p-5">
                    <div>
                        <h3 data-aos="fade-up">Valsone shop</h3>
                        <div className="d-flex align-items-center  gap-3 pt-3 pb-3">
                            <div><i className="fa-solid fa-phone-volume"></i></div>
                            <div>
                                <span data-aos="fade-up">LET'S TALK</span><br/>
                                <span>+999 3222 000 388</span>
                            </div>
                        </div>
                        <div className="d-flex align-items-center gap-3 pt-3 pb-3">
                            <div><i className="fa-solid fa-envelope"></i></div>
                            <div>
                                <span data-aos="fade-up">SAY HII!</span><br/>
                                <span>store@domain.com</span>
                            </div>
                        </div>
                        <div className="d-flex align-items-center gap-3 pt-3 pb-3">
                            <div><i className="fa-solid fa-location-dot"></i></div>
                            <div>
                                <span data-aos="fade-up">STORE ADDRESS</span><br/>
                                <span>27 Eden walk eden center, Broadway, United States</span>
                            </div>
                        </div>
                        <div className="d-flex align-items-center gap-3 pt-3 pb-3">
                            <div><i className="fa-solid fa-clock"></i></div>
                            <div>
                                <span data-aos="fade-up">OPENING HOURS</span><br/>
                                <span>Mon-Fri: 9:00-6:00</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div data-aos="fade-up" className="row justify-content-center align-items-center ">
                <div  data-aos="fade-up" className="col-12 col-md-6  order-2 ">
                    <div className="img-1">
                        <img className="w-100" src="img/Melbourne-place.webp" alt=""/>
                    </div>
                </div>
                <div data-aos="fade-up" className="col-12 col-md-6  p-5 order-1">
                    <div>
                        <h3 data-aos="fade-up">Malbourne place</h3>
                        <div className="d-flex align-items-center  gap-3 pt-3 pb-3">
                            <div><i className="fa-solid fa-phone-volume"></i></div>
                            <div>
                                <span data-aos="fade-up">LET'S TALK</span><br/>
                                <span>+999 3222 000 388</span>
                            </div>
                        </div>
                        <div className="d-flex align-items-center gap-3 pt-3 pb-3">
                            <div><i className="fa-solid fa-envelope"></i></div>
                            <div>
                                <span>SAY HII!</span><br/>
                                <span>store@domain.com</span>
                            </div>
                        </div>
                        <div className="d-flex align-items-center gap-3 pt-3 pb-3">
                            <div><i className="fa-solid fa-location-dot"></i></div>
                            <div>
                                <span data-aos="fade-up">STORE ADDRESS</span><br/>
                                <span>27 Eden walk eden center, Broadway, United States</span>
                            </div>
                        </div>
                        <div className="d-flex align-items-center gap-3 pt-3 pb-3">
                            <div><i className="fa-solid fa-clock"></i></div>
                            <div>
                                <span data-aos="fade-up">OPENING HOURS</span><br/>
                                <span>Mon-Fri: 9:00-6:00</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div data-aos="fade-up" className="row justify-content-center align-items-center ">
                <div className="col-12 col-md-6 p-2 p-md-5">
                    <div className="img-1">
                        <img className="w-100" src="img/Ansolt-park.webp" alt=""/>
                    </div>
                </div>
                <div  data-aos="fade-up" className="col-12 col-md-6 p-5">
                    <div>
                        <h3>Ansolt Park</h3>
                        <div className="d-flex align-items-center  gap-3 pt-3 pb-3">
                            <div><i className="fa-solid fa-phone-volume"></i></div>
                            <div>
                                <span>LET'S TALK</span><br/>
                                <span>+999 3222 000 388</span>
                            </div>
                        </div>
                        <div className="d-flex align-items-center gap-3 pt-3 pb-3">
                            <div><i className="fa-solid fa-envelope"></i></div>
                            <div>
                                <span>SAY HII!</span><br/>
                                <span>store@domain.com</span>
                            </div>
                        </div>
                        <div className="d-flex align-items-center gap-3 pt-3 pb-3">
                            <div><i className="fa-solid fa-location-dot"></i></div>
                            <div>
                                <span>STORE ADDRESS</span><br/>
                                <span>27 Eden walk eden center, Broadway, United States</span>
                            </div>
                        </div>
                        <div className="d-flex align-items-center gap-3 pt-3 pb-3">
                            <div><i className="fa-solid fa-clock"></i></div>
                            <div>
                                <span>OPENING HOURS</span><br/>
                                <span>Mon-Fri: 9:00-6:00</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div> 
    </div>  
    </div>
  )
}

export default Storelocation
