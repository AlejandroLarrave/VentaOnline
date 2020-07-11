'use strict'

var User = require('../models/user.model');
var Product = require('../models/product.model');
var Bill = require('../models/bill.model');
var ShoppingCart = require('../models/shoppingCart.model');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');

function saveUser(req, res){
    var params = req.body;
    var user = User();

    if( params.name &&
        params.username &&
        params.email &&
        params.password){
            User.findOne({$or:[{username: params.username},
                        {email: params.email}]}, (err, userFind)=>{
                            if(err){
                                res.status(500).send({message: 'Error general'});
                            }else if(userFind){
                                res.send({message: 'Username o Email ya están siendo utilizados por alguién más'});
                            }else{
                                user.name = params.name;
                                user.username = params.username;
                                user.email = params.email;
                                user.password = params.password;
                                user.role = 'CLIENT';

                                bcrypt.hash(params.password, null, null, (err, hashPassword)=>{
                                    if(err){
                                        res.status(500).send({message: 'Error al encriptar contraseña'});
                                    }else{
                                        user.password = hashPassword;

                                        user.save((err, userSaved)=>{
                                            if(err){
                                                res.status(500).send({message: 'Error al guardar usuario'});
                                            }else if(userSaved){
                                                res.status(200).send({userSaved});
                                            }else{
                                                res.status(200).send({message: 'Ups!, algo salió mal y no podemos registrarte xd'});
                                            }
                                        });
                                    }
                                });
                            }
                        });
        }else{
            res.send({message: 'Ingrese todos los datos solicitados para registrarse'})
        }
}

function saveUserAdmin(req, res){
    var params = req.body;
    var user = User();

    if( params.name &&
        params.username &&
        params.email &&
        params.password &&
        params.role){
            User.findOne({$or:[{username: params.username},
                        {email: params.email}]}, (err, userFind)=>{
                            if(err){
                                res.status(500).send({message: 'Error general'});
                            }else if(userFind){
                                res.send({message: 'Username o Email ya están siendo utilizados por alguién más'});
                            }else{
                                user.name = params.name;
                                user.username = params.username;
                                user.email = params.email;
                                user.password = params.password;
                                user.role = params.role;

                                bcrypt.hash(params.password, null, null, (err, hashPassword)=>{
                                    if(err){
                                        res.status(500).send({message: 'Error al encriptar contraseña'});
                                    }else{
                                        user.password = hashPassword;

                                        user.save((err, userSaved)=>{
                                            if(err){
                                                res.status(500).send({message: 'Error al guardar usuario'});
                                            }else if(userSaved){
                                                res.status(200).send({userSaved});
                                            }else{
                                                res.status(200).send({message: 'Ups!, algo salió mal y no podemos registrarte xd'});
                                            }
                                        });
                                    }
                                });
                            }
                        });
        }else{
            res.send({message: 'Ingrese todos los datos solicitados para registrarse'})
        }
}

function login(req, res){
    var params = req.body;

    if(params.username || params.email){
        if(params.password){
            User.findOne({$or:[{username: params.username},{email: params.email}]},(err, userFind)=>{
                if(err){
                    res.status(500).send({message: 'Error general'});
                }else if(userFind){
                    bcrypt.compare(params.password, userFind.password, (err, checkPassword)=>{
                        if(err){
                            res.status(500).send({message: 'Error al comparar contraseñas'});
                        }else if(checkPassword){
                            if(params.gettoken){
                                res.send({token: jwt.createToken(userFind)});
                            }else{
                                jwt.createToken(userFind)
                                res.send({user: userFind});
                            }
                        }else{
                            res.status(418).send({message: 'Contraseña incorrecta'});
                        }
                    });
                }else{
                    res.send({message: 'Usuario no encontrada'});
                }
            });
        }else{
            res.send({message: 'Por favor ingrese la contraseña'});
        }
    }else{
        res.send({message: 'Ingrese el nombre de usuario o email'});
    }
}

function updateUser(req, res){
    let userId = req.params.id;
    let update = req.body;

        User.findByIdAndUpdate(userId, update, {new: true}, (err, userUpdated)=>{
            if(err){
                res.status(500).send({message: 'Error en el servidor'});
            }else{
                if(userUpdated){
                    res.status(200).send({userUpdated: userUpdated});
                }else{
                    res.status(200).send({message: 'Error al actualizar'});
                }
            }
        })
    
}

