import React from "react";
import "./Navbar.css";
import { assets } from "../../assets/assets";

const Navbar = () => {
  return (
    <div className="navbar">
      <div className="title">
        <img src={assets.icon2} alt="VegHome Logo" className="logo" />
        <div className="text-group">
          <h1>VegHomeFlavor</h1>
          <h3>Admin Panel</h3>
        </div>
      </div>
      <img src={assets.profile_image} alt="Profile" className="profile" />
    </div>
  );
};

export default Navbar;
