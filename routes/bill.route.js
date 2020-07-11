'use strict'

var express = require('express');
var billController = require('../controllers/bill.controller');
var api = express.Router();

api.post('/saveBill', billController.saveBill);
api.put('/totalSale', billController.totalSale);
api.get('/productsOfBill/:id', billController.productsOfBill);
api.put('/setShoppingCart/:id', billController.setShoppingCart);

module.exports = api;