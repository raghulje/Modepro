const express = require('express');
const router = express.Router();
const controller = require('../controllers/footerController');
const { authenticate, authorize } = require('../middlewares/auth');

const write = [authenticate, authorize(['admin', 'super_admin', 'editor'])];

router.get('/footer', controller.getFooter);
router.get('/footer/admin', ...write, controller.getFooterAdmin);
router.put('/footer', ...write, controller.updateFooter);
router.get('/nav-links', controller.getNavigation);

module.exports = router;
