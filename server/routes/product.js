const express = require('express');
let { authToken, authAdminRole } = require('../middlewares/authentication');

let app = express();
let Product = require('../models/product');
const product = require('../models/product');

//=========================
//CREAR UN NUEVO PRODUCTO
//=========================
app.post('/producto', authToken, (req, res) => {

    let body = req.body;

    let product = new Product({
        user: req.user._id,
        name:       body.name,
        priceUni:   body.priceUni,
        description: body.description,
        aviable:    body.aviable,
        category:   body.category
    })

    product.save( (err, productDB) => {
        if(err){
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if(!productDB){
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok:true,
            producto: productDB
        })
    })
    
})

//=========================
//OBTENER PRODUCTOS
//=========================
app.get('/producto', (req, res) => {
    let desde = req.query.desde || 0;
    desde = Number(desde);
    Product.find({aviable: true})
    .skip(desde)
    .limit(5)
    .populate('category', 'description')
    .populate('user', 'nombre email')
    .exec((err, product) => {
        if(err){
            console.log(err);
            
            return res.status(500).json({
                ok: false,
                err
            })
        } else {
            res.json({
                product
            })
        }
    })
    
})

//=========================
//OBTENER PRODUCTOS
//=========================
app.get('/producto/buscar/:termino', (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');
    console.log(regex);
    
    Product.find({ name: regex })
        .populate('categoria', 'nombre')
        .exec((err, products) => {
            if(err){
                return res.status(500).json({
                    ok: false,
                    err
                })
            } else {
                res.json({
                    products
                })
            }
        })

})

//=========================
//OBTENER UN PRODUCTO POR ID
//=========================
app.get('/producto/:id', (req, res) => {

    let id = req.params.id;

    Product.findById(id)
    .populate('category', 'description')
    .populate('user', 'nombre email')
    .exec((err, productID ) => {
        if(err){
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if(!productID){
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'No existe este producto'
                }
            })
        }
        res.json({
            ok: true,
            producto: productID
        })
    })
    
})

//=========================
//DEJAR PRODUCTO FUERA DE STOCK
//=========================
app.delete('/producto/:id', [authToken, authAdminRole], (req, res) => {
    let id = req.params.id;
    Product.findById( id, (err, productDB) => {
        if(err){
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if(!productDB){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El producto no existe'
                }
            })
        }
        productDB.aviable = false;
        productDB.save( (err, productOutStock) => {
            if(err){
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            res.json({
                ok: true,
                product: productOutStock,
                message: 'Producto borrado'
            })
        })
    })
// 
})

//=========================
//ACTUALIZAR PRODUCTO
//=========================
app.put('/producto/:id', [authToken, authAdminRole], (req, res) => {
    let id = req.params.id;
    let body = req.body;

    
    Product.findById(id, (err, productDB) => {
        if(err){
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if(!productDB){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El producto no existe'
                }
            })
        }

        productDB.name = body.name;
        productDB.priceUni = body.priceUni;
        productDB.category = body.category;
        productDB.aviable = body.aviable;
        productDB.description = body.description;

        productDB.save( (err, productSave) => {
            if(err){
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            res.json({
                ok: true,
                producto: productSave
            }) 
        })
    
    });

})

module.exports = app;
