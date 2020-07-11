'use strict'

var express = require('express');
var productController = require('../controllers/product.controller');
var api = express.Router();
var middlewareAuth = require('../middlewares/authenticated');

// ---------------------------- PRODUCTOS -----------------------------
api.post('/saveProducts', middlewareAuth.ensureAuthAdmin, productController.saveProduct);
api.put('/updateProducts/:id', middlewareAuth.ensureAuthAdmin,productController.updateProduct);
api.delete('/removeProducts/:id',middlewareAuth.ensureAuthAdmin, productController.removeProduct);
api.get('/listProducts', middlewareAuth.ensureAuthAdmin, productController.listProducts);
api.get('/searchProducts', middlewareAuth.ensureAuthAdmin, productController.searchProduct);
api.get('/stockProducts/:id', middlewareAuth.ensureAuthAdmin, productController.stockProduct);
api.get('/productsMoreSale',middlewareAuth.ensureAuthAdmin, productController.productsMoreSale);
api.get('/productAgotados', middlewareAuth.ensureAuthAdmin, productController.productAgotados);


module.exports = api;