import Joi from "joi";

export const createUserValidation = Joi.object({
  name: Joi.string().required(),
  username: Joi.string().required(),
  password: Joi.string().required(),
  role: Joi.string().valid('user', 'support', 'admin').default('user')
});