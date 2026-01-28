const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/session.controller');
const authenticate = require('../middlewares/authenticate.middleware');

router.use(authenticate);

router.get('/active', sessionController.getActiveSession);
router.post('/start', sessionController.startSession);
router.post('/emergency-stop', sessionController.emergencyStop);
router.post('/:id/stop', sessionController.stopSession);
router.post('/:id/pause', sessionController.pauseSession);
router.post('/:id/resume', sessionController.resumeSession);
router.get('/:id/logs', sessionController.getLogs);


module.exports = router;
