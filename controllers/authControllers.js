const bcrypt = require('bcrypt'); // şifreleri criptlolamak için kullandığımız kütüphane
const { validationResult } = require('express-validator');
const flash = require('connect-flash');

// MODELS
const UserModel = require('../models/User');
const CourseModel = require('../models/Course');
const CategoryModel = require('../models/Category');

exports.createUser = async (req, res) => {
    try {
        await UserModel.create(req.body);
        res.status(201).redirect('/login');
    } catch (error) {
        const errors = validationResult(req);
        for (let i = 0; i < errors.array().length; i++)
            req.flash('error', `${errors.array()[i].msg}`);
        res.status(400).redirect('/register');
    }
};

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    await UserModel.findOne({ email: email }, (err, user) => {
        if (user) {
            bcrypt.compare(password, user.password, (err, same) => {
                if (same) {
                    req.session.userID = user._id;
                    // USER SESSION
                    res.status(200).redirect('/users/dashboard');
                } else {
                    req.flash('error', 'Your password is not correct!');
                    res.status(400).redirect('/login');
                }
            });
        } else {
            req.flash('error', 'User is not exist!');
            res.status(400).redirect('/login');
        }
    })
        .clone()
        .catch(function (err) {
            console.log(err);
        });
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

        const users = await UserModel.find({});

        res.status(200).render('dashboard', {
            user,
            users,
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

exports.deleteUser = async (req, res) => {
    try {
        await UserModel.findByIdAndRemove(req.params.id);
        await CourseModel.deleteMany({user:req.params.id})
        req.flash('success', `Your selection has been removed successfully`);
        res.status(200).redirect('/users/dashboard');
    } catch (error) {
        req.flash(
            'error',
            `Your selection could not removed successfully`
        );
        res.status(200).redirect('/users/dashboard');
    }
};