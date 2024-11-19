//Importación de la base de datos
const deadpool = require("../../db/db.js")

// categoria.controller.js

//GET
exports.getCategorias = async (req, res) => {
    try {
        const [rows] = await deadpool.query('SELECT * FROM categorias')
        if(rows.length <= 0) return res.status(200).json({
            codigo: '204',
            mensaje: '¡NO CONTENT!',
            dato:'No hay categorias disponibles'
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

//GET con nombre
exports.getCategoria = async (req, res) => {
    try{
        const [rows] = await deadpool.query('SELECT * FROM categorias WHERE cat_id = ?', [req.params.id])
        if(rows.length <= 0) return res.status(404).json({
            error: '404',
            mensaje: '¡NOT FOUND!',
            dato:'No se encontró la categoria'
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

//POST
exports.postCategoria = async (req, res) => {
    try {
        const {nombre, descripcion} = req.body
        const [rows] = 
            await deadpool.query('INSERT INTO categorias (nombre,descripcion) VALUES (?,?)'
            ,[nombre, descripcion])
        res.send({
            id: rows.insertId,
            nombre, 
            descripcion
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
exports.patchCategoria = async (req, res) => {
    try {
        const {id} = req.params
        const {nombre, descripcion} = req.body
        const [result] = await deadpool.query('UPDATE categorias set nombre = IFNULL(?,nombre), descripcion = IFNULL(?,descripcion) WHERE cat_id = ?'
            ,[nombre, descripcion, id])
        if(result.affectedRows == 0) return res.status(404).json({
            error: '304',
            mensaje: '¡NOT MODIFIED!',
            dato:'No se pudo actualizar la información de la categoría'
        })

        const [rows] = await deadpool.query('SELECT * FROM categorias WHERE cat_id = ?', [req.params.id])
        if(rows.length <= 0) return res.status(404).json({
            error: '404',
            mensaje: '¡NOT FOUND!',
            dato:'No se encontró la categoria'
        })
        res.sendStatus(201)
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
exports.deleteCategoria = async (req, res) => {
    try {
        const [result] = await deadpool.query('DELETE * FROM categorias WHERE cat_id = ?', [req.params.id])
        if(result.affectedRows <= 0) return res.status(404).json({
            error: '304',
            mensaje: '¡NOT MODIFIED!',
            dato:'No se pudo eliminar la categoría'
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