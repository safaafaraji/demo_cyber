const express = require('express');
const router = express.Router();
const labController = require('../controllers/lab.controller');
const authenticate = require('../middlewares/authenticate.middleware');
const validate = require('../middlewares/validate.middleware');
const { createLabSchema, verifyFlagSchema } = require('../validators/lab.validator');

router.get('/categories', authenticate, labController.getCategories); // Specific path before param path to avoid conflict
/**
 * @swagger
 * /labs:
 *   get:
 *     summary: Get all labs
 *     tags: [Labs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of labs
 */
router.get('/', authenticate, labController.getLabs);
router.get('/:id', authenticate, labController.getLabById);
router.post('/:id/verify', authenticate, validate(verifyFlagSchema), labController.verifyFlag);
router.post('/', authenticate, validate(createLabSchema), labController.createLab);

module.exports = router;
