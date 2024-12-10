// Importar el router express
const express = require('express');
const router = express.Router()
// Importar el jwt para reestringir
const jwt = require("jsonwebtoken");
const SECRET_KEY = "tangamandapio";

// Importar el encriptador de express
const crypto = require('crypto'); 

//Importación de la base de datos
const deadpool = require("../../db/db.js");

function hashPassword(password) { 
    return crypto.createHash('sha256').update(password).digest('hex'); 
}

// index.controller.js

//Ruta para obtener token
router.post('/auth', async (req, res) => {
    try {
        const { nombre, contra } = req.body;

        //Se valida al usuario en la base de datos
        const [rows] = await deadpool.query('SELECT * FROM empleados WHERE nombre = ?', [nombre]);
        
        if (rows.length === 0) {
            return res.status(400).send('Usuario o contraseña incorrectos');
        }

        //Se comparan las contraseñas encriptadas (utilizan sha2)
        const user = rows[0];
        const rol = rows[0].rol;
        console.log(rol);
        const hashedPassword = hashPassword(contra); 
        console.log(hashedPassword)
        console.log(user.nombre, user.contra)
        if (hashedPassword !== user.contra) { 
            return res.status(400).send('Usuario o contraseña incorrectos'); 
        }
    
        //Se genera el token
        const payload = { nombre, rol };
    
        const token = jwt.sign(
            payload,
            SECRET_KEY,
            { expiresIn: "30m" }
        );
    
        //Se adjunta al header
        res.header('Authorization', `Bearer ${token}`).json({
            "nombre": nombre,
            "token": token
        });
    } catch (error) {
        console.log(error);
        res.status(500).send('Error al iniciar sesión');
    }    
});

module.exports = router;