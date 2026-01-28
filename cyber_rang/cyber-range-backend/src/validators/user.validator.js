const Joi = require('joi');

const updateProfileSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30),
    password: Joi.string().min(8).allow(''),
    githubProfile: Joi.string().uri().allow(''),
    profilePicture: Joi.string().uri().allow('')
}).min(1); // At least one field must be provided

module.exports = {
    updateProfileSchema
};
