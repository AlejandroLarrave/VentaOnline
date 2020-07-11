'use strict'

var Product = require('../models/product.model');

function saveProduct(req, res){
    var product = Product();
    var params = req.body;

    if( params.name &&
        params.price &&
        params.stock &&
        params.saleAmount){

            Product.findOne({name: params.name}, (err, productFind)=>{
                if(err){
                    res.status(500).send({message: 'Error general'});
                }else if(productFind){
                    res.status(200).send({message: 'El producto ya existe, verificalo'});
                }else{
                    product.name = params.name;
                    product.price = params.price;
                    product.stock = params.stock;
                    product.saleAmount = params.saleAmount; 

                product.save((err, productSaved)=>{
                    if(err){
                        res.status(500).send({message: 'Error general'});
                    }else if(productSaved){
                        res.status(200).send({productSaved});
                    }else{
                        res.status(200).send({message: 'Error al guardar producto'});
                    }
                });
            }
        })
        }else{
            res.status(200).send({message: 'Por favor ingresa todos los datos'});
        }
}

function updateProduct(req, res){
    let productId = req.params.id;
    let update = req.body;

    Product.findByIdAndUpdate(productId, update, {new: true}, (err, productUpdated)=>{
        if(err){
            res.status(500).send({message: 'Error en el servidor'});
        }else{
            if(productUpdated){
                res.status(200).send({productUpdated: productUpdated});
            }else{
                res.status(200).send({message: 'Error al actualizar'});
            }
        }
    });
}

function removeProduct(req, res){
    var productId = req.params.id;

    Product.findByIdAndRemove(productId, (err, productDelete)=>{
        if(err){
            res.status(500).send({message: 'Error general'});
        }else if(productDelete){
            res.status(200).send({message: 'Producto eliminado'});
        }else{
            res.status(404).send({message: 'Error al eliminar'});
        }
    });
}

function listProducts(req, res){
    Product.find({}).exec((err, products)=>{
        if(err){
            res.status(500).send({message: 'Error en el servidor'});
        }else{
            if(products){
                res.status(200).send({products: products});
            }else{
                res.status(200).send({message: 'No se obtuvieron datos'});
            }
        }
    })
}

function searchProduct(req, res){
    var txt = req.body.search;

    Product.find({$or:[{name: {$regex: txt, $options: 'i'}}]},
                (err, productSearch)=>{
        if(err){
            res.status(500).send({message: 'Error en servidor'});
            console.log(err);
        }else if(productSearch){
            res.status(200).send({productSearch: productSearch});
        }else{
            res.status(200).send({message: 'No hay registros'});
        }
    });
}

function stockProduct(req, res){
    var productId = req.params.id;

    Product.findById(productId, (err, product)=>{
        if(err){
            res.status(500).send({message: 'Error en la DB'});
        }else if(product){
            res.send({Producto: product.name, Cantidad: product.stock});
        }else{
            res.send({message: 'No se encontro el producto'});
        }
    });
}

function productsMoreSale(req, res){

    Product.find({}).sort({saleAmount: -1}).exec((err, products)=>{
        if(err){
            res.status(500).send({message: 'Error general'});
        }else if(products){
            return res.send({products: products});
        }else{
            return res.status(418).send({message: 'Productos no encontrados'});
        }
    });
}

function productAgotados(req, res){
    Product.find({stock: 0}).exec((err, agotadosFind)=>{
        if(err){
            res.status(500).send({message: 'Error general'});
        }else if(agotadosFind){
            res.send({product: agotadosFind});
        }else{
            res.status(418).send({message: 'No hay productos agotados'});
        }
    });
}

module.exports = {
    saveProduct,
    updateProduct,
    removeProduct,
    listProducts,
    searchProduct,
    stockProduct,
    productsMoreSale,
    productAgotados
}