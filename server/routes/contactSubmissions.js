const router = require('express').Router();
const controller = require('../controllers/contactSubmissionController');

router.post('/', controller.create);

module.exports = router;
