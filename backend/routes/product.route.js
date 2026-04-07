const express = require('express');
const app = express();
const productRoutes = express.Router();

let Product = require('../models/product');

//Create product
productRoutes.route('/products').post((req, res) => {
    Product.create(req.body, (error, data) => {
        if (error) {
            console.log(error);
            return next(error);
        } else {
            res.json(data);
        }
    })
});

//List products
productRoutes.route('/products').get((req, res) => {
    Product.find((error, data) => {
        if (error) {
            console.log(error);
            return next(error);
        } else {
            res.json(data);
        }
    })
});

//Get product by id
productRoutes.route('/products/:id').get((req, res) => {
    Product.findById(req.params.id, (error, data) => {
        if (error) {
            console.log(error);
            return next(error);
        } else {
            res.json(data);
        }
    })
});

//Edit product
productRoutes.route('/products/:id').put((req, res) => {
    Product.findByIdAndUpdate(req.params.id, {
        $set: req.body
    }, (error, data) => {
        if (error) {
            console.log(error);
            return next(error);
        } else {
            res.json(data);
            console.log('Product updated successfully!');
        }
    })
});

//Delete product
productRoutes.route('/products/:id').delete((req, res) => {
    Product.findByIdAndRemove(req.params.id, (error, data) => {
        if (error) {
            console.log(error);
            return next(error);
        } else {
            res.status(200).json({
                msg: data
            });
            console.log('Product deleted successfully!');
        }
    })
});

module.exports = productRoutes;