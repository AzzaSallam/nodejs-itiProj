import jwt from "jsonwebtoken";
import AppError from "../utils/AppError.js";

export const authMiddleware = (req, res, next) => {

  const {authorization} = req.headers;


  const token = authorization?.startsWith("Bearer ") ? authorization?.split(" ")[1] : authorization;

  if(!token) {
    return next(new AppError(401 , "must be logged in"));
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET);

    req.user = {
      id: decoded.id,
      username: decoded.username,
      role: decoded.role,
    };

    next();
  } catch (err) {
      new AppError(401 , "You are not authenticated")
  }

};

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError(401 , "You are not authenticated"))
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError(403 , "You don't have permission to do this action"))
    }

    next();
  };
};