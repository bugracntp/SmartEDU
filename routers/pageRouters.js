const express = require('express');

const pageCountroller = require('../controllers/pageControllers');
const redirectMiddleware = require('../middlewares/redirectMiddleware');

const router = express.Router();

router.route('/').get(pageCountroller.getMainPage);
router.route('/about').get(pageCountroller.getAboutPage);
router.route('/register').get(redirectMiddleware, pageCountroller.getRegisterPage);
router.route('/login').get(redirectMiddleware, pageCountroller.getLoginPage);
router.route('/contact').get(pageCountroller.getContactPage);
router.route('/contact').post(pageCountroller.sendEmail);





module.exports = router;
