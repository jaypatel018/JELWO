import React from 'react'
import AdminLayout from './Component/AdminLayout'
import Dashboard from './Component/Dashboard'
import Sidebar from './Component/Sidebar'
import Header from './Component/Header'
import AdminCategories from './Component/AdminCategories'
import AdminProduct from './Component/AdminProduct'
import User from './Component/User'
import Addproduct from './Component/Addproduct'
import Addcategories from './Component/Addcategories'
import Adminlogin from './Component/Adminlogin'
import {
  BrowserRouter as Router,
  Route,
  Routes,
  BrowserRouter,
} from "react-router-dom";
import AdminOrders from './Component/AdminOrders'
import AdminCoupons from './Component/AdminCoupons'

function App() {
 
  return (
    <>
    <BrowserRouter>
  <Routes>

    {/* Login */}
    <Route path="/" element={<Adminlogin />} />

    {/* Admin */}
    <Route path="/admin" element={<AdminLayout />}>

      <Route index element={<Dashboard />} />

      <Route path="sidebar" element={<Sidebar />} />
      <Route path="header" element={<Header />} />

      <Route path="admincategories" element={<AdminCategories />} />
      <Route path="adminproducts" element={<AdminProduct />} />

      <Route path="adminusers" element={<User />} />
      <Route path="adminorders" element={<AdminOrders />} />
      <Route path="admincoupons" element={<AdminCoupons />} />

      <Route path="addproduct" element={<Addproduct />} />

      <Route path="addcategorie" element={<Addcategories />} />

    </Route>
  </Routes>
</BrowserRouter>
        
    </>
  )
}

export default App
