import mongoose from "mongoose";


const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true
  },
  products: [
    {
      productId: { type: mongoose.Types.ObjectId, ref: "Product" },
      quantity: { type: Number, default: 1 }
    }
  ]
}, { timestamps: true });

const cartModel = mongoose.model("Cart", cartSchema);

export default cartModel;