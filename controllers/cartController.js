import cartModel from "../models/cartModel.js";
import AppError from "../utils/AppError.js";

// CREATE CART
const createCart = async (req, res , next) => {
  try {
    if (!req.user || !req.user.id) {
      // return res.status(400).json({ error: "User ID is missing from request" });
      return next(new AppError(400 , "User ID is missing from request"))
    }


    const existingCart = await cartModel.findOne({ userId: req.user.id });
    console.log(existingCart);

    if (existingCart) {
      existingCart.products.push(...req.body.products); 
      const updatedCart = await existingCart.save();
      return res.status(200).json(updatedCart);
    }

    const newCart = new cartModel({
      userId: req.user.id,
      products: req.body.products
    });

    const savedCart = await newCart.save();
    res.status(201).json(savedCart);

  } catch (err) {
    // res.status(500).json({ error: err.message });
    next(new AppError(500 , err.message))
    
  }
};

// UPDATE CART
const updateCart = async (req, res , next) => {
  try {
    const cart = await cartModel.findById(req.params.id);
    if (!cart) return next(new AppError(404 , "Cart not found"));

    if (req.user.id === cart.userId.toString() || req.user.role === "admin") {
      cart.products.push(...req.body.products); 
      const updatedCart = await cart.save();
      res.status(200).json(updatedCart);
    } else {
      return next(new AppError(403 , "You can update only your cart!"))
    }
  } catch (err) {
    next(new AppError(500 , err.message))
  }
};

// GET USER CART
const getCart = async (req, res , next) => {
  try {
    const cart = await cartModel.findOne({ userId: req.params.userId }).populate("products.productId");
    if (!cart) return next(new AppError(404 , "Cart not found"));
    res.status(200).json(cart);
  } catch (err) {
    next(new AppError(500 , err.message))
  }
};

// DELETE CART
const deleteCart = async (req, res , next) => {
  try {
    const cart = await cartModel.findById(req.params.id);
    if (!cart) return next(new AppError(404 , "Cart not found"));

    if (req.user.id === cart.userId.toString() || req.user.role === "admin") {
      await cartModel.findByIdAndDelete(req.params.id);
      res.status(200).json("Cart has been deleted");
    } else {
      return next(new AppError(403 , "You can delete only your cart!"))
    }
  } catch (err) {
    next(new AppError(500 , err.message))
  }
};

export { createCart, updateCart, getCart, deleteCart };
