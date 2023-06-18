import Joi from "joi";

export const createSupportRequestCommentValidation = Joi.object({
    message: Joi.string().required()
});