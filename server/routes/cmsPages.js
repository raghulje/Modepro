const express = require('express');
const router = express.Router();
const controller = require('../controllers/cmsPagesController');
const { authenticate, authorize } = require('../middlewares/auth');

const write = [authenticate, authorize(['admin', 'super_admin', 'editor'])];

router.get('/cms-pages', controller.listPages);
router.get('/cms-pages/seo', controller.getPageSeo);
router.put('/cms-pages/seo', ...write, controller.updatePageSeo);
router.get('/cms-pages/:slug', controller.getPage);
router.put('/cms-pages/:slug', ...write, controller.updatePage);

module.exports = router;
