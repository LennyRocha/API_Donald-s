// authMiddleware.js

//Importación de jsonwebtoken
const jwt = require('jsonwebtoken');

//Creación de una palabra clave para desencriptar facilmente el token
const SECRET_KEY = "tangamandapio";

//Función que valida el token recibido
function elToken(req, res, next) {
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
        req.user = verified; // Aquí puedes almacenar los datos del usuario para su uso posterior
        next();
    } catch (err) {
        res.status(404).json({            
            "metadata": [
            { 
                "codigo": "-01", 
                "mensaje": "Token no válido." 
            }
            ],
        });
    }
}

module.exports = elToken;