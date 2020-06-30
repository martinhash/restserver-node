const express = require('express');
const fileUpload = require('express-fileupload');
let app = express();

const User = require('../models/user');
const { LoginTicket } = require('google-auth-library');

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
    fileUpload.mv(`uploads/${ type }/${ nameFile }`, (err) => {
        if (err){
            return res.status(500).json({
                ok:false,
                err
            });
        }
        userImage(id, res, nameFile);
      });
})


function userImage(id, res, nameFile){
    User.findById(id, (err, userDB) => {
        if(err){
            return res.status(500).json({
                ok:false,
                err
            });
        }
        if(!userDB){
            return res.status(400).json({
                ok:false,
                err: {
                    message:'El usuario no existe'
                }
            });
        }
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

module.exports = app;