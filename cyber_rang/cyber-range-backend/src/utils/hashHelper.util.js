const bcrypt = require('bcryptjs');
const { bcrypt: bcryptConfig } = require('../config/security.config');

const hashPassword = async (password) => {
    return await bcrypt.hash(password, bcryptConfig.saltRounds);
};

const comparePassword = async (password, hash) => {
    return await bcrypt.compare(password, hash);
};

module.exports = {
    hashPassword,
    comparePassword,
};
