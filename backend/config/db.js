//importation du module
require('dotenv').config();
const mysql = require('mysql2/promise');

//configuration de la connexion a la BD
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER, 
    password: process.env.DB_PASSwORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 250,
    queueLimit: 0
};

//premier pool sans base de donnees specifique 
const pool = mysql.createPool(dbConfig);



//test de connexion 
async function testConnection () {

    let connection;

    try{
        //initialise la DB si besoin
        connection = await pool.getConnection();

        //requette simple pour tester la connexion 
        const [rows] = await connection.query('SELECT NOW() as currentTime');

        console.log('connexion MySQL établie !!!');
        console.log(`Heure du serveur : ${rows[0].currentTime}`);

        return true;

    }catch(error) {

        console.error('  erreur de connexion a myql :', error.message);
        console.log('  verifie : wamp, les identifiants .env');

        return false;

    }finally{

        //on rend la connexion du pool quoi qu'il arrive 
        if(connection) connection.release();
    };
}

//exportation des modules 
module.exports = {
    pool,
    testConnection
};