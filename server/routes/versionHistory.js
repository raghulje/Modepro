const express = require('express');
const router = express.Router();
const controller = require('../controllers/versionHistoryController');
const { authenticate } = require('../middlewares/auth');

// All routes require authentication
router.use(authenticate);

router.get('/all', controller.getAllHistory);
router.get('/stats', controller.getStats);
router.post('/restore/:id', controller.restoreVersion);
router.get('/version/:id', controller.getVersion);
router.post('/compare', controller.compareVersions);
router.get('/:entityType/:entityId', controller.getHistory);

module.exports = router;

