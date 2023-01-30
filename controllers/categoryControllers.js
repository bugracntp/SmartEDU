const CategoryModel = require('../models/Category');


exports.createCategory = async (req, res) => {
    const category = await CategoryModel.create(req.body);
    try {
        res.status(201).json({
            status: 'success',
            category,
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            error,
        });
    }
};
