import React from 'react'
import './Contact.css'
import { Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation, Autoplay } from 'swiper/modules';

const Contact = () => {
  return (
    <div>
      <div className="page-title-section">
        <h1>CONTACT US</h1>
        <p><Link to="/">Home</Link> &gt; CONTACT</p>
      </div>
      <div className=" container-section quick  ">
                   <h1 data-aos="fade-up" className='text-center pt-5'>Quick Support</h1>
                   <div className="contact-card mt-5 pb-5 " >
                    <div className='text-center'>
                      <span className='contact-icon'><i className="fa-solid fa-location-dot text-danger fs-5"></i></span>
                      <h4 className='mt-5'>STORE LOCATION</h4>
                      <p>720,Bodakdev,Ahemdabad,Gujarat,380059</p>
                    </div>
                    <div className='text-center'>
                      <span className='contact-icon'><i className="fa-solid fa-phone-volume text-danger fs-5"></i></span>
                      <h4 className='mt-5'>quick CALL</h4>
                      <p>+91-6355520913</p>
                    </div>
                    <div className='text-center'>
                      <span className='contact-icon'><i className="fa-solid fa-envelope text-danger fs-5"></i></span>
                      <h4 className='mt-5'>SUPPORT EMAIL</h4>
                      <p>jelwo1824@gmail.com</p>
                    </div>  
                   </div>
      </div>
      <div className="contact-img">
        <img src="img/about-ban.webp" alt="" />
      </div>
      <div className="country ps-3 pe-3">
        <div className="diff-country bg-white p-5 ">
          <div><h3  className='mb-5 text-center'>GET IN TOUCH</h3></div>
               <Swiper  modules={[Navigation, Autoplay]} 
               loop={true}
               breakpoints={{
                320:{
                  slidesPerView:1,
                },
                620:{
                  slidesPerView:2,
                },
                 900:{
                  slidesPerView:3,
                },
                 1200:{
                  slidesPerView:4,
                },
               }}
               autoplay={{
                delay:4000,
                disableOnInteraction:false,
               }}
               navigation={{
                nextEl: '.next1',
                prevEl: '.prev1',
               }}
               slidesPerView={4}
               className="mySwiper">
        <SwiperSlide>
          <div className='text-center text-secondary'>
           <div>
             <img className='w-25 mb-4' src="img/india.png" alt="" />
            <p>720,Bodakdev Road,Ahemdabad,Gujarat,380059</p> 
           </div>
           <div className='mb-4'>
            <span>+91 6355520913</span><br />
            <span>jelwo1824@store.com</span>
           </div>
           <div><h3 className='text-danger'>INDIA</h3></div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className='text-center text-secondary'>
           <div>
             <img className='w-25 mb-4' src="img/England.webp" alt="" />
            <p>048 Holburn street road 20TH Floor, camberly, England</p> 
           </div>
           <div className='mb-4'>
            <span>+91123 456 7890</span><br />
            <span>spoart@store.com</span>
           </div>
           <div><h3 className='text-danger'>ENGLAND</h3></div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className='text-center text-secondary'>
           <div>
             <img className='w-25 mb-4' src="img/Canada.avif" alt="" />
            <p>523 North stockpoint road bridge, Tronto,Canada</p> 
           </div>
           <div className='mb-4'>
            <span>+91123 456 7890</span><br />
            <span>spoart@store.com</span>
           </div>
           <div><h3 className='text-danger'>LONDON</h3></div>
          </div>
        </SwiperSlide>
        <SwiperSlide><div className='text-center text-secondary'>
           <div>
             <img className='w-25 mb-4' src="img/London.avif" alt="" />
            <p>523 North stockpoint road bridge, Tronto,Canada</p> 
           </div>
           <div className='mb-4'>
            <span>+91123 456 7890</span><br />
            <span>spoart@store.com</span>
           </div>
           <div><h3 className='text-danger'>CANADA</h3></div>
          </div>
          </SwiperSlide>
        <SwiperSlide>
          <div className='text-center text-secondary'>
           <div>
             <img className='w-25 mb-4' src="img/Canada.avif" alt="" />
            <p>523 North stockpoint road bridge, Tronto,Canada</p> 
           </div>
           <div className='mb-4'>
            <span>+91123 456 7890</span><br />
            <span>spoart@store.com</span>
           </div>
           <div><h3 className='text-danger'>CANADA</h3></div>
          </div>
        </SwiperSlide>
         <div className="swiper-button-next next1"><i className="fa-solid fa-arrow-right text-secondary fs-3"></i></div>
    <div className="swiper-button-prev prev1"><i className="fa-solid fa-arrow-left text-secondary fs-3"></i></div>
      </Swiper>
        </div>
        <div className='contact-form pt-5 pb-5'>
         <h2  className='text-center'>Keep In Touch with Us</h2>
         <div className='mt-5'>
          <form action="">
            <div className="row">
              <div className="col-12 col-lg-6 contact-form-field">
                <input type="text" placeholder='Your full name' className='mb-3'/>
                <input type="email" placeholder='Your email address' className='mb-3'/>
                <input type="number" placeholder='Your mobile number' className='mb-3 mb-lg-0'/>
              </div>
              <div className="col-12 col-lg-6">
                  <textarea placeholder='Text message here...' className='m-0'></textarea>
              </div>
            </div>
            <div className="row mt-3 mb-3">
              <div className="col-12 col-lg-6">
                 <label className='d-flex gap-3 align-items-center' >
                <input type="checkbox"  className='round'/>
                <p>I accept the terms & conditions and I understand that my data will be hold securely in accordance with the privacy policy.</p>
              </label>
              </div>
              <div className="col-12 col-lg-6">
                <button className='btn btn-danger'>SEND MESSAGE</button>
              </div>
            </div>
            <div>
              
            </div>
          </form>
         </div>
        </div>
      </div>
    </div>
  )
}

export default Contact
