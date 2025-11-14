import express from "express";
import authMiddleware from "../middlewares/auth.js";
import {
  placeOrder,
  verifyOrder,
  previewOrder,
  userOrders,
  listOrders,
  updateStatus
} from "../controllers/orderControllers.js";

const orderRouter = express.Router();

orderRouter.post("/place", authMiddleware, placeOrder);
orderRouter.post("/verify", verifyOrder);
orderRouter.post("/preview", authMiddleware, previewOrder);
orderRouter.post("/userOrders",authMiddleware,userOrders);
orderRouter.get("/list", listOrders)
orderRouter.post("/status",updateStatus)

export default orderRouter;
