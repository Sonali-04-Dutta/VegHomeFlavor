import React, { useEffect, useState, useContext } from "react";
import "./verify.css";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { StoreContext } from "../../components/context/StoreContext";
import { toast } from "react-toastify";

const Verify = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("verifying");
  const { url, token, setCartItems } = useContext(StoreContext);

  const success = searchParams.get("success");
  const session_id = searchParams.get("session_id"); // from Stripe
  const userId = searchParams.get("userId");

  useEffect(() => {
    const verifyPayment = async () => {
      if (!session_id) {
        setStatus("error");
        toast.error("Missing session id in URL.");
        return;
      }

      try {
        const response = await axios.post(
          `${url}api/order/verify`,
          { success, session_id }, // send to backend
          { headers: { token } }
        );

        if (response.data.success) {
          // Clear cart on backend (if you have this endpoint)
          try {
            await axios.post(
              `${url}api/order/clear-cart`,
              {},
              { headers: { token } }
            );
          } catch (clearErr) {
            // non-fatal: log and continue
            console.warn("Clear cart error:", clearErr?.message || clearErr);
          }

          // Clear cart on frontend
          setCartItems({});

          localStorage.removeItem("appliedPromo");
          localStorage.removeItem("discount");

          toast.success(response.data.message || "Order placed successfully!");
          setStatus("success");

          setTimeout(() => navigate("/"), 2200);
        } else {
          // Show backend message if present
          const msg = response.data.message || "Payment verification failed.";
          toast.error(msg);
          // optional debug info
          if (response.data.debug) {
            console.warn("Verify debug:", response.data.debug);
          }
          setStatus("cancel");
        }
      } catch (err) {
        console.error("❌ Verify Error:", err);
        // If backend returned JSON with message, show it
        const serverMsg =
          err?.response?.data?.message || "We couldn’t verify your payment. Please try again.";
        toast.error(serverMsg);
        setStatus("error");
      }
    };

    verifyPayment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [success, session_id, url, token, navigate, setCartItems]);

  return (
    <div className="verify-page">
      {status === "verifying" && (
        <div className="verify-card">
          <div className="loader"></div>
          <h2>Verifying your payment...</h2>
          <p>Please wait while we confirm your transaction.</p>
        </div>
      )}

      {status === "success" && (
        <div className="verify-card">
          <div className="verify-icon success">✔</div>
          <h2>Payment Successful 🎉</h2>
          <p>Your order has been confirmed and your cart is now empty.</p>
          <button onClick={() => navigate("/")}>Continue Shopping</button>
        </div>
      )}

      {status === "cancel" && (
        <div className="verify-card">
          <div className="verify-icon cancel">✖</div>
          <h2>Payment Cancelled / Not Verified</h2>
          <p>We couldn't confirm your payment. Please check your card or try again.</p>
          <button onClick={() => navigate("/")}>Return Home</button>
        </div>
      )}

      {status === "error" && (
        <div className="verify-card">
          <div className="verify-icon cancel">⚠</div>
          <h2>Something went wrong</h2>
          <p>We couldn’t verify your payment. Please try again or contact support.</p>
          <button onClick={() => navigate("/")}>Go Home</button>
        </div>
      )}
    </div>
  );
};

export default Verify;
