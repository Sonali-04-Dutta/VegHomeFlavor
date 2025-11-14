import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const previewOrder = async (req, res) => {
  try {
    const { items, promoCode, userId } = req.body;

    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    let deliveryFee = subtotal < 500 ? 40 : 0;
    let discount = 0;
    let message = "";

    const userOrders = userId ? await orderModel.find({ userId }) : [];
    const isFirstOrder = userOrders.length === 0;

    if (promoCode === "FIRSTFREE" && isFirstOrder && subtotal >= 300) {
      deliveryFee = 0;
      message = "🎉 FIRSTFREE applied — free delivery!";
    } else if (promoCode === "SAVE70" && subtotal >= 700) {
      discount = 70;
      message = "💸 SAVE70 applied — ₹70 off!";
    } else if (promoCode === "SAVE100" && subtotal >= 1000) {
      discount = 100;
      message = "💰 SAVE100 applied — ₹100 off!";
    } else if (promoCode) {
      message = "⚠️ Invalid or inapplicable promo code.";
    }

    const totalAmount = subtotal + deliveryFee - discount;

    res.json({ success: true, subtotal, deliveryFee, discount, totalAmount, message });
  } catch (error) {
    console.error("Preview error:", error);
    res.status(500).json({ success: false, message: "Preview failed" });
  }
};
const placeOrder = async (req, res) => {
  const frontend_url = "http://localhost:5174";

  try {
    const { userId, items, address, promoCode, discount } = req.body;

    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const deliveryFee = subtotal > 0 && subtotal < 500 ? 40 : 0;
    const totalBeforeDiscount = subtotal + deliveryFee;

    // 🧮 If discount exists, create a Stripe coupon dynamically
    let coupon = null;
    if (discount && discount > 0) {
      coupon = await stripe.coupons.create({
        amount_off: Math.round(discount * 100),
        currency: "inr",
        name: promoCode || "Discount",
      });
    }

    // 🧾 Create line items
    const line_items = items.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: { name: item.name },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    if (deliveryFee > 0) {
      line_items.push({
        price_data: {
          currency: "inr",
          product_data: { name: "Delivery Fee" },
          unit_amount: deliveryFee * 100,
        },
        quantity: 1,
      });
    }

    // 🧾 Create checkout session with discount (if any)
    const sessionData = {
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${frontend_url}/verify?success=true&session_id={CHECKOUT_SESSION_ID}&userId=${userId}`,
      cancel_url: `${frontend_url}/verify?success=false`,
      metadata: {
        userId,
        address: JSON.stringify(address),
        items: JSON.stringify(items),
        totalAmount: totalBeforeDiscount - (discount || 0),
      },
    };

    if (coupon) {
      sessionData.discounts = [{ coupon: coupon.id }];
    }

    const session = await stripe.checkout.sessions.create(sessionData);

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.error("Stripe Error:", error.message);
    res.json({ success: false, message: error.message });
  }
};



// ... keep your existing imports and other functions (previewOrder, placeOrder) above

const verifyOrder = async (req, res) => {
  // Accept both boolean and string "true"/"false" for robustness
  const { success, session_id } = req.body;

  try {
    if (!session_id) {
      console.error("Verification Error: missing session_id in request body");
      return res.status(400).json({ success: false, message: "Missing session_id" });
    }

    if (String(success) !== "true") {
      // Payment was cancelled on client side
      return res.json({ success: false, message: "Payment was cancelled by customer" });
    }

    // Retrieve the checkout session and expand payment_intent so we can inspect it
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ["payment_intent"],
    });

    if (!session) {
      console.error("Verification Error: no session returned from Stripe", session_id);
      return res.status(500).json({ success: false, message: "Could not retrieve Stripe session" });
    }

    // Check payment status in multiple ways (Stripe may populate either field)
    const paymentStatus = session.payment_status; // often "paid"
    const paymentIntent = session.payment_intent; // expanded object (may be undefined)
    const paymentIntentStatus = paymentIntent ? paymentIntent.status : undefined; // "succeeded"

    // Debug logging (helpful while developing)
    console.log("Stripe session payment_status:", paymentStatus);
    if (paymentIntent) console.log("Stripe payment_intent.status:", paymentIntentStatus);

    const paid =
      String(paymentStatus) === "paid" ||
      String(paymentIntentStatus) === "succeeded";

    if (!paid) {
      console.error("Verification Error: payment not completed", {
        session_id,
        paymentStatus,
        paymentIntentStatus,
      });
      return res.status(400).json({
        success: false,
        message: "Payment not completed yet. Please try again or contact support.",
        debug: { paymentStatus, paymentIntentStatus },
      });
    }

    // payment succeeded -> proceed to save order
    try {
      const userId = session.metadata?.userId;
      const address = session.metadata?.address ? JSON.parse(session.metadata.address) : {};
      const items = session.metadata?.items ? JSON.parse(session.metadata.items) : [];
      // metadata.totalAmount may be string; keep as-is for record
      const totalAmount = session.metadata?.totalAmount ?? session.amount_total ?? null;

      const newOrder = new orderModel({
        userId,
        items,
        amount: totalAmount,
        address,
        payment: true,
        date: new Date(),
      });

      await newOrder.save();

      if (userId) {
        // try clearing user's cart in DB (non-fatal if it fails)
        try {
          await userModel.findByIdAndUpdate(userId, { cartData: {} });
        } catch (err) {
          console.error("Warning: failed to clear user cart in DB:", err.message);
        }
      }

      return res.json({ success: true, message: "Order placed successfully" });
    } catch (saveErr) {
      console.error("Verification Error (save order):", saveErr);
      return res
        .status(500)
        .json({ success: false, message: "Failed to save order after payment" });
    }
  } catch (error) {
    // Stripe or unexpected error
    console.error("Verification Error (unexpected):", error?.message || error);
    return res
      .status(500)
      .json({ success: false, message: "Verification failed", details: error?.message || error });
  }
};

//user order for frontend
// 🧾 Get all orders for a specific user
const userOrders = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ success: false, message: "Missing userId" });
    }

    const orders = await orderModel.find({ userId }).sort({ date: -1 }); // newest first
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error("❌ Error fetching user orders:", error);
    res.status(500).json({ success: false, message: "Failed to fetch orders" });
  }
};



//listing orders for admin panel 
const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({success:true,data:orders})
  } catch (error) {
    console.log(error);
    res.json({success:false,message:"Error"})
  }
}

//api for updating order status 

const updateStatus = async (req, res) => {
  try {
    await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status });
    res.json({success:true,message:"Status Updated"})
  } catch (error) {
    console.log(error);
    res.json({success:false,message:"Error"})
  }
}

export { placeOrder, verifyOrder, previewOrder,userOrders, listOrders , updateStatus};







