import Joi from 'joi';

export const productSchema = Joi.object({
  name: Joi.string().required().min(5).max(20),
  description: Joi.string().required().min(5).max(100),
});