const express = require('express');

const courseController = require('../controllers/courseControllers');
const roleMiddleware = require('../middlewares/roleMiddleware');

const router = express.Router();
// http://localhost:3000/courses
router.route('/').get(courseController.getAllCourses);
router.route('/').post(roleMiddleware(["teacher", "admin"]),courseController.createCourse);
router.route('/:slug').get(courseController.getCourse);

router.route('/enroll').post(courseController.enrollCourse);
router.route('/release').post(courseController.releaseCourse);


module.exports = router;
