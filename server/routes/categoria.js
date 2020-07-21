const express = require('express');

let { verificaToken, verificaAdminRole } = require('../middlewares/autentificacion');

let app = express();

let Categoria = require('../models/categoria');

app.get('/categoria', verificaToken, (req, res) => {

    Categoria.find({}, 'descripcion usuario')
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categoria) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            Categoria.count({}, (err, conteo) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    })
                }
                res.json({
                    ok: true,
                    categoria,
                    cuantos: conteo
                })
            })
        })
});

app.get('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id

    Categoria.findById(id, 'descripcion usuario')
        .exec((err, categoria) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            if (!categoria) {
                return res.status(400).json({
                    ok: false,
                    message: 'El ID no es correcto'
                })
            }
            res.json({
                ok: true,
                categoria
            })
        })
})

app.post('/categoria', [verificaToken, verificaAdminRole], (req, res) => {
    let body = req.body

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    })

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        return res.status(200).json({
            ok: true,
            categoria: categoriaDB
        })
    })
});

app.put('/categoria/:id', [verificaToken, verificaAdminRole], (req, res) => {

    let id = req.params.id;
    let body = req.body;
    //let descCategoria = { descripcion: body.descripcion }

    Categoria.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        return res.status(200).json({
            ok: true,
            categoria: categoriaDB
        })
    })
})

app.delete('/categoria/:id', [verificaToken, verificaAdminRole], (req, res) => {

    let id = req.params.id
    Categoria.findByIdAndRemove(id, (err, categoriaBorrado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            if (!categoriaBorrado) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'El id no existe'
                    }
                })
            }

            res.json({
                ok: true,
                message: 'Categoria Borrada',
            })
        })
        /* let id = req.params.id

        categoria.findByIdAndUpdate(id, { estado: false }, { new: true, runValidators: true }, (err, categoriaDB) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                categoriaDB
            })
        }) */
})

module.exports = app