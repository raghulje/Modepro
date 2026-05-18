const express = require('express');
const router = express.Router();
const controller = require('../controllers/homeController');
const { authenticate, authorize } = require('../middlewares/auth');

const write = [authenticate, authorize(['admin', 'super_admin', 'editor'])];

router.get('/home', controller.getHome);
router.get('/home/welcome', controller.getWelcome);
router.put('/home/welcome', ...write, controller.updateWelcome);
router.get('/home/hero-slides', controller.getHeroSlides);
router.post('/home/hero-slides', ...write, controller.createHeroSlide);
router.put('/home/hero-slides/:id', ...write, controller.updateHeroSlide);
router.delete('/home/hero-slides/:id', ...write, controller.deleteHeroSlide);
router.get('/home/feature-cards', controller.getFeatureCards);
router.post('/home/feature-cards', ...write, controller.createFeatureCard);
router.put('/home/feature-cards/:id', ...write, controller.updateFeatureCard);
router.delete('/home/feature-cards/:id', ...write, controller.deleteFeatureCard);

module.exports = router;
