const express = require('express');
const router = express.Router();
const historyController = require('../controllers/history.controller');
const authenticate = require('../middlewares/authenticate.middleware');

router.get('/', authenticate, historyController.getUserHistory);

module.exports = router;
