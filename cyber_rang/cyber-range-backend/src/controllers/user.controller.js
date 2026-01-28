const UserManager = require('../services/core/UserManager.service');

const getProfile = async (req, res, next) => {
    try {
        const user = await UserManager.getUserProfile(req.user._id);
        res.json(user);
    } catch (error) {
        next(error);
    }
};

const updateProfile = async (req, res, next) => {
    try {
        const { username, password, githubProfile, profilePicture } = req.body;
        const updateData = {};
        if (username) updateData.username = username;
        if (password) updateData.password = password;
        if (githubProfile !== undefined) updateData.githubProfile = githubProfile;
        if (profilePicture !== undefined) updateData.profilePicture = profilePicture;

        const user = await UserManager.updateProfile(req.user._id, updateData);
        res.json({ message: 'Profile updated successfully', user });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getProfile,
    updateProfile,
};
