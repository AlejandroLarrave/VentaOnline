'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var shoppingCartSchema = Schema({
    name: String,
    price: Number,
    stock: Number,
    category: [{type: Schema.Types.ObjectId, ref: 'categorys'}]
})

module.exports = mongoose.model('shoppingCart', shoppingCartSchema);