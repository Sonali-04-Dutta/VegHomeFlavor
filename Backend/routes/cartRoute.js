import express from "express"
import { addToCart, removeToCart, getCart } from "../controllers/cartControllers.js"
import authMiddleware from "../middlewares/auth.js";

const cartRouter = express.Router();

cartRouter.post("/add",authMiddleware, addToCart);
cartRouter.post("/remove",authMiddleware, removeToCart);
cartRouter.post("/get",authMiddleware, getCart);



export default cartRouter;
