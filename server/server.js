require('./config/config')
const express = require('express')
const app = express()

const bodyParser = require('body-parser')
    // parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.get('/usuario', (req, res) => {
    app.json('get Usuario')
});
app.post('/usuario', (req, res) => {
    let body = req.body
    app.json(body)
})
app.put('/usuario/:id', (req, res) => {
    let id = req.params.id
    app.json({ id })
})
app.delete('/usuario', (req, res) => {
    app.json('delete Usuario')
})
app.listen(process.env.PORT, () => {
    console.log('Escuchando el puerto', process.env.PORT)
})