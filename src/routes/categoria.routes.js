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
const elToken = require("../Auth/authMiddleware");

const adminToken = require("../Auth/adminAuth");

//Rutas de la API
router.get('/categorias', getCategorias)

router.get('/categorias/:id', getCategoria)

router.post('/categorias', elToken,  postCategoria)

router.patch('/categorias/:id', elToken, patchCategoria)

router.delete('/categorias/:id', adminToken, deleteCategoria)

module.exports = router