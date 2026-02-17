//importation des modules
require('dotenv').config();
const express = require('express');
const userRoutes = require('./routes/userRoutes');
const { pool, testConnection } = require('./config/db');

//initialisation de l'application (creation d'une)
const app = express();
const PORT = process.env.PORT || 5000;


//=========================================================
//LES MIDDLEWARES
//=========================================================

//middleware qui permet de lire le json des requettes
app.use(express.json());

//monte les routes utilisateurs sous api/users
app.use('/api/users', userRoutes);

//middleware de logging personnalisé
app.use((req, res, next) => {

    const maintenant = new Date();

    const dateFr = `${maintenant.getDate()}/${maintenant.getMonth() + 1}/${maintenant.getFullYear()}`;

    const heure = `${maintenant.getHours()}h:${maintenant.getMinutes()}m:${maintenant.getSeconds()}s`;

    console.log(`[${dateFr} ${heure}] ${req.method} ${req.url}`);

    next(); //passe au middleware suivant 
});

//middleware CORS pour autoriser l'acces du frontend
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

//===================================================
//LES ROUTES
//===================================================

//route racine (page d'accueil)
app.get('/', (req, res) => {
    res.json({
        message: 'API Gestion Utilisateur',
        version: '1.0.0',
        endpoints : {
            users : 'GET api/users',
            health : 'GET api/health',
        }
    });
});

//route de verification de connexion
app.get('/api/health', async (req, res) =>{

    let connection;
    try{
        connection = await pool.getConnection();

        const [result] = await connection.query('SELECT 1 as status');

        //libere la connexion
        connection.release();

        res.json({
            message : 'healthy',
            database : 'connected',
            server : 'running',
            timestamp : new Date().toISOString(),
            check : result[0].status
        });
    }catch (error) {
        res.status(500).json({
            status : 'unhealthy',
            database : 'disconnected',
            error : error.message,
            timestamp : new Date().toISOString()  
        });
    }
})


//middleware pour les routes 404 (doit toujours etre a la fin) 
app.use((req, res) => {
    res.status(404).json({
        error : 'route non trouvée',
        method : req.method,
        url : req.url
    });
});

//====================================================
// DEMARRAGE DU SERVEUR
//====================================================

//mettre le serveur sur ecoute 
async function startServer() {
    console.log('test de connexion à MySQL ...');

    const dbConnected = await testConnection();

    //si la connexion échoue
    if (!dbConnected) {
        console.log('  Impossible de démarrer : MySQL non connecté');
        console.log('Vérifie :');
        console.log('  1. WAMP est-il démarré ? (icône verte)');
        console.log('  2. Le fichier .env est-il correct ?');
        console.log('  3. phpMyAdmin fonctionne-t-il ?');
        return;
    }

    //sinon on lance le serveur
    app.listen(PORT, () => {
        console.log(`le serveur demarre sur http://localhost:${PORT}`);
        console.log(`verification de la connexion sur http://localhost:${PORT}/api/health`);
    });
}

//execution de la fonction startServer
startServer();
