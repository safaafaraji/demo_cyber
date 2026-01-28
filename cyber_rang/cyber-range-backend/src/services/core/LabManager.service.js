const Lab = require('../../models/Lab.model');
const LabCategory = require('../../models/LabCategory.model');

class LabManagerService {
    async getAllLabs(filter = {}) {
        return await Lab.find(filter).populate('category');
    }

    async createLab(labData) {
        const lab = new Lab(labData);
        await lab.save();
        return lab;
    }

    async getLabById(id) {
        return await Lab.findById(id).populate('category');
    }

    async getAllCategories() {
        return await LabCategory.find();
    }

    async verifyFlag(userId, labId, submittedFlag) {
        const { logAction } = require('../../controllers/history.controller');
        const lab = await Lab.findById(labId).select('+flag');
        if (!lab) throw new Error('Lab not found');

        if (lab.flag !== submittedFlag) {
            await logAction(userId, 'FLAG_REJECTED', lab.name, { flag: submittedFlag });
            return { success: false, message: 'Incorrect Flag' };
        }

        // Check if user already completed this lab
        const User = require('../../models/User.model');
        const user = await User.findById(userId);
        if (user.completedLabs && user.completedLabs.includes(labId)) {
            await logAction(userId, 'FLAG_SUCCESS_REPEAT', lab.name);
            return { success: true, message: 'Flag correct! Lab already completed.', alreadyCompleted: true };
        }

        // Update User Stats
        user.completedLabs.push(labId);
        user.stats.labsCompleted += 1;
        user.stats.points += lab.points;
        await user.save();

        await logAction(userId, 'FLAG_SUCCESS', lab.name, { points: lab.points });

        return { success: true, message: 'Flag Correct! Points awarded.', points: lab.points };
    }
}

module.exports = new LabManagerService();
