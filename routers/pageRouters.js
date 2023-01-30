const express = require('express');

const pageCountroller = require('../controllers/pageControllers');

const router = express.Router();

router.route('/').get(pageCountroller.getMainPage);
router.route('/about').get(pageCountroller.getAboutPage);
router.route('/register').get(pageCountroller.getRegisterPage);
router.route('/login').get(pageCountroller.getLoginPage);



module.exports = router;
