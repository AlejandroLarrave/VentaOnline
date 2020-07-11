'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var billSchema = Schema({
    nameBusinee: String,
    teller: String,
    date: Date,
    total: {type:Number,default:0},
    shoppingCart: []
})

module.exports = mongoose.model('bills', billSchema);