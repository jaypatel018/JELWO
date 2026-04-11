import React from 'react'
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from 'react';
import Offcanvas from 'react-bootstrap/Offcanvas';
import GridViewIcon from '@mui/icons-material/GridView';
import InventoryIcon from '@mui/icons-material/Inventory';
import CategoryIcon from '@mui/icons-material/Category';
import CloseIcon from '@mui/icons-material/Close';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import ProductionQuantityLimitsIcon from '@mui/icons-material/ProductionQuantityLimits';
import { NavLink } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './Admin.css';
const header = () => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  return (
    <>
    <Offcanvas show={show} onHide={handleClose} placement='start' className="admin-offcanvas">
        <Offcanvas.Body>
         <div className='text-end '>
           <button className='text-end d-inline' onClick={handleClose}><CloseIcon/></button>
         </div>
         <div className='sidebar1' >
          <h2>Admin</h2>
          <ul className='sidebar-menu'>
          <li onClick={handleClose}>
          <NavLink
            to="/admin"
            className={({ isActive }) => (isActive ? "active-link " : "")}
          >
            {" "}
            <GridViewIcon className="icon" /> Dashboard
          </NavLink>
        </li>
        <li onClick={handleClose}>
          <NavLink
            to="/admin/adminproducts"
            className={({ isActive }) =>
              isActive ? "active-link " : "text-decoration-none"
            }
          >
            <InventoryIcon className="icon" /> Product List
          </NavLink>
        </li>
         <li onClick={handleClose}>
          <NavLink
            to="/admin/addproduct"
            className={({ isActive }) =>
              isActive ? "active-link " : "text-decoration-none"
            }
          >
            {" "}
            <ProductionQuantityLimitsIcon className="icon" />
            Add product
          </NavLink>
        </li>
        <li onClick={handleClose}>
          <NavLink
            to="/admin/admincategories"
            className={({ isActive }) =>
              isActive ? "active-link " : "text-decoration-none"
            }
          >
            {" "}
            <CategoryIcon className="icon" /> Category list 
          </NavLink>
        </li>
        <li onClick={handleClose}>
          <NavLink
            to="/admin/addcategorie"
            className={({ isActive }) =>
              isActive ? "active-link " : "text-decoration-none"
            }
          >
            {" "}
            <ProductionQuantityLimitsIcon className="icon" />  Add Category
          </NavLink>
        </li>
        <li onClick={handleClose}>
          <NavLink
            to="/admin/adminusers"
            className={({ isActive }) =>
              isActive ? "active-link " : "text-decoration-none"
            }
          >
            {" "}
            <GroupAddIcon className="icon" /> Users
          </NavLink>
        </li>   
          </ul>
        </div>
        </Offcanvas.Body>
      </Offcanvas>
    <div className='admin-header'>
       <div className='humber' onClick={handleShow}><MenuIcon/></div>
      <div><h4>Jelwo Admin</h4></div>

    </div>
    </>
  )
}

export default header
