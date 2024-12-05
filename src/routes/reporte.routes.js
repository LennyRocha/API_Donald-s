const express = require("express");
const router = express.Router();

//Obtener las funciones del controller
const {
    getReporte,
    getReportes,
    deleteReportes
} = require("../controllers/reporte.controller");
const adminToken = require("../Auth/adminAuth");

//Rutas de la API
router.get('/admin/reporte', adminToken, getReporte)

router.get('/admin/reporte/:id', adminToken, getReportes)

router.delete('/admin/reporte/:id', adminToken, deleteReportes)

module.exports = router