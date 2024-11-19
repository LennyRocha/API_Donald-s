//Importacion de express
const express = require('express');
//Importar las rutas
const routes = require("./routes/Index.js");
//Importar la configuracion env
const {PORT} = require("./config.js");



//Crear el servicio con express
const app = express();

//Para implementar formularios
app.use(express.urlencoded({ extended: true }));

//Usa el formato de retorno de objetos JSON
app.use(express.json())

//Declaración del path a utilizar
app.use("/v1", routes());

//Manejador de una ruta no existente
app.use((req,res,next) => {
    res.status(404).json({
        error: '404',
        mensaje: '¡ENDPOINT NO ENCONTRADO!',
        dato:'La ruta que ingresaste no es correcta o no existe'
    })
})

//Puerto que utilizará
app.listen(PORT);

console.log("Iniciando puerto ",PORT)