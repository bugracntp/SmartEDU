const express = require('express');

const categoryControllers = require('../controllers/categoryControllers');

const router = express.Router();

// http://localhost:3000/categories
router.route('/').get(categoryControllers.createCategory);


module.exports = router;
