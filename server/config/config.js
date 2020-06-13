
// ===============
// ====PUERTO===
// ===============
process.env.PORT = process.env.PORT || 3000;


// ===============
// ====ENTORNO===
// ===============
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ===============
// ====DATABASE===
// ===============
let urlDB;
if(process.env.NODE_ENV === 'dev'){
    urlDB = 'mongodb://localhost:27017/cafe';
}else{
    urlDB = 'mongodb+srv://martinbj:753s5NJQnJih6Zhh@cluster0-db3ev.mongodb.net/cafe?retryWrites=true&w=majority'
}

process.env.URLDB = urlDB;