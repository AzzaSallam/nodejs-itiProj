import express from "express";
import { authMiddleware, restrictTo } from "../middlewares/authMiddleware.js";
import { createOrder, getUserOrders } from "../controllers/orderController.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/",restrictTo('user') ,createOrder);         
router.get("/",restrictTo('user') ,getUserOrders);     

export default router;

