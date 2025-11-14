import React, { useState, useEffect, useContext } from "react";
import "./MyOrder.css";
import axios from "axios";
import { StoreContext } from "../../components/context/StoreContext";
import { assets } from "../../assets/assets";

const MyOrder = () => {
  const { url, token } = useContext(StoreContext);
  const [data, setData] = useState([]);

  const fetchOrders = async () => {
    try {
      const response = await axios.post(
        `${url}api/order/userorders`,
        {},
        { headers: { token } }
      );
      setData(response.data.data || []);
      console.log("User Orders:", response.data.data);
    } catch (error) {
      console.error("❌ Error fetching orders:", error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

//  const getStatusClass = (status) => {
//   if (!status) return "status-badge default";
//   const lower = status.toLowerCase();

//   if (lower.includes("deliver")) return "status-badge delivered";
//   if (
//     lower.includes("prepar") ||
//     lower.includes("out") ||
//     lower.includes("process")
//   )
//     return "status-badge food-processing"; // 💖 use pink badge
//   if (lower.includes("cancel") || lower.includes("fail"))
//     return "status-badge cancelled";

//   return "status-badge default";
// };


  const getStatusClass = (status) => {
  switch (status) {
    case "Food Processing":
      return "status-badge food-processing";
    case "Out for delivery":
      return "status-badge out-for-delivery";
    case "Delivered":
      return "status-badge delivered";
    default:
      return "status-badge default";
  }
};

  
  
  return (
    <div className="my-orders">
      <h2>My Orders</h2>

      {data.length === 0 ? (
        <div className="no-orders">
                  {/* <img src={assets.empty_box} alt="No Orders" /> */}
                  <img
  src={assets.empty_box || "https://cdn-icons-png.flaticon.com/512/4076/4076549.png"}
  alt="No Orders"
/>

          <h3>No Orders Yet</h3>
          <p>Looks like you haven’t placed any orders yet.</p>
          <a href="/" className="shop-now-btn">
            Start Shopping
          </a>
        </div>
      ) : (
        <div className="container">
          {data.map((order, index) => (
            <div key={index} className="my-orders-order">
              <img src={assets.parcel_icon} alt="parcel" />

              <p>
                {order.items.map((item, i) =>
                  i === order.items.length - 1
                    ? `${item.name} x ${item.quantity}`
                    : `${item.name} x ${item.quantity}, `
                )}
              </p>

              <p>₹{order.amount}.00</p>
              <p>Items: {order.items.length}</p>

              <div className={getStatusClass(order.status)}>
                {order.status || "Unknown"}
              </div>

              <button onClick={fetchOrders}>Track Order</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrder;