//-----------------------------------------------UPDATE USER ROLE CLIENTE------------------------------
function updateClient(req, res){
    var userId = req.params.id;
    var update = req.body;

    if(req.user.role === 'ADMIN' && userId){
        User.findById(userId).exec((err, user)=>{
            if(err) 
                return res.status(500).send({message: 'Error general'});
            if(!user)
                return res.status(404).send({message: 'No se encontro el usuario'});
            if(user.role === 'ADMIN'){
                return res.status(400).send({message: 'Error de permisos'});
            }else{
                User.findByIdAndUpdate(userId, update, {new: true}, (err, userUpdated)=>{
                    if(err){
                        res.status(500).send({message: 'Error general'});
                    }else if(userUpdated){
                        res.send({Actualización: userUpdated});
                    }else{
                        res.status(418).send({message: 'No se ha podido actualizar'});
                    }
                });
            }
        });
    }else{
        User.findByIdAndUpdate(req.user.sub, update, {new: true}, (err, userUpdated)=>{
            if(err){
                res.send(500).send({message: 'Error general'});
            }else if(userUpdated){
                res.send({Actualización: userUpdated});
            }else{
                res.status(418).send({message: 'No se ha podido actualizar'});
            }
        });
    }
} 
// --------------------------------------------DELETE CLIENT----------------------------------------

function deleteUser(req, res){
    var userId = req.params.id;

    User.findByIdAndRemove(userId, (err, userDeleted)=>{
        if(err){
            res.status(500).send({message: 'Error general'});
        }else if(userDeleted){
            res.status(200).send({message: 'Empresa eliminada'});
        }else{
            res.status(404).send({message: 'Error al eliminar'});
        }
    })
}

function listUser(req, res){
    User.find({}).exec((err, user)=>{
        if(err){
            res.status(500).send({message: 'Error en el servidor'});
        }else{
            if(user){
                res.status(200).send({user: user});
            }else{
                res.status(200).send({message: 'No se obtuvieron datos'});
            }
        }
    });
}
/*
function setShoppingCart(req, res){
    let userId = req.params.id;
    let params = req.body;
    let shoppingCart = new ShoppingCart();

        User.findById(userId, (err, userFind)=>{
            if(err)
                res.status(500).send({message: 'Error general'});
            if(!userFind){
                res.status(500).send({ message: 'Error general 2' });
            }else{
                    shoppingCart.name = params.name;
                    shoppingCart.stock = params.stock;

                User.findByIdAndUpdate({_id: userId},
                    {$push:{shoppingCart: shoppingCart}}, 
                    {new: true}, (err, userUpdated)=>{
                    if(err){
                        res.status(500).send({message: 'Error general.'});
                    }else if(userUpdated){
                        res.status(200).send({userUpdated: userUpdated});
                    }else{
                        res.status(418).send({message: 'Error al actualizar'});
                    }
                });
            }
        });

}
*/


function setBillDetail(req, res){
    let userId = req.params.id;
    let params = req.body;

    if(params.idBill){
        User.findById(userId, (err, userFind)=>{
            if(err){
                res.status(500).send({message: 'Error general'});
            }else if(userFind){
                User.findByIdAndUpdate(userId,{$push: {billDetail: new String(params.idBill)}},
                {new: true}, (err, userUpdated)=>{
                    if(err){
                        res.status(500).send({message: 'Error general'});
                    }else if(userUpdated){
                        res.status(200).send({userUpdated: userUpdated});
                    }else{
                        res.status(418).send({message: 'Error al actualizar'});
                    }
                });
            }else{
                res.status(404).send({message: 'Usuario no encontrado'});
            }
        });
    }else{
        res.status(200).send({message: 'Faltan datos'});
    }
}

function detailBill(req, res){
    var userId = req.params.id;

    User.findById(userId, (err, user)=>{
        if(err){
            res.status(500).send({message: 'Error en la DB'});
        }else if(user){
            res.send({user});
        }else{
            res.send({message: 'No se encontro al usuario'});
        }
    }).populate('bills.shoppingCart');
}   



module.exports = {
    saveUser,
    saveUserAdmin,
    login,
    updateUser,
    deleteUser,
    listUser,
    updateClient,
    setBillDetail,
    detailBill
}