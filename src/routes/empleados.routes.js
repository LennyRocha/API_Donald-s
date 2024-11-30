const express = require("express");
const router = express.Router();

//Obtener las funciones del controller
const {
    getEmpleado,
    getEmpleados,
    postEmpleado,
    patchEmpleado,
    deleteEmpleado
} = require("../controllers/empleado.controller");
const elToken = require("../Auth/authMiddleware");

//Rutas de la API
router.get('/empleados', elToken, getEmpleados)

router.get('/empleados/:id', elToken, getEmpleado)

router.post('/empleados', elToken, postEmpleado)

router.patch('/empleados/:id', elToken, patchEmpleado)

router.delete('/empleados/:id', elToken, deleteEmpleado)

module.exports = router