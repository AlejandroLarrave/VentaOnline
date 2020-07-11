'use strict'

var express = require('express');
var userController = require('../controllers/user.controller');
var api = express.Router();
var middlewareAuth = require('../middlewares/authenticated');

api.post('/saveUser', middlewareAuth.ensureAuthAdmin, userController.saveUser);
api.post('/saveUserAdmin', middlewareAuth.ensureAuthAdmin, userController.saveUserAdmin);
api.post('/login', userController.login);
api.put('/updateUser/:id', middlewareAuth.ensureAuthAdmin, userController.updateUser);
api.delete('/deleteUser/:id', middlewareAuth.ensureAuthAdmin, userController.deleteUser);
api.get('/listUser', middlewareAuth.ensureAuthAdmin, userController.listUser);
api.put('/updateClient/:id', middlewareAuth.ensureAuthAdmin, userController.updateClient);
api.put('/setBillDetail/:id', userController.setBillDetail);
api.get('/detailBill/:id', userController.detailBill);

module.exports = api;