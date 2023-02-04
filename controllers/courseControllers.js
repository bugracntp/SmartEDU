const UserModel = require('../models/User');
const CourseModel = require('../models/Course');
const CategoryModel = require('../models/Category');

exports.getAllCourses = async (req, res) => {
    try {
        const categorySlug = req.query.categories;
        const searchQuery = req.query.search;
        const category = await CategoryModel.findOne({ slug: categorySlug });

        let filter = {};
        if (categorySlug) {
            filter = { category: category._id };
        }
        if (searchQuery) {
            filter = { name: searchQuery };
        }
        if (!searchQuery && !categorySlug) {
            filter.name = '';
            filter.category = null;
        }

        const courses = await CourseModel.find({
            $or: [
                { name: { $regex: '.*' + filter.name + '.*', $options: 'i' } },
                { category: filter.category },
            ],
        })
            .sort('-createdAt')
            .populate('user');

        const categories = await CategoryModel.find();
        res.status(200).render('courses', {
            courses,
            categories,
            page_name: 'courses',
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            error,
        });
    }
};

exports.getCourse = async (req, res) => {
    try {
        const user = await UserModel.findById(req.session.userID);
        const course = await CourseModel.findOne({
            slug: req.params.slug,
        }).populate('user');

        const categories = await CategoryModel.find();
        res.status(200).render('course', {
            course,
            categories,
            user,
            page_name: 'courses',
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            error,
        });
    }
};

exports.createCourse = async (req, res) => {
    try {
        await CourseModel.create({
            name: req.body.name,
            description: req.body.description,
            category: req.body.category,
            user: req.session.userID,
        });
        req.flash('success', `${req.body.name} has been succesfully`);
        res.status(201).redirect('courses');
    } catch (error) {
        req.flash('error', `${req.body.name} has been failed`);
        res.status(400).redirect('courses');
    }
};

exports.deleteCourse = async (req, res) => {
    try {
        const course = await CourseModel.findOneAndRemove({
            slug: req.params.slug,
        });
        req.flash('success', `${course.name} has been removed successfully`);
        res.status(200).redirect('/users/dashboard');
    } catch (error) {
        req.flash(
            'error',
            `${course.name} named course could not removed successfully`
        );
        res.status(200).redirect('/users/dashboard');
    }
};

exports.updateCourse = async (req, res) => {
    try {
        const course = await CourseModel.findOne({ slug: req.params.slug });
        course.name = req.body.name;
        course.description = req.body.description;
        course.category = req.body.category;
        course.save();

        res.status(200).redirect('/users/dashboard');
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            error,
        });
    }
};

exports.enrollCourse = async (req, res) => {
    try {
        const user = await UserModel.findById(req.session.userID);
        await user.courses.push({ _id: req.body.course_id });
        await user.save();
        req.flash('success', 'You enroll the course succesfully');
        res.status(200).redirect('/users/dashboard');
    } catch (error) {
        req.flash('error', 'You can not enroll the course succesfully');
        res.status(400).redirect('/users/dashboard');
    }
};

exports.releaseCourse = async (req, res) => {
    try {
        const user = await UserModel.findById(req.session.userID);
        await user.courses.pull({ _id: req.body.course_id });
        await user.save();
        req.flash('success', 'You release the course succesfully');
        res.status(200).redirect('/users/dashboard');
    } catch (error) {
        req.flash('error', 'You can not release the course succesfully');
        res.status(400).redirect('/users/dashboard');
    }
};
