'use strict'

var Category = require('../models/category.model');
var Product = require('../models/product.model');

function saveCategory(req, res){
    var category = Category();
    var params = req.body;

    if( params.name){
        Category.findOne({name: params.name}, (err, categoryFind)=>{
            if(err){
                res.status(500).send({message: 'Error general'});
            }else if(categoryFind){
                res.status(200).send({message: 'La categoría ya existe'});
            }else{
                category.name = params.name;

                category.save((err, categorySaved)=>{
                    if(err){
                        res.status(500).send({message: 'Error general'});
                    }else if(categorySaved){
                        res.status(200).send({categorySaved});
                    }else{
                        res.status(200).send({message: 'Error al guardar la categoría'});
                    }
                });
            }
        })
    }else{
        res.status(200).send({message: 'Por favor ingresa todos los datos'});
    }
}

function updateCategory(req,res){
    let categoryId = req.params.id;
    let update = req.body;

    Category.findByIdAndUpdate(categoryId, update, {new: true}, (err, categoryUpdated)=>{
        if(err){
            res.status(500).send({message: 'Error en el servidor'});
        }else{
            if(categoryUpdated){
                res.status(200).send({categoryUpdated: categoryUpdated});
            }else{
                res.status(200).send({message: 'Error al actualizar'});
            }
        }
    })
}

function deleteCategory(req, res){
    var categoryId = req.params.id;

    Category.findByIdAndRemove(categoryId, (err, categoryDelete)=>{
        if(err){
            res.status(500).send({message: 'Error general'});
        }else if(categoryDelete){
            res.status(200).send({message: 'Categoria eliminada'});
        }else{
            res.status(404).send({message: 'Error al eliminar'});
        }
    })
}

function removeCategory(req, res){
    var categoryId = req.params.id;
    var products = [];

    Category.findById(categoryId, (err, found)=>{
        if(err){
            res.status(500).send({message: 'Error general1'});
        }else if(found){ 
            if(found.products.length != 0){
                products = found.products;
                Category.findOneAndUpdate({name: 'Todos'}, {$push: {products: products}},
                                             {new: true}, (err, save)=>{
                    if(err){
                        res.status(500).send({message: 'Error en el sistema'});
                    }else if(save){
                        Category.findByIdAndRemove(categoryId, (err, categoryDelete)=>{
                            if(err){
                                res.status(500).send({message: 'Error en el sistema'});
                            }else if(categoryDelete){
                                res.send({message: 'Categoria eliminada', category: categoryDelete,
                                 message: 'Productos enviados a:', save});
                            }else{
                                res.send({message: 'Error al eliminar categoría'});
                            }
                        });
                    }else{
                        res.send({message: 'Error general2'});
                        console.log(err);
                    }
                });
            }
        }else{
            res.send({message: 'Error del sistema'});
        }
    }); 
}

function listCategory(req, res){
    Category.find({}).exec((err, category)=>{
        if(err){
            res.status(500).send({message: 'Error en el servidor'});
        }else{
            if(category){
                res.status(200).send({Categoria: category});
            }else{
                res.status(200).send({message: 'No se obtuvieron datos'});
            }
        }
    });
}
/*
function searchCategory(req, res){
    var txt = req.params.search;

    Category.find({$or:[{name: {$regex: txt}}]}, 
        (err, category)=>{
        if(err){
            res.status(500).send({message: 'Error en la DB'});
            console.log(err);
        }else if(category){
            res.status(200).send({category: category});
        }else{
            res.send({message: 'No se encontro el producto'});
        }
    });
}*/

function searchCategorys(req, res){
    var params = req.body;

    if(params.search){
        Category.find({name: params.search}, (err, categoryFind)=>{
            if(err){
                res.status(500).send({message: 'Error general'});
            }else if(categoryFind){
                res.send({category: categoryFind});
            }else{
                res.status(200).send({message: 'Sin registros'});
            }
        });
    }else{
        res.status(200).send({message: 'Ingrese el nombre de la categoria'});
    }
}

function setCategoryToProduct(req, res){
    let categoryId = req.params.id;
    let params = req.body;

    if(params.idProduct){
        Category.findById(categoryId, (err, categoryFind)=>{
            if(err){
                res.status(500).send({message: 'Error general'});
            }else if(categoryFind){

                Category.findByIdAndUpdate(categoryId,
                     {$push: {products: new String(params.idProduct)}},
                     {new: true}, (err, categoryUpdated)=>{
                    if(err){
                        res.status(500).send({message: 'Error general'});
                    }else if(categoryUpdated){
                        res.status(200).send({categoryUpdated: categoryUpdated});
                    }else{
                        res.status(418).send({message: 'Error al actualizar'});
                    }
                });
            }else{
                res.status(404).send({message: 'Categoria no encontrada'});
            }
        });
    }else{
        res.status(200).send({message: 'Faltan datos'});
    }
}


function searchCategory(req, res){
    var categoryId = req.params.id;

    Category.findById(categoryId, (err, category)=>{
        if(err){
            res.status(500).send({message: 'Error en la DB'});
        }else if(category){
            res.send({category});
        }else{
            res.send({message: 'No se encontro la categoria'});
        }
    }).populate('products');
}

module.exports = {
    saveCategory,
    updateCategory,
    deleteCategory,
    listCategory,
    searchCategorys,
    removeCategory,
    setCategoryToProduct,
    searchCategory
}