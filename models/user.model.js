'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = Schema({
    name: String,
    username: String,
    email: String,
    password: String,
    phone: String,
    mySales: [],
    billDetail: [],
    shoppingCart: [{
        name: String,
        price: Number,
        stock: Number}],
    role: String
})

module.exports = mongoose.model('users', userSchema);