
// ===============
// ====PUERTO===
// ===============
process.env.PORT = process.env.PORT || 3000;


// ===============
// ====ENTORNO===
// ===============
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ===============
// =TOKEN EXPIRED=
// ===============
process.env.TOKEN_EXPIRED = 60 * 60 * 24 * 30;

// ===============
// =SEED AUTH=====
// ===============
process.env.SEED = process.env.SEED || 'este es el seed desarrollo';


// ===============
// ====DATABASE===
// ===============
let urlDB;
if(process.env.NODE_ENV === 'dev'){
    urlDB = 'mongodb://localhost:27017/cafe';
}else{
    urlDB = process.env.MONGO_URI
}

process.env.URLDB = urlDB;