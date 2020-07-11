'use strict'


var Bill = require('../models/bill.model');
var Product = require('../models/product.model');
var ShoppingCart = require('../models/shoppingCart.model');

function saveBill(req, res){
    var params = req.body;
    var bill = Bill();

    if( params.nameBusinee &&
        params.teller &&
        params.date){
            bill.nameBusinee = params.nameBusinee;
            bill.teller = params.teller;
            bill.date = params.date;

            bill.save((err, billSaved)=>{
                if(err){
                    res.status(500).send({message: 'Error general'});
                }else if(billSaved){
                    res.status(200).send({billSaved});
                }else{
                    res.status(200).send({message: 'Error al guardar'});
                }          
            });
    }else{
        res.status(200).send({message: 'Ingrese todos los datos'});
    }
}

function totalSales(req, res){
    let billId = req.params.id;

        Bill.findById(billId, (err, billFind)=>{
            if(err){
                res.status(500).send({message: 'Error general'});
            }else if(billFind){

                Bill.findByIdAndUpdate(billFind, {$push: {total: new Number}},
                {new: true}, (err, billUpdated)=>{
                    if(err){
                        res.status(500).send({message: 'Error general 2'});
                        console.log(err);
                    }else if(billUpdated){
                        res.send({$mul: {Cantidad: Bill.ShoppingCart.stock, Precio: Product.price}});
                    }else{
                        res.status(418).send({message: 'Error al multiplicar'});
                    }
                }).populate('products');
            }else{
                res.status(404).send({message: 'Factura no encontrada'});
            }
        });
}

function totalv(req, res){
    Bill.update({$mul: {Cantidad: Bill.ShoppingCart.stock, Precio: Product.price}})
}

function totalSale(req, res){
    var shoppingCartId = req.params.id;

    ShoppingCart.findById(shoppingCartId, (err, total)=>{
        if(err){
            res.status(500).send({message: 'Error en el servidor'});
        }else if(total){
            res.status(200).send({shoppingCart: stock * price});
        }else{ 
            res.status(200).send({message: 'No se obtuvieron datos'});
            }
    });
}

function productsOfBill(req, res){
    var billId = req.params.id;

    Bill.findById(billId, (err, bill)=>{
        if(err){
            res.status(500).send({message: 'Error en la DB'});
        }else if(bill){
            res.send({bill});
        }else{
            res.send({message: 'No se encontro la factura'});
        }
    }).populate('shoppingCarts');
}

function setShoppingCart(req, res) {
    
    let billId = req.params.id;
    let params = req.body;
    let shoppingCart = new ShoppingCart();
    var A = params.stock * (-1);

    Bill.findById(billId, (err, billFind)=>{
        if (err) 
            res.status(500).send({ message: 'Error general' });
        if (!billFind){
            res.status(500).send({ message: 'Error general 2' });
        }else{
            shoppingCart.name = params.name;
            shoppingCart.price = params.price;
            shoppingCart.stock = params.stock;
            let total = parseInt(billFind.total) + (parseInt(params.stock) * parseInt(params.price));

            Bill.findByIdAndUpdate({_id: billId}, 
                { $push: { shoppingCart: shoppingCart},$set:{total:total}}, 
                { new: true }, (err, billUpdated)=>{
                if (err) {
                    res.status(500).send({ message: 'Error general 3'});
                    console.log(err);
                }else if (billUpdated) {
                   
                    Product.findOne({name: params.name},(err, productSelected)=>{
                        if(err)
                            res.status(500).send({message:'Error general 4'});
                         if(!productSelected){
                            res.status(500).send({ message: 'Error general 5' });
                         }else{
                            Product.findOneAndUpdate({_id: productSelected.id}, 
                                {$inc:{stock: A}}, {new:true},(err, productUpdated)=>{
                                if (err) 
                                    res.status(500).send({ message: 'Error general 20' });
                                 if (productUpdated) {
                                    res.send({bill: billUpdated});
                                }else{
                                    res.status(404).send({ message: 'Error al actulizar' });
                                } 
                            });
                        }
                    });
                }
            });
        } 
    });
} 

module.exports = {
    saveBill,
    totalSale,
    productsOfBill,
    setShoppingCart
}