const express = require("express");
const router = express.Router();

//Obtener las funciones del controller
const {
    getOrdenes,
    getOrden,
    postOrden,
    patchOrden,
    patchEstado,
    deleteOrden
} = require("../controllers/orden.controller.js");

router.get('/orden', getOrdenes)

router.get('/orden/:id', getOrden)

router.post('/orden', postOrden)

router.patch('/orden/:id', patchOrden)

router.patch('/orden/estado/:id', patchEstado)

router.delete('/orden/:id', deleteOrden)

module.exports = router