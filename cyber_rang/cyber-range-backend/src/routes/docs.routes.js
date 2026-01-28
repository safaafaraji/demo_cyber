const express = require('express');
const router = express.Router();
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('../config/swagger.config');

router.use('/', swaggerUi.serve);
router.get('/', swaggerUi.setup(swaggerSpecs));

module.exports = router;
