const express = require('express');
const bycript = require('bcrypt');
const _ = require('underscore');
const User = require('../models/user');
const { authToken, authAdminRole } = require('../middlewares/authentication');

const app = express();


app.get('/usuario', authToken, (req, res) => {

    let from = req.query.from || 0;
    from = Number(from);
    let limit = req.query.limit || 5; 
    limit = Number(limit);
    let state = req.query.state || true;
    User.find({state})
    .skip(from)
    .limit(limit)
        .exec((err, users) => {
            if(err){
                return res.status(400).json({
                    ok: false,
                    err
                })
            } else {
                User.count({state}, (err, count)=>{
                    res.json({
                        ok:true,
                        users,
                        howMany: count
                    })
                })
            }
        })
})
  
app.post('/usuario', [authToken, authAdminRole], function (req, res) {

    let body = req.body;

    let user = new User({
        name: body.name,
        email: body.email,
        password: bycript.hashSync(body.password, 10),
        role: body.role
    });
  
    user.save( (err, userDB) => {
        if(err){
            return res.status(400).json({
                ok: false,
                err
            })
        }else{
            userDB.password = null;
            res.json({
                ok: true,
                user: userDB
            })
        }
    });
})
  
app.put('/usuario/:id', [authToken, authAdminRole], function (req, res) {
      let id = req.params.id;
      let body = _.pick(req.body, ['name', 'email', 'img', 'role']);
      
      User.findByIdAndUpdate( id, body, {new: true, runValidators: true}, (err, userDB) => {
        if(err){
            return res.status(400).json({
                ok: false,
                err
            })
        } else {
            res.json({
                ok: true,
                user: userDB
            })
        }
      });
})
  
//DELETE USER BY STATE
app.delete('/usuario/:id', [authToken, authAdminRole], function (req, res) {
    let id = req.params.id;
    let changeState = {
        state: false
    }
    User.findByIdAndUpdate(id, changeState, (err, userRemove) => {
        if(err){
            return res.status(400).json({
                ok: false,
                err
            })
        } 
        if(!userRemove){
            return res.status(400).json({
                ok: false,
                message: 'Usuario no encontrado'
            })
        } else {
            userRemove.state = false;
            res.json({
                ok: true,
                user: userRemove
            })
        }
    })
})

module.exports = app;