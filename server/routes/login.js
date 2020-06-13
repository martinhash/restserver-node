const express = require('express');
const bycript = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();
const User = require('../models/user');


app.post('/login', (req, res)=>{
    let body = req.body;
    User.findOne({ email: body.email }, (err, userDB)=>{
        if(err){
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if(!userDB){
            return res.status(400).json({
                ok: false,
                err: {
                    message: '(Usuario) o contraseña inválidos'
                }
            })
        }
        if(!bycript.compareSync(body.password, userDB.password )){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o (contraseña) inválidos'
                }
            }) 
        }else{

            let token = jwt.sign({
                user: userDB
            }, 'este es el seed desarrollo', {expiresIn: 60 * 60 * 24 * 30});

            res.json({
                ok: true,
                user: userDB,
                token
            })
        }
    })
})


module.exports = app;