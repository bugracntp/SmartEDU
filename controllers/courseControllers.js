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
        res.status(201).redirect('courses');
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
        res.status(200).redirect('/users/dashboard');
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            error,
        });
    }
};

exports.releaseCourse = async (req, res) => {
    try {
        const user = await UserModel.findById(req.session.userID);
        await user.courses.pull({ _id: req.body.course_id });
        await user.save();
        res.status(200).redirect('/users/dashboard');
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            error,
        });
    }
};
