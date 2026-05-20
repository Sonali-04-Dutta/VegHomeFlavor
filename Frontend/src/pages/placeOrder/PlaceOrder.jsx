import React, { useContext, useState, useEffect } from "react";
import "./placeOrder.css";
import { StoreContext } from "../../components/context/StoreContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const PlaceOrder = () => {
  const { cartItems, food_list, token, url } = useContext(StoreContext);

let userId = "";

if (token) {
  const decoded = jwtDecode(token);
  console.log(decoded);
  userId = decoded.id;
}
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    pinCode: "",
    country: "",
    phone: "",
  });

  const [promoData, setPromoData] = useState({ promoCode: "", discount: 0 });

  useEffect(() => {
    const storedPromo = localStorage.getItem("appliedPromo");
    const storedDiscount = localStorage.getItem("discount");

    if (storedPromo && storedPromo.trim() !== "" && storedPromo !== "null") {
      setPromoData({
        promoCode: storedPromo.trim(),
        discount: parseFloat(storedDiscount) || 0,
      });
    } else {
      setPromoData({ promoCode: "", discount: 0 });
    }
  }, []);

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const formatPriceINR = (price) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);

  const subtotalINR = food_list.reduce((total, item) => {
    if (cartItems[item._id] > 0) {
      return total + item.price * cartItems[item._id];
    }
    return total;
  }, 0);

  const deliveryFeeINR = subtotalINR > 0 && subtotalINR < 500 ? 40 : 0;
  const totalINR = subtotalINR + deliveryFeeINR - (promoData.discount || 0);

  const placeOrder = async (e) => {
    e.preventDefault();
    setLoading(true);

    const orderItems = food_list
      .filter((item) => cartItems[item._id] > 0)
      .map((item) => ({
        _id: item._id,
        name: item.name,
        price: item.price,
        quantity: cartItems[item._id],
      }));

    const orderData = {
      userId,
      address: data,
      items: orderItems,
      promoCode: promoData.promoCode || null,
      discount: promoData.discount || 0,
      amount: totalINR,
    };
try{
    const response = await axios.post(`${url}/api/order/place`, orderData, {
  headers: { token },
});

      if (response.data.success) {
        window.location.replace(response.data.session_url);
      } else {
        alert("⚠️ Error placing order. Please try again.");
      }
    } catch (err) {
      console.error("❌ Order failed:", err);
      alert("Something went wrong while placing your order.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={placeOrder} className="place-order">
      <div className="place-order-left">
        <p className="title">Delivery Information</p>

        <div className="multi-fields">
          <input
            name="firstName"
            onChange={onChangeHandler}
            value={data.firstName}
            type="text"
            placeholder="First Name"
            required
          />
          <input
            name="lastName"
            onChange={onChangeHandler}
            value={data.lastName}
            type="text"
            placeholder="Last Name"
            required
          />
        </div>

        <input
          name="email"
          onChange={onChangeHandler}
          value={data.email}
          type="email"
          placeholder="Email Address"
          required
        />
        <input
          name="street"
          onChange={onChangeHandler}
          value={data.street}
          type="text"
          placeholder="Street"
          required
        />

        <div className="multi-fields">
          <input
            name="city"
            onChange={onChangeHandler}
            value={data.city}
            type="text"
            placeholder="City"
            required
          />
          <input
            name="state"
            onChange={onChangeHandler}
            value={data.state}
            type="text"
            placeholder="State"
            required
          />
        </div>

        <div className="multi-fields">
          <input
            name="pinCode"
            onChange={onChangeHandler}
            value={data.pinCode}
            type="text"
            placeholder="Pin Code"
            required
          />
          <input
            name="country"
            onChange={onChangeHandler}
            value={data.country}
            type="text"
            placeholder="Country"
            required
          />
        </div>

        <input
          name="phone"
          onChange={onChangeHandler}
          value={data.phone}
          type="text"
          placeholder="Phone No"
          required
        />
      </div>

      <div className="place-order-right">
        <h2>Cart Totals</h2>

        <div className="cart-total-details">
          <p>Subtotal</p>
          <p>{formatPriceINR(subtotalINR)}</p>
        </div>

        <div className="cart-total-details">
          <p>Delivery Fee</p>
          <p>{formatPriceINR(deliveryFeeINR)}</p>
        </div>

        {promoData.discount > 0 && promoData.promoCode && (
          <div className="cart-total-details">
            <p>Discount ({promoData.promoCode})</p>
            <p>-{formatPriceINR(promoData.discount)}</p>
          </div>
        )}

        <hr />

        <div className="cart-total-details">
          <b>Total</b>
          <b>{formatPriceINR(totalINR)}</b>
        </div>

        {subtotalINR > 0 && (
          <div
            className={`delivery-banner ${
              subtotalINR < 500 ? "warning" : "free"
            }`}
          >
            {subtotalINR < 500
              ? "⚠️ Orders below ₹500 will incur a ₹40 delivery charge."
              : "🎉 Free Delivery on orders above ₹500!"}
          </div>
        )}

        <button type="submit" className="place-order-btn" disabled={loading}>
          {loading ? "Processing..." : "Place Order"}
        </button>
      </div>
    </form>
  );
};

export default PlaceOrder;
