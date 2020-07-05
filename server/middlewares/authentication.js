const jwt = require('jsonwebtoken');

//============
// TOKEN AUTHENTICATION
//============
let authToken = (req, res, next) => {
    let token = req.get('Authorization');
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if(err){
            return res.status(401).json({
                ok: false,
                err
            })
        }else{
            req.user = decoded.user
            next();
        }
    })
}
//============
// TOKEN AUTHENTICATION
//============
let authTokenImg = (req, res, next) => {
    let token = req.query.token;
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if(err){
            return res.status(401).json({
                ok: false,
                err
            })
        }else{
            req.user = decoded.user
            next();
        }
    })
}
//============
// TOKEN AUTHENTICATION ADMIN ROLE
//============
let authAdminRole = (req, res, next) => {
    let user = req.user;
    if(user.role !== 'ADMIN_ROLE'){
        return res.json({
            ok: false,
            err: {
                message: 'Usted no es Administrador'
            }
        })
    }
    next();
}

module.exports = {
    authToken,
    authAdminRole,
    authTokenImg
}