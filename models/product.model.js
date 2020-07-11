'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var productSchema = Schema({
    name: String,
    price: Number, 
    stock: Number,
    saleAmount: {type: Number, default: 0}
})

module.exports = mongoose.model('products', productSchema);