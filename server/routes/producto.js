const express = require('express');

let { verificaToken, verificaAdminRole } = require('../middlewares/autentificacion');

let app = express();

let Producto = require('../models/producto');

app.get('/producto', verificaToken, (req, res) => {

    let desde = Number(req.query.desde) || 0

    Producto.find({ disponible: true })
        .skip(desde)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            Producto.count({ disponible: true }, (err, conteo) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    })
                }
                res.json({
                    ok: true,
                    productoDB,
                    cuantos: conteo
                })
            })
        })
});

app.get('/producto/:id', verificaToken, (req, res) => {

    let id = req.params.id

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    message: 'El ID no es correcto'
                })
            }
            res.json({
                ok: true,
                productoDB
            })
        })
})

app.get('/producto/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .populate('categoria', 'nombre')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            if (!productos) {
                return res.status(400).json({
                    ok: false,
                    message: 'El ID no es correcto'
                })
            }
            res.json({
                ok: true,
                producto: productos
            })

        })


})

app.post('/producto', verificaToken, (req, res) => {
    let body = req.body

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: req.categoria,
        usuario: req.usuario
    })

    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        return res.status(200).json({
            ok: true,
            producto: productoDB
        })
    })
});

app.put('/producto/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;
    //let descCategoria = { descripcion: body.descripcion }

    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        return res.status(200).json({
            ok: true,
            producto: productoDB
        })
    })
})

app.delete('/producto/:id', verificaToken, (req, res) => {

    let id = req.params.id

    Producto.findById(id, (err, productoDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        productoDB.disponible = false

        productoDB.save((err, productoBorrado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                producto: productoBorrado,
                message: 'El producto fue borrado'
            })
        })
    })

    /* Producto.findByIdAndUpdate(id, { disponible: false }, { new: true, runValidators: true }, (err, productoDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            productoDB: {
                message: 'El producto fue borrado'
            }
        })
    }) */
})

module.exports = app