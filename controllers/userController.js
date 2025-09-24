import usersModel from "../models/userModel.js";
import AppError from "../utils/AppError.js";
import crypto from "crypto";

import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendEmail } from "../utils/SendEmail.js";

const getAllUsers =async (req , res , next)=>{
    try{
        let users = await usersModel.find();
        res.status(200).json({data : users , status : 'success'})
    }catch(err){
        next(new AppError(500 , err.message))

    }
}

// const getUserById = async (req , res , next)=>{
//     const {id} = req.params;
//     try{
//         let user = await usersModel.findById(id);
//         if(!user) {
//             // return res.status(404).json({message : "user doesn't exist" , status : "faild"});
//             return next(new AppError(404 , "User doesn't exist"))
//         }
//         res.status(200).json({data : user})
//     }catch(err){
//         // res.status(400).json({message : err.message , status : "error"})

//         next(new AppError(400 , err.message))

//     }
// }

const addUser = async (req ,res , next) =>{
    let user = req.body;
    try{
        let newUser = await usersModel.create(user);
        res.status(201).json({data : newUser , status : 'success'})
    }catch(err){
        return next(new AppError(400 , err.message))

    }
}

const deleteUser = async (req , res , next)=>{
    const {id} = req.params ;
   try {
        const deletedUser = await usersModel.findByIdAndDelete(id);
        if (!deletedUser) {
            return next(new AppError(404 , "User doesn't exist"))
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        return next(new AppError(500 , err.message))

    }
}

const editUser = async (req , res , next)=>{
    const {id} = req.params ;
    const updates = req.body ;

    try {
        const updatedUser = await usersModel.findByIdAndUpdate(
            id,
            updates,
            { new: true, runValidators: true }
        );

        if(!updatedUser){
            return next(new AppError(404 , "User doesn't exist"))

        }

        res.status(200).json({message : "User Updated Successfully" , user : updatedUser});

    } catch (err) {
        if (err.name === 'ValidationError') {
            return next(new AppError(400 , err.message))
        }
        return next(new AppError(500 , "error while writing file"))
        
    }
}

 const login = async (req, res , next) => {
  try {
    const { username, password } = req.body;

    const user = await usersModel.findOne({ username });
    if (!user) return next(new AppError(400 , "Invalid username or password"));

    const isMatch = await bcryptjs.compare(password, user.password);
if (!isMatch) return next(new AppError(400 , "Invalid username or password"));

    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({ token, id: user._id, username: user.username, role: user.role });
  } catch (err) {
    next(new AppError(500 , err.message))
  }
};

const register = async (req, res, next) => {
  try {
    const { name, username, email, password, role } = req.body;

    if (!name || !username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await usersModel.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      next(new AppError(400 , "Email or Username already exists"))
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    const newUser = new usersModel({
      name,
      username,
      email,
      password: hashedPassword,
      role
    });

    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, username: newUser.username, role: newUser.role },
      process.env.SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "User registered successfully",
      userId: newUser._id,
      token
    });

  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (req, res , next) => {
  try {
    const { email } = req.body;

    const user = await usersModel.findOne({ email });
    if (!user) return next(new AppError(404 , "User with this email does not exist"));

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000; 

    await user.save();

    const resetURL = `http://localhost:3000/reset-password?token=${resetToken}`; 
    const message = `Hi ${user.username},\n\nUse this link to reset your password: \n${resetURL}\n\nThis link will expire in 10 minutes.`;

    await sendEmail(user.email, "Password Reset", message);

    res.status(200).json({ message: "Password reset email sent" });
  } catch (err) {
    next(new AppError(500 , err.message))  
  }
};

const resetPassword = async (req, res , next) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return next(new AppError(400 , "Token and new password are required"))
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await usersModel.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) return next(new AppError(400 , "Invalid or expired token"));

    user.password = await bcryptjs.hash(newPassword, 10);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    next(new AppError(500 , err.message))
  }
};


export {getAllUsers , addUser , deleteUser , editUser , login , register , forgotPassword , resetPassword} ;