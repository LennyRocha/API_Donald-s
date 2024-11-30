//Importación de la base de datos
const deadpool = require("../../db/db.js")

// categoria.controller.js

//GET
exports.getReportes = async (req, res) => {
    try {
        const [rows] = await deadpool.query('SELECT * FROM reportes_diarios')
        if(rows.length <= 0) return res.status(200).json({
            codigo: '204',
            mensaje: '¡NO CONTENT!',
            dato:'No hay reportes disponibles'
        })
        res.json(rows)
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            error: '500',
            mensaje: '¡INTERNAL SERVER ERROR!',
            dato:'Algo salió mal, intentalo nuevamente'
        })
    }
};

//GET con id
exports.getReporte = async (req, res) => {
    try{
        const [rows] = await deadpool.query('SELECT * FROM reportes_diarios WHERE id_rep = ?', [req.params.id])
        if(rows.length <= 0) return res.status(404).json({
            error: '404',
            mensaje: '¡NOT FOUND!',
            dato:'No se encontró el reporte'
        })
        res.json(rows[0])
    }catch(error){
        console.log(error)
        return res.status(500).json({
            error: '500',
            mensaje: '¡INTERNAL SERVER ERROR!',
            dato:'Algo salió mal, intentalo nuevamente'
        })
    }
};

//DELETE
exports.deleteReportes = async (req, res) => {
    try {
        const [result] = await deadpool.query('DELETE * FROM reportes_diarios WHERE id_rep = ?', [req.params.id])
        if(result.affectedRows <= 0) return res.status(404).json({
            error: '304',
            mensaje: '¡NOT MODIFIED!',
            dato:'No se pudo eliminar el reporte'
        })
        res.sendStatus(204)
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            error: '500',
            mensaje: '¡INTERNAL SERVER ERROR!',
            dato:'Algo salió mal, intentalo nuevamente'
        })
    }
};