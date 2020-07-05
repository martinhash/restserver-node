const express = require('express');
const fileUpload = require('express-fileupload');
let app = express();
const User = require('../models/user');
const Product = require('../models/product');
const fs = require('fs');
const path = require('path');

app.use( fileUpload({ useTempFiles: true }) );


app.put('/upload/:tipo/:id', function(req, res){
    let type = req.params.tipo;
    let id = req.params.id;
    if(!req.files){
        return res.status(500).json({
            ok: false,
            message: 'No se ha seleccionado ningun archivo'
        })
    }
    let validTypes = ['products', 'users'];
    if(validTypes.indexOf(type) < 0){
        return res.status(400).json({
            ok: false,
            message: 'Los tipos validos son: ' + validTypes.join(', ')
        })
    }
    console.log(req.files);
    
    let fileUpload = req.files.fileUpload;
    let nameSplitFile = fileUpload.name.split('.');
    let extension = nameSplitFile[nameSplitFile.length - 1];
    let validExtensions = ['jpg', 'png', 'gif', 'jpeg']
    if(validExtensions.indexOf(extension) < 0){
        return res.status(400).json({
            ok: false,
            message: 'Las extensionas validas son: ' + validExtensions.join(', ')
        })
    }
    // Cambiar nombre archivo
    let nameFile = `${ id }-${ new Date().getMilliseconds() }${ extension }`
    fileUpload.mv(`/uploads/${ type }/${ nameFile }`, (err) => {
        if (err){
            console.log(err);
            
            return res.status(500).json({
                ok:false,
                err
            });
        }
        if(type === 'users'){
            userImage(id, res, nameFile);
        }
        if(type === 'products'){
            productsImage(id, res, nameFile);
        }
      });
})

function productsImage(id, res, nameFile){
    Product.findById(id, (err, productDB) => {
        if(err){
            deleteFile(nameFile, 'products');
            return res.status(500).json({
                ok:false,
                err
            });
        }
        deleteFile(productDB.img, 'products');
        productDB.img = nameFile;
        productDB.save((err, productSave) => {
            if(err){
                return res.status(500).json({
                    ok:false,
                    err
                });
            }
            res.json({
                ok: true,
                user: productSave
            });
        })
    })
}

function userImage(id, res, nameFile){
    User.findById(id, (err, userDB) => {
        if(err){
            deleteFile(nameFile, 'users');
            return res.status(500).json({
                ok:false,
                err
            });
        }
        if(!userDB){
            deleteFile(nameFile, 'users');
            return res.status(400).json({
                ok:false,
                err: {
                    message:'El usuario no existe'
                }
            });
        }
        deleteFile(userDB.img, 'users');
        userDB.img = nameFile;
        userDB.save((err, userSave) => {
            if(err){
                return res.status(500).json({
                    ok:false,
                    err
                });
            }
            res.json({
                ok: true,
                user: userSave
            });
        })
    })
}

function deleteFile(nameFile, type){
    let pathUrl = path.resolve(__dirname, `../../uploads/${ type }/${ nameFile }`);
        if(fs.existsSync(pathUrl)){
            fs.unlinkSync(pathUrl);
        }
}

module.exports = app;