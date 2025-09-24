import mongoose from 'mongoose';
import productModel from '../models/productModel.js';
import AppError from '../utils/AppError.js';
import { productSchema } from '../validation/productValidation.js';


const getAll = async (req, res, next) => {
   try {
    let products;

    if (req.user && req.user.role === "seller") {
      products = await productModel.find({
        sellerId: new mongoose.Types.ObjectId(req.user.id) 
      }).populate("sellerId", "name");
    } else {
      products = await productModel
        .find()
        .populate("sellerId", "name");
    }

    res.status(200).json({ data: products, status: "success" });
  } catch (err) {
    next(new AppError(500 , err.message));

  }
};


const addNew = async (req, res, next) => {
  try {
    const { error, value } = productSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        status: "fail",
        message: error.details.map((err) => err.message),
      });
    }

    const newProduct = new productModel({
      ...value,
      sellerId: req.user.id,
      photo: req.file?.filename || null,
    });

    const savedProduct = await newProduct.save();

    const populatedProduct = await productModel
      .findById(savedProduct._id)
      .populate("sellerId", "name");

    res.json({
      status: "success",
      data: populatedProduct,
    });
  } catch (err) {
    next(new AppError(500 , err.message))
  }
};

const edit = async(req , res , next)=>{
    const {id} = req.params;
    const {name} = req.body ;

    try {
        const updatedProduct = await productModel.findByIdAndUpdate(
            id,
            {name},
            { new: true, runValidators: true }
        );

        if(!updatedProduct){
            return next(new AppError(404 ,"Product not found"))

        }

        res.status(200).json({message : "Product Updated Successfully" , product : updatedProduct});

    } catch (err) {
        if (err.name === 'ValidationError') {
            return next(new AppError(400 , err.message))

        }

        return  next(new AppError(500 , 'error while writing file' ))
    }
}

const deleteProduct =async (req , res , next)=>{
    const {id} = req.params ;

   try {
        const deletedProduct = await productModel.findByIdAndDelete(id);
        if (!deletedProduct) {
        return next(new AppError(504 , 'Product not found'))
            return 
        }
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (err) {

        return next(new AppError(500 , err.message))
    }
}

const searchProducts = async (req, res, next) => {
  try {
    const { q } = req.query; 

    if (!q) {
      const allProducts = await productModel
        .find()
        .populate("sellerId", "name -_id");
      return res.status(200).json({ status: "success", data: allProducts });
    }

    const products = await productModel
      .find({
        $or: [
          { name: { $regex: q, $options: "i" } }, 
        ],
      })
      .populate({
        path: "sellerId",
        match: { name: { $regex: q, $options: "i" } }, 
        select: "name -_id",
      });

    const filtered = products.filter(
      (p) => p.sellerId !== null || p.name.toLowerCase().includes(q.toLowerCase())
    );

    res.status(200).json({ status: "success", data: filtered });
  } catch (err) {
    next(new AppError(500, err.message));
  }
};


export {getAll ,addNew , edit , deleteProduct , searchProducts} ;