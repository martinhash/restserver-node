require('./config/config');

const express = require('express')

const app = express()

const bodyParser = require('body-parser')
 
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

app.get('/usuario', function (req, res) {
  res.json('Get usuario')
})

app.post('/usuario', function (req, res) {
    console.log(req.body);
    
    let body = req.body;

    if(body.name === undefined){
        res.status(400).json({
            ok: false,
            mensaje: 'El snombre es requerido'
        })
    }else{
        res.json({
            persona: body
        })
    }
    
    res.json({
        body
    })
})

app.put('/usuario/:id', function (req, res) {

    let id = req.params.id;

    res.json({
        id
    })
})

app.delete('/usuario', function (req, res) {
    res.json('Delete usuario')
})
 
app.listen(process.env.PORT, ()=>{
    console.log("listening on port", process.env.PORT);
    
})