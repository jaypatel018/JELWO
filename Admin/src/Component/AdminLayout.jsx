import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Sidebar from './Sidebar'
import './Admin.css'
const Adminlayout = () => {
  return (
    <div className="admin-layout">
        <Sidebar />
        <Header />
        <main className="content ">
          <Outlet /> 
        </main>
      </div>
  )
}

export default Adminlayout
