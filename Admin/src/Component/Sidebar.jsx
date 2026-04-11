import { NavLink } from "react-router-dom";
import React from "react";
import GridViewIcon from "@mui/icons-material/GridView";
import InventoryIcon from "@mui/icons-material/Inventory";
import AddBoxIcon from "@mui/icons-material/AddBox";
import CategoryIcon from "@mui/icons-material/Category";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import LockIcon from '@mui/icons-material/Lock';
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import "./Admin.css";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2 className="sidebar-title">Admin</h2>
      <ul className="sidebar-menu">

        {/* 1. Dashboard */}
        <li>
          <NavLink to="/admin" end className={({ isActive }) => isActive ? "active-link" : ""}>
            <GridViewIcon className="icon" /> Dashboard
          </NavLink>
        </li>

        {/* 2. Product List */}
        <li>
          <NavLink to="/admin/adminproducts" className={({ isActive }) => isActive ? "active-link" : ""}>
            <InventoryIcon className="icon" /> Product List
          </NavLink>
        </li>

        {/* 3. Add Product */}
        <li>
          <NavLink to="/admin/addproduct" className={({ isActive }) => isActive ? "active-link" : ""}>
            <AddBoxIcon className="icon" /> Add Product
          </NavLink>
        </li>

        {/* 4. Category List */}
        <li>
          <NavLink to="/admin/admincategories" className={({ isActive }) => isActive ? "active-link" : ""}>
            <CategoryIcon className="icon" /> Category List
          </NavLink>
        </li>

        {/* 5. Add Category */}
        <li>
          <NavLink to="/admin/addcategorie" className={({ isActive }) => isActive ? "active-link" : ""}>
            <AddCircleOutlineIcon className="icon" /> Add Category
          </NavLink>
        </li>

        {/* 6. Users */}
        <li>
          <NavLink to="/admin/adminusers" className={({ isActive }) => isActive ? "active-link" : ""}>
            <GroupAddIcon className="icon" /> Users
          </NavLink>
        </li>

        {/* 7. Orders */}
        <li>
          <NavLink to="/admin/adminorders" className={({ isActive }) => isActive ? "active-link" : ""}>
            <ShoppingBagIcon className="icon" /> Orders
          </NavLink>
        </li>

        {/* 8. Coupons */}
        <li>
          <NavLink to="/admin/admincoupons" className={({ isActive }) => isActive ? "active-link" : ""}>
            <LocalOfferIcon className="icon" /> Coupons
          </NavLink>
        </li>

        {/* 9. Logout */}
        <li className="sidebar-logout">
          <NavLink to="/" className="text-decoration-none">
            <LockIcon className="icon" /> Logout
          </NavLink>
        </li>

      </ul>
    </div>
  );
};

export default Sidebar;
