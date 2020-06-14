const jwt = require('jsonwebtoken');

//============
// TOKEN AUTHENTICATION
//============
let authToken = (req, res, next) => {
    let token = req.get('Authorization');
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        
        if(err){
            console.log(err);
            
            return res.status(401).json({
                ok: false,
                err
            })
        }else{
            req.users = decoded.users
            next();
        }
    })
}

module.exports = {
    authToken
}