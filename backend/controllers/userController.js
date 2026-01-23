//importation des modules 
const userModel = require('../models/userModel');

//======================================================
// FONCTIONS HELPER POUR LES MESSAGES
//======================================================
// envoi un message d'erreur 
const sendError = (res, status, message) => {
    res.status(status).json({
        success : false,
        message : message
    });
};

//envoi un message de succes
const sendSuccess = (res, status, message) => {
    res.status(status).json({
        success : true, 
        message : message
    });

    if(data !== null) {
        response.data = data;
    }
    res.status(status).json(response);
};

//=================================================================
// FONCTIONS DU CONTROLEUR
//=================================================================
//recupere tous les utilisateurs avec la fonction modals/userModel/getAllUsers
const getAllUsers = async (req, res) => {

    console.log('Recuperation de tous les utilisateurs...');
    try{
        //on appelle le model pour recuperer les users
        const users = await userModel.getAllUsers();

        //reponse au client
        sendSuccess(res, 200, `${users.length} utilisateur(s) trouvé(s)`, users);

    }catch(error){
        console.error('### Erreur dans getAllUsers :', error);
        sendError(res, 500, '### Erreur lors de la recuperation des utilisateurs');
    }
};

//on recupere un utilisateur par son ID
const getUserById = async (req, res) => {

    //on recupere l'id depuis les parametres de l'URL
    const userId = parseInt(req.params.id);
    console.log(`recherche de l'utilisateur #${userId}...`);

    //valisdation de l'id
    if(isNaN(userId) || userId <= 0) {
        return sendError(res, 404, '### ID invalide');
    }

    try{
        const user = await userModel.getUserById(userId);

        //si l'id n'existe pas
        if(!user) {
            return sendError(res, 404, `### utilisateur #${userId} non trouvé`);
        }

        sendSuccess(res, 200, `utilisateur #${userId} trouvé`, user);
    }catch(error) {
        console.error(`### Erreur dans getUserById (#${userId}) :`, error);
        sendError(res, 500, '### Erreur du serveur');
    }
};