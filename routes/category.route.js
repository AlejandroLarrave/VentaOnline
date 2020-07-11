'use strict'

var express = require('express');
var categoryController = require('../controllers/category.controller');
var api = express.Router();
var middlewareAuth = require('../middlewares/authenticated');

api.post('/saveCategory', middlewareAuth.ensureAuthAdmin, categoryController.saveCategory);
api.put('/updateCategory/:id', middlewareAuth.ensureAuthAdmin, categoryController.updateCategory);
api.delete('/deleteCategory/:id', middlewareAuth.ensureAuthAdmin, categoryController.deleteCategory);
api.get('/listCategory', middlewareAuth.ensureAuthAdmin, categoryController.listCategory);
api.get('/searchCategorys', middlewareAuth.ensureAuthAdmin, categoryController.searchCategorys);
api.put('/removeCategory/:id', middlewareAuth.ensureAuthAdmin, categoryController.removeCategory);
api.put('/setCategoryToProduct/:id', middlewareAuth.ensureAuthAdmin, categoryController.setCategoryToProduct);
api.get('/searchCategory/:id', middlewareAuth.ensureAuthAdmin, categoryController.searchCategory);

module.exports = api; 