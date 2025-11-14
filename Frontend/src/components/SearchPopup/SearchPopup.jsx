import React, { useContext } from "react";
import "./SearchPopup.css";
import { X } from "lucide-react";
// import { StoreContext } from "../../context/StoreContext"; // ✅ Correct path (two dots!)
import { StoreContext } from "../context/StoreContext";



const SearchPopup = ({ searchTerm, filteredItems, onClose }) => {
  const { cartItems, addToCart, removeFromCart, url } = useContext(StoreContext);

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(price);

  if (!searchTerm) return null;

  return (
    <div className="search-popup-overlay">
      <div className="search-popup">
        <div className="popup-header">
          <h2>
            {filteredItems.length > 0
              ? `Results for “${searchTerm}”`
              : `No items found for “${searchTerm}”`}
          </h2>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {filteredItems.length > 0 && (
          <div className="popup-grid">
            {filteredItems.map((item) => (
              <div className="popup-card" key={item._id}>
                <img
                  src={url + "images/" + item.image} // ✅ Fixed image reference
                  alt={item.name}
                  className="popup-card-img"
                />
                <div className="popup-card-info">
                  <h3>{item.name}</h3>
                  <p className="popup-desc">{item.description}</p>
                  <p className="popup-price">{formatPrice(item.price)}</p>

                  {/* Quantity buttons */}
                  {cartItems[item._id] ? (
                    <div className="popup-qty">
                      <button onClick={() => removeFromCart(item._id)}>-</button>
                      <span>{cartItems[item._id]}</span>
                      <button onClick={() => addToCart(item._id)}>+</button>
                    </div>
                  ) : (
                    <button
                      className="popup-add"
                      onClick={() => addToCart(item._id)}
                    >
                      Add to Cart
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPopup;
