import Joi from "joi";

export const userSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(15)
    .required()
    .messages({
      "string.base": "Name must be a string",
      "string.empty": "Name is required",
      "string.min": "Name must be at least 3 characters long",
      "string.max": "Name must be at most 15 characters long",
      "any.required": "Name is required"
    }),

  username: Joi.string()
    .min(5)
    .required()
    .messages({
      "string.base": "Username must be a string",
      "string.empty": "Username is required",
      "string.min": "Username must be at least 5 characters long",
      "any.required": "Username is required"
    }),

  email: Joi.string()
    .pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
    .required()
    .messages({
      "string.empty": "Email is required",
      "string.pattern.base": "Please enter a valid email",
      "any.required": "Email is required"
    }),

  password: Joi.string()
    .required()
    .messages({
      "string.empty": "Password is required",
      "string.pattern.base": "Password must contain at least 1 letter, 1 number, and be at least 8 characters long",
      "any.required": "Password is required"
    }),

  role: Joi.string()
    .valid("admin", "user", "seller")
    .default("user")
    .messages({
      "any.only": "Role must be either admin, user, or seller"
    })
});

