const Joi = require('joi');

const createLabSchema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    description: Joi.string().min(10).required(),
    difficulty: Joi.string().valid('easy', 'medium', 'hard', 'expert').required(),
    category: Joi.string().hex().length(24).required(), // MongoDB ObjectId
    dockerImage: Joi.string().required(),
    points: Joi.number().min(0).max(10000).required(),
    flag: Joi.string().min(5).required()
});

const verifyFlagSchema = Joi.object({
    flag: Joi.string().required()
});

module.exports = {
    createLabSchema,
    verifyFlagSchema
};
