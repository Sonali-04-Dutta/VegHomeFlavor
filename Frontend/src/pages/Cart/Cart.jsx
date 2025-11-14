import React, { useContext, useState, useEffect } from "react";
import "./Cart.css";
import { StoreContext } from "../../components/context/StoreContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const Cart = () => {
  const { cartItems, food_list, removeFromCart, url, token } =
    useContext(StoreContext);
  const navigate = useNavigate();

  const [promoCode, setPromoCode] = useState("");
  const [cartTotals, setCartTotals] = useState({
    subtotal: 0,
    deliveryFee: 0,
    discount: 0,
    total: 0,
  });

  const formatPriceINR = (price) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);

  const fetchPreview = async (promo = "") => {
    try {
      const items = food_list
        .filter((item) => cartItems[item._id] > 0)
        .map((item) => ({
          name: item.name,
          price: item.price,
          quantity: cartItems[item._id],
        }));

      if (items.length === 0) return;

      const res = await axios.post(
        `${url}api/order/preview`,
        { items, promoCode: promo.trim().toUpperCase() },
        { headers: { token } }
      );

      if (res.data.success) {
        const { subtotal, deliveryFee, discount, totalAmount, message } =
          res.data;

        setCartTotals({
          subtotal,
          deliveryFee,
          discount,
          total: totalAmount,
        });

        if (promo) {
          localStorage.setItem("appliedPromo", promo);
          localStorage.setItem("discount", discount);
          toast.success(message || "🎉 Offer applied successfully!");
        } else {
          // Clear promo if none applied
          localStorage.removeItem("appliedPromo");
          localStorage.removeItem("discount");
        }
      } else {
        toast.error("Invalid promo code");
      }
    } catch (err) {
      console.error("⚠️ Error fetching cart preview:", err);
      toast.error("Something went wrong while updating the cart.");
    }
  };

  useEffect(() => {
    const appliedPromo = localStorage.getItem("appliedPromo") || "";
    fetchPreview(appliedPromo);
  }, [cartItems]);

  const handlePromoSubmit = (e) => {
    e.preventDefault();
    if (!promoCode.trim()) {
      toast.info("Enter a promo code before submitting");
      return;
    }
    fetchPreview(promoCode.trim().toUpperCase());
  };

  const handleCheckout = () => {
    if (cartTotals.subtotal === 0) {
      toast.warning("Your cart is empty!");
      return;
    }
    navigate("/order");
  };

  return (
    <div className="cart">
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <hr />
        {food_list.map(
          (item) =>
            cartItems[item._id] > 0 && (
              <div key={item._id}>
                <div className="cart-items-title cart-items-item">
                  <img src={url + "images/" + item.image} alt={item.name} />
                  <p>{item.name}</p>
                  <p>{formatPriceINR(item.price)}</p>
                  <p>{cartItems[item._id]}</p>
                  <p>{formatPriceINR(item.price * cartItems[item._id])}</p>
                  <p onClick={() => removeFromCart(item._id)} className="cross">
                    x
                  </p>
                </div>
                <hr />
              </div>
            )
        )}
      </div>

      {cartTotals.subtotal > 0 && (
        <div
          className={`delivery-banner ${
            cartTotals.subtotal < 500 ? "warning" : "success"
          }`}
        >
          {cartTotals.subtotal < 500 ? (
            <p>
              ⚠ Orders below <strong>₹500</strong> will incur a{" "}
              <strong>₹40</strong> delivery charge.
            </p>
          ) : (
            <p>🎉 Free Delivery on orders above ₹500!</p>
          )}
        </div>
      )}

      <div className="cart-bottom">
        <h2>Cart Totals</h2>
        <div className="cart-total-details">
          <p>Subtotal</p>
          <p>{formatPriceINR(cartTotals.subtotal)}</p>
        </div>
        <div className="cart-total-details">
          <p>Delivery Fee</p>
          <p>{formatPriceINR(cartTotals.deliveryFee)}</p>
        </div>
        {cartTotals.discount > 0 && (
          <div className="cart-total-details discount">
            <p>Discount</p>
            <p>-{formatPriceINR(cartTotals.discount)}</p>
          </div>
        )}
        <hr />
        <div className="cart-total-details total">
          <b>Total</b>
          <b>{formatPriceINR(cartTotals.total)}</b>
        </div>

        <button className="checkout" onClick={handleCheckout}>
          PROCEED TO CHECKOUT
        </button>
      </div>

      <div className="promo">
        <div className="promo-code-details">
          {/* <p>
            🎁 <strong>FIRSTFREE</strong> — Free delivery on your first order
            above ₹300
          </p> */}
          <p>
            💸 <strong>SAVE70</strong> — ₹70 off on orders above ₹700
          </p>
          <p>
            💰 <strong>SAVE100</strong> — ₹100 off on orders above ₹1000
          </p>
        </div>

        <form className="cart-promocode" onSubmit={handlePromoSubmit}>
          <p>If you have a Promo Code, enter it here</p>
          <div className="cart-promocode-input">
            <input
              type="text"
              placeholder="promo-code"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
            />
            <button type="submit">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Cart;
