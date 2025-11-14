import React from "react";
import "./Header.css";
import { Link as ScrollLink } from "react-scroll";
import { Link } from "react-router-dom";




const Header = () => {
  return (
    <div className="header">
      <div className="slider">
        <figure>
          <div className="slide">
            <img src="header1.png" alt="Slide 1" />
            <div className="slide-text">
              <h2>
                Order Your <br />
                Favourite Food Here
              </h2>
              <p>
                Choose from a diverse menu featuring a delectable array of
                dishes crafted with the finest ingredients and culinary
                expertise. Our mission is to satisfy your cravings and elevate
                your dining experience, one delicious meal at a time.
              </p>
            <ScrollLink
  to="explore-menu"   // must match the section id
  smooth={true}
  duration={600}
  offset={-80}        // optional: adjust if navbar covers top
>
  <button className="view-menu-btn">View Menu</button>
</ScrollLink>
            </div>
          </div>
                  <div className="slide">
                      <img src="header2.png" alt="Slide 2" />
            
            <div className="slide-text">
              <h2>
                Order Your <br />
                Favourite Food Here
              </h2>
              <p>
                Choose from a diverse menu featuring a delectable array of
                dishes crafted with the finest ingredients and culinary
                expertise. Our mission is to satisfy your cravings and elevate
                your dining experience, one delicious meal at a time.
              </p>
              <ScrollLink
  to="explore-menu"   // must match the section id
  smooth={true}
  duration={600}
  offset={-80}        // optional: adjust if navbar covers top
>
  <button className="view-menu-btn">View Menu</button>
</ScrollLink>
              
            </div>
          </div>
          <div className="slide">
                      <img src="header3.png" alt="Slide 3" />
                      <div className="slide-text">
              <h2>
                Order Your <br />
                Favourite Food Here
              </h2>
              <p>
                Choose from a diverse menu featuring a delectable array of
                dishes crafted with the finest ingredients and culinary
                expertise. Our mission is to satisfy your cravings and elevate
                your dining experience, one delicious meal at a time.
              </p>
             <ScrollLink
  to="explore-menu"   // must match the section id
  smooth={true}
  duration={600}
  offset={-80}        // optional: adjust if navbar covers top
>
  <button className="view-menu-btn">View Menu</button>
</ScrollLink>
            </div>
          </div>
          <div className="slide">
                      <img src="header4.png" alt="Slide 4" />
                      <div className="slide-text">
              <h2>
                Order Your <br />
                Favourite Food Here
              </h2>
              <p>
                Choose from a diverse menu featuring a delectable array of
                dishes crafted with the finest ingredients and culinary
                expertise. Our mission is to satisfy your cravings and elevate
                your dining experience, one delicious meal at a time.
              </p>
              <ScrollLink
  to="explore-menu"   // must match the section id
  smooth={true}
  duration={600}
  offset={-80}        // optional: adjust if navbar covers top
>
  <button className="view-menu-btn">View Menu</button>
</ScrollLink>
            </div>
          </div>
        </figure>
      </div>
    </div>
  );
};

export default Header;
