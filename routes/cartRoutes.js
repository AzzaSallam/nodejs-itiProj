import express from "express";
import { createCart, deleteCart, getCart, updateCart } from "../controllers/cartController.js";
import { authMiddleware, restrictTo } from "../middlewares/authMiddleware.js";


const router = express.Router();

router.use(authMiddleware);

router.route('/').post(restrictTo('user'), createCart)
router.route('/:id').put(restrictTo('user') , updateCart)
                    .delete(restrictTo('user') , deleteCart);
router.route('/:userId').get(restrictTo('user'),getCart);


export default router; 
