import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true
  },
  products: [
    {
      productId: { type: mongoose.Types.ObjectId, ref: "Product" },
      quantity: { type: Number, default: 1 }
    }
  ],
  paymentMethod: {
    type: String,
    enum: ["COD", "Online"],
    default: "COD"
  },
  status: {
    type: String,
    enum: ["pending", "completed", "cancelled"],
    default: "pending"
  }
}, { timestamps: true });


const orderModel = mongoose.model("Order", orderSchema);

export default orderModel;