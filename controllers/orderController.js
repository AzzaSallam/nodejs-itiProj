import OrderModel from "../models/orderModel.js";
import CartModel from "../models/cartModel.js";
import AppError from "../utils/AppError.js";

const createOrder = async (req, res , next) => {
  try {
    const userId = req.user.id;

    const cart = await CartModel.findOne({ userId }).populate("products.productId");
    if (!cart || cart.products.length === 0) {
      return next(new AppError(400 , "Cart is empty "))
    }

    const newOrder = new OrderModel({
      userId,
      products: cart.products,
      paymentMethod: req.body.paymentMethod || "COD"
    });

    const savedOrder = await newOrder.save();

    cart.products = [];
    await cart.save();

    res.status(201).json({ message: "Order created successfully", order: savedOrder });
  } catch (err) {
    next(new AppError(500 , err.message))
  }
};

// GET USER ORDERS
const getUserOrders = async (req, res , next) => {
  try {
    const userId = req.user.id;

    const orders = await OrderModel.find({ userId }).populate("products.productId").sort({ createdAt: -1 });

    res.status(200).json({ data: orders });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export { createOrder  , getUserOrders };