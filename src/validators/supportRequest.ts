import Joi from "joi";

export const createSupportRequestValidation = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required()
});

export const updateSupportRequestValidation = Joi.object({
    status: Joi.string().valid('open', 'escalated', 'closed').optional(),
    assignee: Joi.string().optional()
});