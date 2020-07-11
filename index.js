'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = 3300;

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://127.0.0.1:27017/VentaOnline2018407', {useNewUrlParser: true, useUnifiedTopology:true})
.then(()=>{
    console.log('Conexión a base de datos correctamente')
    app.listen(port, ()=>{
        console.log('Servidor de express corriendo correctamente');
    });
}).catch(err=>{
    console.log('Error al conectarse a la base de datos');
})