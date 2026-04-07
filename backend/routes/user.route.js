const exprss = require('express');
const app = exprss();
const userRoutes = exprss.Router();

let User = require('../models/user');

//Create user
userRoutes.route('/users').post((req, res) => {
    User.create(req.body, (error, data) => {
        if (error) {
            console.log(error);
            return next(error);
        } else {
            res.json(data);
        }
    })
});

//List users
userRoutes.route('/users').get((req, res) => {
    User.find((error, data) => {
        if (error) {
            console.log(error);
            return next(error);
        } else {
            res.json(data);
        }
    });
});

//Get user by id
userRoutes.route('/users/:id').get((req, res) => {
    User.findById(req.params.id, (error, data) => {
        if (error) {
            console.log(error);
            return next(error);
        } else {
            res.json(data);
        }
    })
});

//Edit user
userRoutes.route('/users/:id').put((req, res) => {
    User.findByIdAndUpdate(req.params.id, {
        $set: req.body
    }, (error, data) => {
        if (error) {
            console.log(error);
            return next(error);
        } else {
            res.json(data);
            console.log('User updated successfully!');
        }
    })
});

//Delete user
userRoutes.route('/users/:id').delete((req, res) => {
    User.findByIdAndRemove(req.params.id, (error, data) => {
        if (error) {
            console.log(error);
            return next(error);
        } else {
            res.status(200).json({
                msg: data
            });
            console.log('User deleted successfully!');
        }
    })
});

module.exports = userRoutes;