import React, { useContext, useState, useEffect } from "react";
import "./Navbar.css";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";
import { StoreContext } from "../context/StoreContext";
import { toast } from "react-toastify";
import SearchPopup from "../SearchPopup/SearchPopup";
import { assets } from "../../assets/assets";

const Navbar = ({ setShowLogIn }) => {
  const [menu, setMenu] = useState("home");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchPopup, setShowSearchPopup] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 576);

  const { cartItems, food_list = [], token, setToken, logout } =
    useContext(StoreContext);

  // const hasItemsInCart = Object.values(cartItems).some((qty) => qty > 0);
  const hasItemsInCart = Object.values(cartItems || {}).some((qty) => qty > 0);

  const navigate = useNavigate();

  // ✅ Detect screen size change
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 576);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ✅ Handle Search
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      toast.info("Please enter a food name to search 🍽");
      return;
    }

    const filteredItems = food_list.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (filteredItems.length > 0) {
      setShowSearchPopup(true);
    } else {
      toast.error("❌ Item is not available");
    }

    setIsSearching(false);
    setIsMenuOpen(false);
  };

  // ✅ Logout
  const handleLogout = () => {
    if (logout) logout();
    else {
      localStorage.removeItem("token");
      setToken("");
    }
    toast.success("Logged out successfully 👋");
    setIsProfileOpen(false);
    navigate("/");
  };

  return (
    <>
      <div className="nav">
        <div className="navbar">
          {/* ===== LOGO ===== */}
          <div className="front">
            <RouterLink to="/">
              <img src="icon2.png" alt="logo" className="logo" />
            </RouterLink>
            <RouterLink to="/">
              <h1 className="res_name">VegHomeFlavour</h1>
            </RouterLink>
          </div>

          {/* ===== DESKTOP MENU ===== */}
          {!isMobile && (
            <ul className="navbar-menu">
              <RouterLink
                to="/"
                onClick={() => setMenu("home")}
                className={menu === "home" ? "active" : ""}
              >
                home
              </RouterLink>

              <ScrollLink
                to="explore-menu"
                smooth={true}
                duration={600}
                offset={-70}
                spy={true}
                activeClass="active"
                onSetActive={() => setMenu("menu")}
              >
                menu
              </ScrollLink>

              <ScrollLink
                to="app-download"
                smooth={true}
                duration={600}
                offset={-70}
                spy={true}
                activeClass="active"
                onSetActive={() => setMenu("mobile-app")}
              >
                mobile app
              </ScrollLink>

              <ScrollLink
                to="footer"
                smooth={true}
                duration={600}
                offset={-70}
                spy={true}
                activeClass="active"
                onSetActive={() => setMenu("contact-us")}
              >
                contact us
              </ScrollLink>
            </ul>
          )}

          {/* ===== RIGHT ICONS (Desktop only) ===== */}
          {!isMobile && (
            <div className="navbar-right">
              {/* 🔍 Search */}
              <div
                className="navbar-search-wrapper"
                style={{ position: "relative" }}
              >
                <img
                  src="/search_icon.png"
                  alt="Search"
                  className="search-icon"
                  onClick={() => setIsSearching(!isSearching)}
                />

                {isSearching && (
                  <div
                    style={{
                      position: "absolute",
                      right: "40px",
                      top: "-4px",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      background: "white",
                      border: "1px solid #ddd",
                      borderRadius: "20px",
                      padding: "4px 8px",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                      zIndex: 10,
                    }}
                  >
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search food..."
                      style={{
                        border: "none",
                        outline: "none",
                        fontSize: "14px",
                        padding: "4px 6px",
                        width: "140px",
                      }}
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                    <button
                      onClick={handleSearch}
                      style={{
                        border: "none",
                        background: "rgb(236, 8, 104)",
                        color: "white",
                        borderRadius: "20px",
                        padding: "4px 10px",
                        cursor: "pointer",
                        fontSize: "13px",
                      }}
                    >
                      Go
                    </button>
                  </div>
                )}
              </div>

              {/* 🛒 Cart */}
              <div className="navbar-search-icon">
                <RouterLink to="/cart">
                  <img src="basket_icon.png" alt="basket" className="basket-icon" />
                </RouterLink>
                {hasItemsInCart && <div className="dot"></div>}
              </div>

              {/* 👤 Sign In or Profile */}
              {!token ? (
                <button
                  className="navbar-button"
                  onClick={() => setShowLogIn(true)}
                >
                  sign in
                </button>
              ) : (
                <div className="navbar-profile">
                  <img src={assets.profile_icon} alt="" />
                  <ul className="nav-dropdown-menu">
                    <li onClick={()=>navigate('/myorders')}>
                      <img src={assets.bag_icon} alt="" />
                      <p>Orders</p>
                    </li>
                    <hr />
                    <li onClick={handleLogout}>
                      <img src={assets.logout_icon} alt="" />
                      <p>Logout</p>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          )}

       {/* ===== MOBILE HAMBURGER + SEARCH + PROFILE / SIGNIN ===== */}
{/* ===== MOBILE HAMBURGER + SEARCH + PROFILE / SIGNIN ===== */}
{isMobile && (
  <>
    {/* ===== Mobile Header (Hamburger + Search + Auth/Profile) ===== */}
    <div className="mobile-header">
      {/* ☰ Hamburger */}
      <div
        className="hamburger"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <div className={`bar ${isMenuOpen ? "open" : ""}`}></div>
        <div className={`bar ${isMenuOpen ? "open" : ""}`}></div>
        <div className={`bar ${isMenuOpen ? "open" : ""}`}></div>
      </div>

      {/* 🔍 Mobile Search */}
      <div className="mobile-search-wrapper">
        <img
          src="/search_icon.png"
          alt="Search"
          className="mobile-search-icon"
          onClick={() => setIsSearching(!isSearching)}
        />
        <div
          className={`mobile-search-container ${
            isSearching ? "show" : "hide"
          }`}
        >
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search food..."
            className="mobile-search-input"
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <button onClick={handleSearch} className="mobile-search-button">
            Go
          </button>
        </div>
      </div>

      {/* 👤 Sign In or Profile Icon */}
      <div className="mobile-auth">
        {!token ? (
          <button
            className="mobile-signin-btn"
            onClick={() => setShowLogIn(true)}
          >
            Sign In
          </button>
        ) : (
          <div className="mobile-profile">
            <img
              src={assets.profile_icon}
              alt="Profile"
              className="profile-icon"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            />
            {isProfileOpen && (
              <ul className="mobile-profile-dropdown">
                <li onClick={() => navigate("/myorders")}>
                  <img src={assets.bag_icon} alt="" />
                  <p>Orders</p>
                </li>
                <hr />
                <li onClick={handleLogout}>
                  <img src={assets.logout_icon} alt="" />
                  <p>Logout</p>
                </li>
              </ul>
            )}
          </div>
        )}
      </div>
    </div>

    {/* ===== MOBILE DROPDOWN MENU ===== */}
    <div className={`mobile-menu ${isMenuOpen ? "show" : ""}`}>
      <RouterLink to="/" onClick={() => setIsMenuOpen(false)}>Home</RouterLink>
      <ScrollLink
        to="explore-menu"
        smooth={true}
        duration={600}
        offset={-70}
        onClick={() => setIsMenuOpen(false)}
      >
        Menu
      </ScrollLink>
      <ScrollLink
        to="footer"
        smooth={true}
        duration={600}
        offset={-70}
        onClick={() => setIsMenuOpen(false)}
      >
        Contact Us
      </ScrollLink>
      <ScrollLink
        to="app-download"
        smooth={true}
        duration={600}
        offset={-70}
        onClick={() => setIsMenuOpen(false)}
      >
        Mobile App
      </ScrollLink>

      <div className="mobile-menu-actions">
        <RouterLink to="/cart" onClick={() => setIsMenuOpen(false)}>
          <img src="basket_icon.png" alt="cart" />
        </RouterLink>
        {!token ? (
          <button onClick={() => { setShowLogIn(true); setIsMenuOpen(false); }}>
            Sign In
          </button>
        ) : (
          <button onClick={() => { handleLogout(); setIsMenuOpen(false); }}>
            Logout
          </button>
        )}
      </div>
    </div>
  </>
)}



      {/* ===== SEARCH POPUP ===== */}
      {showSearchPopup && (
        <div className="fade-in">
          <SearchPopup
            searchTerm={searchQuery}
            filteredItems={food_list.filter((item) =>
              item.name.toLowerCase().includes(searchQuery.toLowerCase())
            )}
            onClose={() => setShowSearchPopup(false)}
          />
        </div>
          )}
           </div> {/* ✅ closes .navbar */}
      </div> {/* ✅ closes .nav */}
    </>
  );
};

export default Navbar;
