const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const labRoutes = require('./lab.routes');
const userRoutes = require('./user.routes');
const sessionRoutes = require('./session.routes');
const healthRoutes = require('./health.routes');
const adminRoutes = require('./admin.routes');
const docsRoutes = require('./docs.routes');
const historyRoutes = require('./history.routes');

// API Root
router.get('/', (req, res) => {
    res.json({
        name: 'Cyber Range API',
        version: '1.0.0',
        status: 'active',
        endpoints: {
            health: '/health',
            auth: '/auth',
            labs: '/labs'
        }
    });
});

router.use('/auth', authRoutes);
router.use('/labs', labRoutes);
router.use('/users', userRoutes);
router.use('/sessions', sessionRoutes);
router.use('/', healthRoutes); // /health
router.use('/admin', adminRoutes);
router.use('/docs', docsRoutes);
router.use('/history', historyRoutes);

module.exports = router;
