import AppError from "../utils/AppError.js";

export const validateMiddleWare = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false }); 

    if (error) {
      const errors = error.details.map((err) => err.message);
      next(new AppError(400, "Validation failed") );
    }

    next(); 
  };
};
