// ======================
//      PUERTO
//=======================
process.env.PORT = process.env.PORT || 27018


// ======================
//      ENTORNO
//=======================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

// ======================
//      VENCIMINETO
//=======================
//60 segundos
//60 minutos
//24 horas
//30 dias
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30

// ======================
//      SEED DE AUTENTICACION
//=======================
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo'

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