import React from 'react'
import './About.css'
import { Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css'
import { Navigation,  Pagination,Mousewheel, Keyboard } from 'swiper/modules';
const About = () => {
  return (
    <div>
      <div className="aboutus text-center pt-5 pb-5 text-white">
        <span><Link to="/" style={{color:'inherit',textDecoration:'none'}}>HOME</Link> - ABOUT US</span>
        <h2>About us</h2>
      </div>
      <div className="story pt-5 ">
          <div className='text-center'>
            <span className='fw-bold text-danger'>SINCE 1982 OUR STORY</span>
            <h1 className='mt-3 our'>Our about story</h1>
          </div>
          <div className=" container-section img-cont mt-5 mb-5 p-2 p-lg-5">
            <div className='img1'><img src="./img/about-us-1.webp" alt="" /></div>
          </div>
          <div className="row text-center  justify-content-center g-4 ">
            <div  className='col-12 col-md-6 col-lg-4'>
                <h6 className='fw-bold'>5,000+ HAPPY CUSTOMER</h6>
                <p>The customer's perception is your reality. Your most unhappy customers are your greatest source of learning</p>
            </div>
            <div  className='col-12 col-md-6 col-lg-4'>
                <h6 className='fw-bold'>40 YEARS OF EXPERIENCES</h6>
                <p>Awards can give you a tremendous amount of encouragement to keep getting better, no matter how young or old you are.</p>
            </div>
            <div  className='col-12 col-md-6 col-lg-4'>
                <h6 className='fw-bold'>5,000+ HAPPY CUSTOMER</h6>
                <p>Lorem Ipsum is simply dummy text printing and typesetting</p>
            </div> 
          </div>
          <div className="about-section">
              <Swiper
              slidesPerView={1}
        cssMode={true}
        navigation={
            {
                nextEl: '.next1',
                prevEl: '.prev1',
            }
        }
        loop={true}
        pagination={{ clickable: true }}
        breakpoints={{
            500:{
                 pagination:false,
            },
        }}
        modules={[Navigation,Pagination, Mousewheel, Keyboard]}
        className="mySwiper2 p-5"
      >
        <SwiperSlide>
            <div className='text-center row justify-content-center'>
               <div className="col-12 col-md-6">
                 <img className='women-img' src="./img/women-1.webp" alt="" />
                 <h6 className='mt-5 mb-4'>WE LOVE OUR CLIENTS</h6>
                 <p className='fs-2'>Its a long established facts that a render will be distracted when looking at its layout.</p>
                 <h5>MIRANDA JOY </h5>
               </div>
            </div>
        </SwiperSlide>
        <SwiperSlide>
             <div className='text-center row justify-content-center'>
               <div className="col-12 col-md-6">
                 <img className='women-img' src="./img/men-1.webp" alt="" />
                 <h6 className='mt-5 mb-4'>MIRANDA JOY</h6>
                 <p className='fs-2'>Its a long established facts that a render will be distracted when looking at its layout.</p>
                 <h5>MIRANDA JOY </h5>
               </div>
            </div>
        </SwiperSlide>
        <SwiperSlide>
            <div className='text-center row justify-content-center'>
               <div className="col-12 col-md-6">
                 <img className='women-img' src="./img/women-2.avif" alt="" />
                 <h6 className='mt-5 mb-4'>MIRANDA JOY</h6>
                 <p className='fs-2'>Its a long established facts that a render will be distracted when looking at its layout.</p>
                 <h5>MIRANDA JOY </h5>
               </div>
            </div>
        </SwiperSlide>
        <div className="swiper-button-next next1">
            <i className="fa-solid fa-circle-arrow-right"></i>
        </div>
        <div className="swiper-button-prev prev1">
            <i className="fa-solid fa-circle-arrow-left"></i>
        </div>
      </Swiper>
          </div>
      </div>
      <div className=" container-section img-cont mt-5 mb-5 p-2 p-lg-5">
            <div className='img1'><img src="./img/about-us-2.webp" alt="" /></div>
      </div>
      <div className='text-center'>
        <h6 className='text-danger'>HIGHLY SKILLED</h6>
        <h2>Meet our Teams</h2>
      </div>
      <div className="skilled mt-4 mb-5 p-2 p-lg-5">
         <div className="  img-cont">
            <div className='img1 w-100 h-auto'><img src="./img/m-1.webp" alt="" /></div>
            <div className='text-center '>
                <h5>HARRY JHONS</h5>
                <span className='text-secondary'>Ceo & Founder</span>
            </div>
        </div>
        <div className="  img-cont ">
            <div className='img1 w-100  h-auto'><img src="./img/m-2.webp" alt="" /></div>
            <div className='text-center'>
                <h5>Mory Orlando</h5>
                <span className='text-secondary'>Marketing</span>
            </div>
        </div>
        <div className="  img-cont  ">
            <div className='img1 w-100 h-auto'><img src="./img/m-3.webp" alt="" /></div>
             <div className='text-center'>
                <h5>Harlie puth</h5>
                <span className='text-secondary'>Graphic designer</span>
            </div>
        </div>
        <div className="  img-cont  ">
            <div className='img1 w-100 h-auto'><img src="./img/m-4.webp" alt="" /></div>
             <div className='text-center'>
                <h5>Tristin Chineze</h5>
                <span className='text-secondary'>Distribution</span>
            </div>
        </div>
      </div>
    </div>
  )
}

export default About
