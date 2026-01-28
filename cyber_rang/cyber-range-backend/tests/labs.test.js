const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/User.model');
const Lab = require('../src/models/Lab.model');
const LabCategory = require('../src/models/LabCategory.model');
const { hashPassword } = require('../src/utils/hashHelper.util');

describe('Lab Endpoints', () => {
    let token;
    let labId;

    beforeAll(async () => {
        const url = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/cyber-range-test-labs';
        await mongoose.connect(url);

        await User.deleteMany({});
        await Lab.deleteMany({});
        await LabCategory.deleteMany({});

        const hashedPassword = await hashPassword('password123');
        const category = await LabCategory.create({ name: 'Web', description: 'Web' });
        await User.create({
            username: 'labtester',
            email: 'labs@example.com',
            password: hashedPassword,
            isVerified: true
        });

        const loginRes = await request(app)
            .post('/api/v1/auth/login')
            .send({ email: 'labs@example.com', password: 'password123' });
        token = loginRes.body.accessToken;

        const lab = await Lab.create({
            name: 'Test Lab SQLi',
            description: 'A test lab long enough for joi validation',
            difficulty: 'easy',
            category: category._id,
            dockerImage: 'alpine',
            points: 100,
            flag: 'FLAG{TEST_SQLI}'
        });
        labId = lab._id.toString();
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    it('should list all labs', async () => {
        const res = await request(app)
            .get('/api/v1/labs')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBeTruthy();
    });

    it('should get a lab by ID', async () => {
        const res = await request(app)
            .get(`/api/v1/labs/${labId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body.name).toBe('Test Lab SQLi');
    });
});
