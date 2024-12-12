// authMiddleware.js

//Importación de jsonwebtoken
const jwt = require('jsonwebtoken');

//Creación de una palabra clave para desencriptar facilmente el token
const SECRET_KEY = "tangamandapio";

// Middleware para validar tokens y verificar si el usuario es administrador
function verificarAdministrador(req, res, next) {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({            
            "Bloqueado": "Acceso denegado. No se proporcionó un token." 
        });
    }
    
    try {
        const verified = jwt.verify(token, SECRET_KEY);
        req.user = verified;
        
        if (req.user.rol !== 1) {
            return res.status(403).json({            
                "Bloqueado": "Usted no es administrador, acceso denegado"
            });
        }

        next();
    } catch (err) {
        res.status(400).send('Token no válido.');
    }
}

module.exports = verificarAdministrador;