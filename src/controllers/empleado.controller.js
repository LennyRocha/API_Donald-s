//Importación de la base de datos
const deadpool = require("../../db/db.js")

// empleado.controller.js

//GET
exports.getEmpleados = async (req, res) => {
    try {
        const [rows] = await deadpool.query('SELECT * FROM empleados')
        if(rows.length <= 0) return res.status(200).json({
            codigo: '204',
            mensaje: '¡NO CONTENT!',
            dato:'No hay empleados que mostrar'
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
exports.getEmpleado = async (req, res) => {
    try{
        const [rows] = await deadpool.query('SELECT * FROM empleados WHERE emp_id = ?', [req.params.id])
        if(rows.length <= 0) return res.status(404).json({
            error: '404',
            mensaje: '¡NOT FOUND!',
            dato:'No se encontró al empleado'
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
exports.postEmpleado = async (req, res) => {
    try {
        const {nombre, correo, contra} = req.body
        const [rows] = 
            await deadpool.query('INSERT INTO empleados (nombre,correo,contra) VALUES (?,?,sha2(?,256))'
            ,[nombre, correo, contra])
        res.send({
            id: rows.insertId,
            nombre, 
            correo, 
            contra, 
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
exports.patchEmpleado = async (req, res) => {
    try {
        const {id} = req.params
        const {nombre, correo, contra} = req.body
        const [result] = await deadpool.query('UPDATE empleados set nombre = IFNULL(?,nombre), correo = IFNULL(?,correo), contra = IFNULL(sha2(?,256),contra) WHERE emp_id = ?'
            ,[nombre, correo, contra, id])
        if(result.affectedRows == 0) return res.status(404).json({
            error: '304',
            mensaje: '¡NOT MODIFIED!',
            dato:'No se pudo actualizar la información del empleado'
        })
    
        const [rows] = await deadpool.query('SELECT * FROM empleados WHERE emp_id = ?', [req.params.id])
        if(rows.length <= 0) return res.status(404).json({
            error: '404',
            mensaje: '¡NOT FOUND!',
            dato:'No se encontró al empleado'
        })
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
exports.deleteEmpleado = async (req, res) => {
    try {
        const [result] = await deadpool.query('DELETE * FROM empleados WHERE emp_id = ?', [req.params.id])
        res.sendStatus(204)
        if(result.affectedRows <= 0) return res.status(404).json({
            error: '304',
            mensaje: '¡NOT MODIFIED!',
            dato:'No se pudo eliminar al empleado'
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