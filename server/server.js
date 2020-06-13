require('./config/config');

const express = require('express');
const mongoose = require('mongoose');

const app = express();

const bodyParser = require('body-parser');
 
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
 
// parse application/json
app.use(bodyParser.json());

app.use(require('./routes/index'));

mongoose.connect('mongodb://localhost:27017/cafe', (err, res) => {

    if(err){
        throw err;
    } else{
        console.log("Base de datos Online");
    }

});

app.listen(process.env.PORT, ()=>{
    console.log("listening on port", process.env.PORT);
    
})

module.exports = app;