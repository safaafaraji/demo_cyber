const mongoose = require('mongoose');
const User = require('../../models/User.model');
const { hashPassword } = require('../../utils/hashHelper.util');
require('dotenv').config({ path: '../../.env' });

async function createUser() {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/cyber-range');

    try {
        const existingUser = await User.findOne({ email: 'user@example.com' });
        if (existingUser) {
            console.log('User already exists');
            process.exit(0);
        }

        const hashedPassword = await hashPassword('user123');

        await User.create({
            username: 'student_01',
            email: 'user@example.com',
            password: hashedPassword,
            role: 'user',
            stats: { labsCompleted: 0, points: 0 }
        });

        console.log('Regular User created! (email: user@example.com / pass: user123)');
    } catch (err) {
        console.error(err);
    } finally {
        process.exit();
    }
}

createUser();
