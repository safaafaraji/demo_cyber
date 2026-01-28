const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/session.controller');
const authenticate = require('../middlewares/authenticate.middleware');

router.use(authenticate);

router.get('/active', sessionController.getActiveSession);
router.post('/start', sessionController.startSession);
router.post('/:id/stop', sessionController.stopSession);

module.exports = router;
