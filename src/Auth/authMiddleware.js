// authMiddleware.js

//Importación de jsonwebtoken
const jwt = require('jsonwebtoken');

//Creación de una palabra clave para desencriptar facilmente el token
const SECRET_KEY = "tangamandapio";

//Función que valida el token recibido
function elToken(req, res, next) {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(401).send("Acceso denegado. No tienes un token de acceso." );
    }
    
    try {
        const verified = jwt.verify(token, SECRET_KEY);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).send('Token no válido.');
    }
}

module.exports = elToken;