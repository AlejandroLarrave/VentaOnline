'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var categorySchema = Schema({
    name: String,
    products: [{type: Schema.Types.ObjectId, ref: 'products'}]
})

module.exports = mongoose.model('categorys', categorySchema);