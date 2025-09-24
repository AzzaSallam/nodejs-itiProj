import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      minLength: [5, "Product name must be at least 5 characters"],
      maxLength: [50, "Product name must be at most 50 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      minLength: [5, "Description must be at least 5 characters"],
      maxLength: [500, "Description must be at most 500 characters"],
    },
    photo: {
        type: String,
        required: true,
    },
    sellerId: {
      type: mongoose.Types.ObjectId,
      ref: "User", 
    },
  },
  { timestamps: true }
);

const productModel = mongoose.model('Product' , productSchema);
export default productModel ;