import React, { useEffect } from 'react'
import './Scroll.css'
import { useState } from 'react'
const Scroll = () => {
    const [visible, setVisible] = useState(false);
    useEffect(()=>{
       const toggle = ()=>{
        if(window.scrollY >= 400){
            setVisible(true);
        }
        else{
            setVisible(false);
        }
       };
       window.addEventListener("scroll" , toggle);
       return()=>{
        window.removeEventListener("scroll", toggle)
       }
    },[])

    const scrollToTop = ()=>{
        window.scrollTo({
            top:0,
            behavior:'smooth',
        })
    }
  return (
    <div>
     {visible && (
         <div className="scroll" onClick={scrollToTop}>
            <i className="fa-solid fa-arrow-up text-danger"></i>
      </div>
     )}
    </div>
  )
}

export default Scroll
