// ======================
//      PUERTO
//=======================
process.env.PORT = process.env.PORT || 27018


// ======================
//      ENTORNO
//=======================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'


// ======================
//      BASE DE DATOS
//=======================
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe'
} else {
    urlDB = 'mongodb+srv://francisco:pPBhiC145QtNL21z@cluster0.vojgy.mongodb.net/cafe'
}
process.env.URLDB = urlDB