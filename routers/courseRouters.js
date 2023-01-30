const express = require('express');

const courseCountroller = require('../controllers/courseControllers');

const router = express.Router();
// http://localhost:3000/courses
router.route('/').get(courseCountroller.getAllCourses);

router.route('/').post(courseCountroller.createCourse);

router.route('/:slug').get(courseCountroller.getCourse);


module.exports = router;
