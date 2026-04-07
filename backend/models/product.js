const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Product = new Schema({
    name: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    typeOfQuantity: {
        type: String,
        required: true
    }
}, {
    collection: 'products'
})

module.exports = mongoose.model('products', Product)