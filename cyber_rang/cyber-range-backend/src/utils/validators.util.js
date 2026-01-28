const Joi = require('joi');

const validate = (schema, data) => {
    const { error, value } = schema.validate(data, { abortEarly: false });
    if (error) {
        const errorMessage = error.details.map((details) => details.message).join(', ');
        throw new Error(errorMessage);
    }
    return value;
};

module.exports = {
    validate,
};
