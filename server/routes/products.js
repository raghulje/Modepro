const express = require('express');
const router = express.Router();
const controller = require('../controllers/productsController');
const { authenticate, authorize } = require('../middlewares/auth');

router.get('/products/admin', authenticate, authorize(['admin', 'super_admin', 'editor']), controller.getProductsAdmin);
router.get('/products', controller.getProductsPage);
const write = [authenticate, authorize(['admin', 'super_admin', 'editor'])];

router.put('/products/page', ...write, controller.updateProductsPage);
router.get('/products/categories', controller.getCategories);
router.post('/products/categories', ...write, controller.createCategory);
router.put('/products/categories/:id', ...write, controller.updateCategory);
router.delete('/products/categories/:id', ...write, controller.deleteCategory);
router.post('/products/groups', ...write, controller.createGroup);
router.put('/products/groups/:id', ...write, controller.updateGroup);
router.delete('/products/groups/:id', ...write, controller.deleteGroup);
router.post('/products/items', ...write, controller.createProduct);
router.put('/products/items/:id', ...write, controller.updateProduct);
router.delete('/products/items/:id', ...write, controller.deleteProduct);

module.exports = router;
