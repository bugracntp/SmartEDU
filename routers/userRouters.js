const express = require('express');

const authController = require('../controllers/authControllers');

const router = express.Router();
// http://localhost:3000/users/signup

router.route('/signup').post(authController.createUser);
router.route('/login').post(authController.loginUser);


module.exports = router;
