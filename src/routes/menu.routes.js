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
const elToken = require("../Auth/authMiddleware");

//Rutas de la API
router.get('/menu', getMenu)

router.get('/menu/nombre/:nombre', getMenuName)

router.get('/menu/:id', getMenuId)

router.post('/menu', elToken, postMenu)

router.put('/menu/:nombre', elToken, putMenu)

router.patch('/menu/:id', elToken, patchMenu)

router.delete('/menu/:nombre', elToken, deleteMenu)

module.exports = router