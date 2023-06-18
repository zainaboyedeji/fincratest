import Joi from "joi";

export const createAuthValidation = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});