const CategoryModel = require('../models/Category');

exports.createCategory = async (req, res) => {
    try {
        const category = await CategoryModel.create(req.body);
        res.status(201).redirect('/users/dashboard');
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            error,
        });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        await CategoryModel.findByIdAndRemove(req.params.id);
        req.flash('success', `Your selection has been removed successfully`);
        res.status(200).redirect('/users/dashboard');
    } catch (error) {
        req.flash('error', `Your selection could not removed successfully`);
        res.status(200).redirect('/users/dashboard');
    }
};
