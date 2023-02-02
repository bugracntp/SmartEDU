const bcrypt = require('bcrypt'); // şifreleri criptlolamak için kullandığımız kütüphane

// models
const UserModel = require('../models/User');
const CourseModel = require('../models/Course');
const CategoryModel = require('../models/Category');

exports.createUser = async (req, res) => {
    try {
        await UserModel.create(req.body);
        res.status(201).redirect('/login');
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            error,
        });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        await UserModel.findOne({ email: email }, (err, user) => {
            if (user) {
                bcrypt.compare(password, user.password, (err, same) => {
                    req.session.userID = user._id;
                    // USER SESSION
                    res.status(200).redirect('/users/dashboard');
                });
            }
        })
            .clone()
            .catch(function (err) {
                console.log(err);
            });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            error,
        });
    }
};

exports.logoutUser = async (req, res) => {
    req.session.destroy(() => res.redirect('/'));
};

exports.getDashboardPage = async (req, res) => {
    try {
        const user = await UserModel.findOne({
            _id: req.session.userID,
        }).populate('courses');
        const categories = await CategoryModel.find({});

        let filter = req.session.userID;
        const courses = await CourseModel.find({ user: filter }).sort(
            '-createdAt'
        );

        res.status(200).render('dashboard', {
            user,
            courses,
            categories,
            page_name: 'dashboard',
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            error,
        });
    }
};
