const express = require('express');
const router = express.Router();
const controller = require('../controllers/aboutController');
const { authenticate, authorize } = require('../middlewares/auth');

const write = [authenticate, authorize(['admin', 'super_admin', 'editor'])];

router.get('/about', controller.getAbout);
router.get('/about/page', controller.getAboutPage);
router.put('/about', ...write, controller.updateAboutPage);
router.get('/about/info-cards', controller.getInfoCards);
router.post('/about/info-cards', ...write, controller.createInfoCard);
router.put('/about/info-cards/:id', ...write, controller.updateInfoCard);
router.delete('/about/info-cards/:id', ...write, controller.deleteInfoCard);

module.exports = router;
