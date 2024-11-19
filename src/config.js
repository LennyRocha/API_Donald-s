//Importacion del servicio dotenv
const {config} = require('dotenv')

//Inicializar la "clase"
config()

//Exportar las variables de entorno, y darles un valor default si no lo tienen
exports.PORT = process.env.PORT || 3000
exports.DB_HOST = process.env.DB_HOST || "localhost"
exports.DB_PORT = process.env.DB_PORT || 3306
exports.DB_USER = process.env.DB_USER || "HP-KENNY"
exports.DB_PASSWORD = process.env.DB_PASSWORD || "2005"
exports.DB_DATABASE = process.env.DB_DATABASE || "apiDonalds"

/*console.log(process.env.PORT)
console.log(process.env.DB_HOST)
console.log(process.env.DB_PORT)
console.log(process.env.DB_USER)
console.log(process.env.DB_PASSWORD)
console.log(process.env.DB_DATABASE)*/

//process.env.PORT
/**
 * process: objeto global de Node
 * env: almacena todas las variables de mi PC
 * PORT: la variable que creé 
 */