require('./config/config');
const express = require('express');
const mongoose = require('mongoose')

const app = express();

app.use(require('./routes/usuario'))


mongoose.connect(process.env.URLDB, { useUnifiedTopology: true, useCreateIndex: true }, (err, res) => {

    if (err) throw err;
    console.log('base de datos ONLINE');

})
app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto: ', process.env.PORT);
});