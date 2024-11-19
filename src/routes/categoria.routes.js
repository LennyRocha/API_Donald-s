const express = require("express");
const router = express.Router();

//Obtener las funciones del controller
const {
    getCategorias,
    getCategoria,
    postCategoria,
    patchCategoria,
    deleteCategoria,
} = require("../controllers/categoria.controller");

router.get('/categorias', getCategorias)

router.get('/categorias/:id', getCategorias)

router.post('/categorias', postCategoria)

router.patch('/categorias/:id', patchCategoria)

router.delete('/categorias/:id', deleteCategoria)

module.exports = router