//Importación de la base de datos
const deadpool = require("../../db/db.js")

// empleado.controller.js

//GET comentarios de un producto
exports.getFeedback = async (req, res) => {
    try {
        //Primero se verifica que exista el producto
        const [row] = await deadpool.query("SELECT prod_id FROM productos WHERE nombre = ?",[req.params.producto])
        if(row.length <= 0) return res.status(404).json({
            error: '404',
            mensaje: '¡NOT FOUND!',
            dato:'No se encontró algun platillo con ese nombre'
        })
        const idPlato = row[0].prod_id
        
        const [rows] = await deadpool.query('SELECT * FROM feedback WHERE producto = ?',[idPlato])
        console.log(req.params.producto)
        if(rows.length <= 0) return res.status(200).json({
            error: '204',
            mensaje: '¡NO CONTENT!',
            dato:'No se encontraron comentarios de este producto'
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

//POST
exports.postFeedbck = async (req, res) => {
    try {
        const {prod_id, nombre, comentario, calificacion} = req.body

        if(calificacion > 5) return res.status(400).json({
            error: '400',
            mensaje: '¡BAD REQUEST!',
            dato:'No puedes dar una calificación mayor a 5 estrellas'
        })

        //Primero se verifica que exista el producto
        const [row] = await deadpool.query("SELECT * FROM productos WHERE prod_id = ?",[prod_id])
        if(row.length <= 0) return res.status(404).json({
            error: '404',
            mensaje: '¡NOT FOUND!',
            dato:'No se encontró algun platillo con ese id'
        })
        const idPlato = row

        const [rows] = 
            await deadpool.query('INSERT INTO feedback (producto,usuario,comentario,calificacion) VALUES (?,?,?,?)'
            ,[prod_id, nombre, comentario, calificacion])
        res.send({
            id: rows.insertId,
            nombre, 
            comentario, 
            calificacion, 
            prod_id
        }); 
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            error: '500',
            mensaje: '¡INTERNAL SERVER ERROR!',
            dato:'Algo salió mal, intentalo nuevamente'
        })
    }
};

//PATCH
exports.patchFeedback = async (req, res) => {
    try {
        const {nombre, comentario, calificacion} = req.body

        if(calificacion > 5) return res.status(400).json({
            error: '400',
            mensaje: '¡BAD REQUEST!',
            dato:'No puedes dar una calificación mayor a 5 estrellas'
        })

        const [rows] = 
            await deadpool.query('UPDATE feedback  SET usuario = IFNULL(?,usuario), comentario = IFNULL(?,comentario), calificacion = IFNULL(?,calificacion) WHERE fed_id = ?'
            ,[nombre, comentario, calificacion, req.params.id])
        res.send({
            nombre, 
            comentario, 
            calificacion, 
        }); 
        res.json(rows[0])
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            error: '500',
            mensaje: '¡INTERNAL SERVER ERROR!',
            dato:'Algo salió mal, intentalo nuevamente'
        })
    }
};

//DELETE
exports.deleteFeedback = async (req, res) => {
    try {
        const [result] = await deadpool.query('DELETE * FROM feedback WHERE fed_id = ?', [req.params.id])
        res.sendStatus(204)
        if(result.affectedRows <= 0) return res.status(404).json({
            error: '304',
            mensaje: '¡NOT MODIFIED!',
            dato:'No se pudo eliminar tu comentario'
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            error: '500',
            mensaje: '¡INTERNAL SERVER ERROR!',
            dato:'Algo salió mal, intentalo nuevamente'
        })
    }
};