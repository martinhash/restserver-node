const express = require('express');
const bycript = require('bcrypt');
const { response } = require('./user');
const app = express();

app.post('/login', (req, res)=>{
    res.json({
        ok: true
    })
})


module.exports = app;