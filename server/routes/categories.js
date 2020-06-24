const express = require('express');
let {authToken, authAdminRole} = require('../middlewares/authentication');

let app = express();
let Category = require('../models/category');

//=========================
//MOSTRAR TODAS CATEGORIAS
//=========================
app.get('/categoria', authToken, (req, res) => {
    
    Category.find({})
        .sort('description')
        .populate('user', 'name email')
        .exec((err, categories) => {
            if(err){
                return res.status(500).json({
                    ok: false,
                    err
                })
            } else {
                res.json({
                    categories
                })
            }
        })
})
//=========================
//MOSTRAR CATEGORIA POR ID
//=========================
app.get('/categoria/:id', authToken, (req, res) => {
    
    let id = req.params.id;

    Category.findById( id, (err, categoryDB ) => {
        if(err){
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if(!categoryDB){
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'No existe esta categoria'
                }
            })
        }
        res.json({
            ok: true,
            categoria: categoryDB
        })
    })
})
//=========================
//ELIMINAR CATEGORIA
//=========================
app.delete('/categoria/:id', [authToken, authAdminRole], (req, res) => {

    let id = req.params.id;

    Category.findByIdAndRemove(id, (err, categoryDB)=>{
        if(err){
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if(!categoryDB){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no existe'
                }
            })
        }
        res.json({
            ok:true,
            message: 'Se ha elimiado la categoria'
        })
        
    })
})
//=========================
//CREAR NUEVA CATEGORIA
//=========================
app.post('/categoria', authToken, (req, res) => {
    let body = req.body;
    let category = new Category({
        description: body.description,
        user: req.user._id
    })
    category.save( (err, categoryDB) => {
        console.log(err);
        
        if(err){
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if(!categoryDB){
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok:true,
            categoria: categoryDB
        })
    });


})
//=========================
//ACTUALIZAR CATEGORIA
//=========================
app.put('/categoria/:id', authToken, (req, res) => {

    let id = req.params.id;
    let body = req.body

    let descCategory = {
        description: body.description
    };

    Category.findByIdAndUpdate(id, descCategory, {new: true, runValidators: true}, (err, categoryDB)=>{

        if(err){
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if(!categoryDB){
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok:true,
            categoria: categoryDB
        })
    });

})

module.exports = app;