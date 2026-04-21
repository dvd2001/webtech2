const express = require('express');
const userRoutes = express.Router();

let User = require('../models/user');

//Create user
userRoutes.route('/users').post(async (req, res) => {
    try {
        const data = await User.create(req.body);
        res.json(data);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
});

//List users
userRoutes.route('/users').get(async (req, res) => {
    try {
        const data = await User.find();
        res.json(data);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
});

//Get user by id
userRoutes.route('/users/:id').get(async (req, res) => {
    try {
        const data = await User.findById(req.params.id);
        res.json(data);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
});

//Edit user
userRoutes.route('/users/:id').put(async (req, res) => {
    try {
        const data = await User.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        res.json(data);
        console.log('User updated successfully!');
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
});

//Delete user
userRoutes.route('/users/:id').delete(async (req, res) => {
    try {
        const data = await User.findByIdAndDelete(req.params.id);
        res.status(200).json({
            msg: data
        });
        console.log('User deleted successfully!');
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = userRoutes;