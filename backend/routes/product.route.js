const express = require('express');
const productRoutes = express.Router();

let Product = require('../models/product');

//Create product
productRoutes.route('/products').post(async (req, res) => {
    try {
        const data = await Product.create(req.body);
        res.json(data);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
});

//List products
productRoutes.route('/products').get(async (req, res) => {
    try {
        const data = await Product.find();
        res.json(data);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
});

//Get product by id
productRoutes.route('/products/:id').get(async (req, res) => {
    try {
        const data = await Product.findById(req.params.id);
        res.json(data);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
});

//Edit product
productRoutes.route('/products/:id').put(async (req, res) => {
    try {
        const data = await Product.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        res.json(data);
        console.log('Product updated successfully!');
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
});

//Delete product
productRoutes.route('/products/:id').delete(async (req, res) => {
    try {
        const data = await Product.findByIdAndDelete(req.params.id);
        res.status(200).json({
            msg: data
        });
        console.log('Product deleted successfully!');
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = productRoutes;