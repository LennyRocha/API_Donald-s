const express = require("express");
const router = express.Router();
const app = express();
const path = require('path');

//Importación de las routas en este archivo para exportar un único módulo al index
const menu_routes = require('./menu.routes.js')
const orden_routes = require('./orden.routes.js')
const empleados_routes = require('./empleados.routes.js')
const categoria_routes = require('./categoria.routes.js')
const feedback_routes = require('./feedback.routes.js');
const login = require("../controllers/index.controller.js");
const reporte_routes = require("../routes/reporte.routes.js");

const _dirname = __dirname;

app.use(express.static(path.join(_dirname, '../public')));

//Exporta una función que contiene todas las rutas a utilizar para una única importación en el índice.
module.exports = function(){
    //Menú de inicio
    router.get("/", (req, res) => {
        res.sendFile(path.join(__dirname, '../public', 'index.html'));
    });

    //Pequeño testeo del login
    router.get("/login",(req,res) => {
        res.send(`<html>
                    <head>
                        <title>Logeando prueba</title>
                        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
                    </head>
                    <body>
                        <br>
                        <form method="POST" action="auth" class="container">
                            Nombre de usuario: <input type="text" name="nombre" class="form-control"/><br>
                            Contraseña: <input type="password" name="contra" class="form-control"/><br>
                            <input type="submit" value="Acceder" class="btn btn-primary" id="entrar"/>
                        </form>
                    </body>
                </html>`)
    });

    router.use(menu_routes)
    router.use(orden_routes)
    router.use(empleados_routes)
    router.use(categoria_routes)
    router.use(feedback_routes)
    router.use(reporte_routes)
    router.use(login)

    return router;
}