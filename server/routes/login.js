const express = require('express');
const bycript = require('bcrypt');
const jwt = require('jsonwebtoken');
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);
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
            }, process.env.SEED, {expiresIn: process.env.TOKEN_EXPIRED});
            res.json({
                ok: true,
                user: userDB,
                token
            })
        }
    })
})

async function verify( token ) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,
    }).catch( e=>{
        console.log("e::::::::::::::::", e);
        
    })
    const payload = ticket.getPayload();

    console.log(payload.name);
    console.log(payload.email);
    console.log(payload.picture);
    
    return {
        name: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
    

}


app.post('/google', async (req, res) =>{

    let token = req.body.idtoken;
    

    let googleUser = await verify(token).catch( e=>{
        return res.status(403).json({
            ok: false,
            err: e
        })
    })

    User.findOne( {email: googleUser.email}, ( err, userDB ) => {
        if(err){
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (userDB) {
            if(!userDB.google) {
                // En caso de que se registro con un email y password, pero se intenta registrar por google
                return res.status(400).json({
                    ok: false,
                    err: 'Debe ingresar con su autenticacion normal'
                })
            }else{
                // Si existe en la DB su autenticación con este email vía google, renovar token
                let token = jwt.sign({
                    user: userDB
                }, process.env.SEED, {expiresIn: process.env.TOKEN_EXPIRED});
                return res.json({
                    ok: true,
                    user: userDB,
                    token
                })
            }
        } else {
            // Si el usuario no existe en la DB (new user)
            let user = new User();
            user.name = googleUser.name;
            user.email = googleUser.email;
            user.img = googleUser.img;
            user.password = ':)';
            user.google = true;
            console.log("user::::::::::::::::::::",user);
            
            user.save((err, userDB)=>{
                if(err){
                    return res.status(500).json({
                        ok: false,
                        err
                    })
                } else {
                    let token = jwt.sign({
                        user: userDB
                    }, process.env.SEED, {expiresIn: process.env.TOKEN_EXPIRED});

                    res.json({
                        ok: true,
                        user: userDB,
                        token
                    }) 
                }
            })

        }
    })

});



module.exports = app;