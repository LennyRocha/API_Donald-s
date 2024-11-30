// authMiddleware.js

//Importación de jsonwebtoken
const jwt = require('jsonwebtoken');

//Creación de una palabra clave para desencriptar facilmente el token
const SECRET_KEY = "tangamandapio";

// Middleware para validar tokens y verificar si el usuario es administrador
function verificarAdministrador(req, res, next) {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1];
    console.log('Token recibido: ', token);
    
    if (!token) {
        return res.status(401).json({            
            "metadata": [
            { 
                "codigo": "-01", 
                "mensaje": "Acceso denegado. No se proporcionó un token." 
            }
            ],
        });
    }
    
    try {
        const verified = jwt.verify(token, SECRET_KEY);
        req.user = verified; // Almacena los datos del usuario en req.user
        
        // Verifica si el correo pertenece al administrador
        if (req.user.correo !== 'admin@gmail.com') { // Cambia el correo por el del administrador
            return res.status(403).json({            
                "metadata": [
                { 
                    "codigo": "-01", 
                    "mensaje": "Usted no es administrador, acceso denegado" 
                }
                ],
            });
        }

        next(); // Continúa si es administrador
    } catch (err) {
        res.status(400).send('Token no válido.');
    }
}

module.exports = verificarAdministrador;