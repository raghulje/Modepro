const express = require('express');
const router = express.Router();
const controller = require('../controllers/activityLogController');
const { authenticate } = require('../middlewares/auth');

// All routes require authentication
router.use(authenticate);

router.get('/', controller.getLogs);
router.get('/stats', controller.getStats);
router.get('/export', controller.exportLogs);

module.exports = router;

