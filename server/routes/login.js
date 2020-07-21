const express = require('express');

const app = express();

const bcrypt = require('bcrypt')

const jwt = require('jsonwebtoken')

const Usuario = require('../models/usuario')

let Categoria = require('../models/categoria');

app.post('/login', (req, res) => {

    let body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: '[Usuario] o contraseña incorrectos'
                }
            })
        }

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o [contraseña] incorrectos'
                }
            })
        }

        Categoria.findOne({ descripcion: body.descripcion }, (err, categoriaDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            let token = jwt.sign({
                usuario: usuarioDB,
                categoria: categoriaDB,
            }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN })

            res.json({
                ok: true,
                usuario: usuarioDB,
                categoria: categoriaDB,
                token
            });
        })
    })
});

module.exports = app