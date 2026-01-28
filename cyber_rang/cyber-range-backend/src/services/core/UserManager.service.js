const User = require('../../models/User.model');
const { hashPassword } = require('../../utils/hashHelper.util');

class UserManagerService {
    async getUserProfile(userId) {
        return await User.findById(userId).select('-password');
    }

    async updateUserStats(userId, stats) {
        return await User.findByIdAndUpdate(userId, { $set: { stats } }, { new: true });
    }

    async updateProfile(userId, updateData) {
        if (updateData.password) {
            updateData.password = await hashPassword(updateData.password);
        }
        return await User.findByIdAndUpdate(userId, { $set: updateData }, { new: true }).select('-password');
    }
}

module.exports = new UserManagerService();
