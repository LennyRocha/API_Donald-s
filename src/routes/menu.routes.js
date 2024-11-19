const express = require("express");
const router = express.Router();

//Obtener las funciones del controller
const {
    getMenu,
    getMenuName,
    getMenuId,
    postMenu,
    putMenu,
    patchMenu,
    deleteMenu
} = require("../controllers/menu.controller");

//Rutas de la API
router.get('/menu', getMenu)

router.get('/menu/:nombre', getMenuName)

router.get('/menu/id/:id', getMenuId)

router.post('/menu', postMenu)

router.put('/menu/:nombre', putMenu)

router.patch('/menu/:id', patchMenu)

router.delete('/menu', deleteMenu)

module.exports = router