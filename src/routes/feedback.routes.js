const express = require("express");
const router = express.Router();

//Obtener las funciones del controller
const {
    getFeedback,
    postFeedbck,
    patchFeedback,
    deleteFeedback
} = require("../controllers/feedback.controller");

//Rutas de la API
router.get('/comentarios/:producto', getFeedback)

router.post('/comentarios', postFeedbck)

router.patch('/comentarios/:id', patchFeedback)

router.delete('/comentarios/:id', deleteFeedback)

module.exports = router