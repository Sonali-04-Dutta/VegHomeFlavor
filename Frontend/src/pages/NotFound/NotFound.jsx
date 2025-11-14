import React from "react";
import "./NotFound.css";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import donut from "../../assets/donut.png";
import res from "../../assets/res.png";

// You can use a cat SVG or an image. For demo, we’ll use a placeholder pink cat emoji 🐱
const NotFound = () => {
  return (
    <div className="not-found">
      <div className="not-found-center">
        <div className="font">
               
          <img src={res}  alt="logo" className="logo2" />
                
                <h1 className='res_name2'>VegHomeFlavour</h1>
        </div>
        <h3>Oh..no.....Something wrong </h3>
        <div className="error-code">
          <span className="four">4</span>
          <img src={donut} alt="" className="donut" /> {/* replace with a pink cat SVG if available */}
          <span className="four">4</span>
        </div>
        <h1>Page Not Found</h1>
        <h4>Looks Like You Are Lost </h4>
        <Link to="/" className="home-btn">
          Go Back Home <FaArrowRight />
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
