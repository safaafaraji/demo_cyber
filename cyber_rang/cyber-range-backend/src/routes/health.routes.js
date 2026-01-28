const express = require('express');
const router = express.Router();
const monitoringController = require('../controllers/monitoring.controller');

router.get('/health', monitoringController.getHealth);
router.get('/metrics', monitoringController.getHealth); // Mock

module.exports = router;
