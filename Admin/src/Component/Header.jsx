import React, { useState } from 'react'
import MenuIcon from '@mui/icons-material/Menu';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { NavLink } from 'react-router-dom';
import GridViewIcon from '@mui/icons-material/GridView';
import InventoryIcon from '@mui/icons-material/Inventory';
import AddBoxIcon from '@mui/icons-material/AddBox';
import CategoryIcon from '@mui/icons-material/Category';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import LockIcon from '@mui/icons-material/Lock';
import CloseIcon from '@mui/icons-material/Close';
import './Admin.css';

const Header = () => {
  const [show, setShow] = useState(false);

  const menuItems = [
    { to: '/admin', icon: <GridViewIcon className="icon" />, label: 'Dashboard', end: true },
    { to: '/admin/adminproducts', icon: <InventoryIcon className="icon" />, label: 'Product List' },
    { to: '/admin/addproduct', icon: <AddBoxIcon className="icon" />, label: 'Add Product' },
    { to: '/admin/admincategories', icon: <CategoryIcon className="icon" />, label: 'Category List' },
    { to: '/admin/addcategorie', icon: <AddCircleOutlineIcon className="icon" />, label: 'Add Category' },
    { to: '/admin/adminusers', icon: <GroupAddIcon className="icon" />, label: 'Users' },
    { to: '/admin/adminorders', icon: <ShoppingBagIcon className="icon" />, label: 'Orders' },
    { to: '/admin/admincoupons', icon: <LocalOfferIcon className="icon" />, label: 'Coupons' },
  ];

  return (
    <>
      <Offcanvas show={show} onHide={() => setShow(false)} placement="start" className="admin-offcanvas">
        <Offcanvas.Body>
          <div className="mobile-sidebar-header">
            <h4>Jelwo Admin</h4>
            <button className="mobile-sidebar-close" onClick={() => setShow(false)}>
              <CloseIcon />
            </button>
          </div>
          <ul className="sidebar-menu" style={{padding:'10px 0'}}>
            {menuItems.map(item => (
              <li key={item.to} onClick={() => setShow(false)}>
                <NavLink to={item.to} end={item.end} className={({ isActive }) => isActive ? 'active-link' : ''}>
                  {item.icon} {item.label}
                </NavLink>
              </li>
            ))}
            <li onClick={() => setShow(false)}>
              <NavLink to="/" className="text-decoration-none">
                <LockIcon className="icon" /> Logout
              </NavLink>
            </li>
          </ul>
        </Offcanvas.Body>
      </Offcanvas>

      <div className="admin-header">
        <div className="humber" onClick={() => setShow(true)}>
          <MenuIcon />
        </div>
        <h4 style={{position:'absolute', left:'50%', transform:'translateX(-50%)', margin:0, color:'white', fontSize:'18px', fontWeight:700}}>Jelwo Admin</h4>
      </div>
    </>
  );
};

export default Header;
