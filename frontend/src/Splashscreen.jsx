import React from 'react'
import './Splashscreen.css'
import { motion } from "framer-motion"
const Splashscreen = () => {
  return (
    <div className='splash-body '>
      <motion.div  initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
                duration: 0.9,
                scale: { type: "spring", visualDuration: 0.4, bounce: 0.8 },
            }} className="">
        <img className='w-100' src="/img/logo.avif" alt="" />
       </motion.div>
    </div>
  )
}

export default Splashscreen
