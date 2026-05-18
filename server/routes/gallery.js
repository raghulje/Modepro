const express = require('express');
const router = express.Router();
const controller = require('../controllers/galleryController');
const { authenticate, authorize } = require('../middlewares/auth');

const write = [authenticate, authorize(['admin', 'super_admin', 'editor'])];

router.get('/gallery', controller.getGallery);
router.get('/gallery/banner-slides', controller.getBannerSlides);
router.post('/gallery/banner-slides', ...write, controller.createBannerSlide);
router.put('/gallery/banner-slides/:id', ...write, controller.updateBannerSlide);
router.delete('/gallery/banner-slides/:id', ...write, controller.deleteBannerSlide);
router.get('/gallery/images', controller.getImages);
router.post('/gallery/images', ...write, controller.createImage);
router.put('/gallery/images/:id', ...write, controller.updateImage);
router.delete('/gallery/images/:id', ...write, controller.deleteImage);

module.exports = router;
