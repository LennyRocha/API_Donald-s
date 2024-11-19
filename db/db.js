//Importa el servicio mySQL2 en modo de promesa
//npm install mysql2
const {createPool} = require('mysql2/promise')
const {
    DB_HOST,
    DB_PORT,
    DB_DATABASE,
    DB_USER,
    DB_PASSWORD
} = require("../src/config.js");

//Conector de base de datos
const deadpool = createPool({
    host:DB_HOST,
    user:DB_USER,
    password:DB_PASSWORD,
    port:DB_PORT,
    database:DB_DATABASE
});

//Exporrtar el módulo
module.exports = deadpool;

//npm install express jsonwebtoken
//npm i dotenv
//npm install sequelize mysql2