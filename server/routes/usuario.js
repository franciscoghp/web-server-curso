const express = require('express');

const app = express();

const bcrypt = require('bcrypt')

const Usuario = require('../models/usuario')

const _ = require('underscore')

const { verificaToken, verificaAdminRole } = require('../middlewares/autentificacion')

app.get('/usuario', verificaToken, (req, res) => {

    let desde = Number(req.query.desde || 0)
    let limite = Number(req.query.limite || 5)

    Usuario.find({ role: 'ADMIN_ROLE' }, 'nombre estado google role email img')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            Usuario.count({ role: 'ADMIN_ROLE' }, (err, conteo) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    })
                }
                res.json({
                    ok: true,
                    usuarios,
                    cuantos: conteo
                })

            })

        })

});
app.post('/usuario', (req, res) => {
    let body = req.body

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    })

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        return res.status(200).json({
            ok: true,
            usuario: usuarioDB
        })
    })

})

app.put('/usuario/:id', [verificaToken, verificaAdminRole], (req, res) => {
    let id = req.params.id
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado'])

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        })
    })
})

app.delete('/usuario/:id', [verificaToken, verificaAdminRole], (req, res) => {

    let id = req.params.id
    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            if (!usuarioBorrado) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Usuario no encontrado'
                    }
                })
            }

            res.json({
                ok: true,
                usuario: usuarioBorrado
            })

        })
        /* let id = req.params.id

        Usuario.findByIdAndUpdate(id, { estado: false }, { new: true, runValidators: true }, (err, usuarioDB) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                usuarioDB
            })
        }) */
})

module.exports = app