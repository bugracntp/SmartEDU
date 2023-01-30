const UserModel = require('../models/User');

const bcrypt = require('bcrypt'); // şifreleri criptlolamak için kullandığımız kütüphane

exports.createUser = async (req, res) => {
    try {
        const user = await UserModel.create(req.body);
        res.status(201).json({
            status: 'success',
            user,
        });
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
                    if (same) {
                        // USER SESSION
                        res.status(200).send('YOU ARE LOGGED IN');
                    }
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
