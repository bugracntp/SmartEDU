const express = require('express');
const { body } = require('express-validator');

// CONTROLLERS
const authController = require('../controllers/authControllers');
const authMiddleware = require('../middlewares/authMiddleware');

// MODELS
const UserModel = require('../models/User');

const router = express.Router();
// http://localhost:3000/users/signup

router.route('/signup').post(
    [
        // validation process
        body('name').not().isEmpty().withMessage('Please Enter Your Name'),// name validation
        body('email')
            .isEmail()
            .withMessage('Please Enter Valid Email')
            .custom((userEmail) => {
                return UserModel.findOne({ email: userEmail }).then((user) => {
                    if (user) {
                        return Promise.reject('Email is already exists!');
                    }
                });
            }),// mail validation
        body('password').not().isEmpty().withMessage('Please Enter A Password'),// password validation
    ],
    authController.createUser
);
router.route('/login').post(authController.loginUser);
router.route('/logout').get(authController.logoutUser);
router.route('/dashboard').get(authMiddleware, authController.getDashboardPage);
router.route('/:id').delete(authMiddleware, authController.deleteUser);


module.exports = router;
