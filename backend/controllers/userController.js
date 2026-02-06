//importation des modules 
const userModel = require('../models/userModel');

//======================================================
// FONCTIONS HELPER POUR LES MESSAGES (CORRIGÉES)
//======================================================

// Envoi un message d'erreur 
const sendError = (res, status, message) => {
    // On ajoute un return pour s'assurer qu'on arrête l'exécution
    return res.status(status).json({
        success: false,
        message: message
    });
};

// Envoi un message de succès
// Ajout de l'argument 'data' ici !
const sendSuccess = (res, status, message, data = null) => {
    const responseBody = {
        success: true,
        message: message
    };

    // On n'ajoute la clé data que si elle contient quelque chose
    if (data !== null) {
        responseBody.data = data;
    }

    return res.status(status).json(responseBody);
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
        console.error('  Erreur dans getAllUsers :', error);
        sendError(res, 500, '  Erreur lors de la recuperation des utilisateurs');
    }
};

//on recupere un utilisateur par son ID
const getUserById = async (req, res) => {

    //on recupere l'id depuis les parametres de l'URL
    const userId = parseInt(req.params.id);
    console.log(`recherche de l'utilisateur #${userId}...`);

    //valisdation de l'id
    if(isNaN(userId) || userId <= 0) {
        return sendError(res, 404, '  ID invalide');
    }

    try{
        const user = await userModel.getUserById(userId);

        //si l'id n'existe pas
        if(!user) {
            return sendError(res, 404, `  utilisateur #${userId} non trouvé`);
        }

        sendSuccess(res, 200, `utilisateur #${userId} trouvé`, user);
    }catch(error) {
        console.error(`  Erreur dans getUserById (#${userId}) :`, error);
        sendError(res, 500, '  Erreur du serveur');
    }
};

//cree un nouvel utilisateur 
const createUser = async (req, res) => {
    console.log('creation d\'un nouvel utilisateur');
    console.log('Données récue :', req.body);

    try{
        const user = await userModel.createUser(req.body);

        return sendSuccess(res, 201, 'utilisateur crée avec succès', user);

    }catch(error) {
        console.error('  Erreur dans createUser', error);

        if(error.message.includes('Validation échoué') ||
            error.message.includes('Cet email à été utilisé')) {
            return sendError(res, 400, error.message);
        }else{
            return sendError(res, 500, '  Erreur lor de la creation de l\'utilisateur');
        }
    }
};

//mettre a jour un utilisateeur existant 
const updateUser = async (req, res) => {

    const userId = parseInt(req.params.id);
    console.log(`Mise a jour de l'utilisateur #${userId}`);
    console.log('Données de la mise à jour', req.body);

    if(isNaN(userId) || userId <= 0) {
        sendError(res, 400, '  Id invalide');
    }
    
    //verifie qu'au moins un champ est fourni
    const {nom, postnom, email, date_naissance} = req.body;
    if(!nom && !postnom && !email && !date_naissance) {
        return sendError(res, 400, 'au moins un champ doit etre fourni pour la mise à jour');
    }

    try{
        //verifie si l'utilisateur existe
       const userExists = await userModel.getUserById(userId);
       if(!userExists) {
            return sendError(res, 404, `utilisateur #${userId} non trouvé`);
       } 
       const updateUser = await userModel.updateUser(userId, req.body);

       sendSuccess(res, 200, `utilisateur #${userId} mis à jour avec succès`, updateUser);

    }catch (error) {
        console.error(`Erreur dans updateUser (${userId})`, error);

        if (error.message.includes('Email déjà utilisé') ||
            error.message.includes('Email invalide') ||
            error.message.includes('Aucune donnée à mettre à jour')) {
            sendError(res, 400, error.message);
        } else if (error.message.includes('Utilisateur non trouvé')) {
            sendError(res, 404, error.message);
        } else {
            sendError(res, 500, 'Erreur lors de la mise à jour de l\'utilisateur');
        }
    }
};

//supprimer un utilisateur
const deleteUser = async (req, res) => {
    const userId = parseInt(req.params.id);
    console.log(`Suppresion de l'utilisateur #${userId}`);
    
    if (isNaN(userId) || userId <= 0) {
        return sendError(res, 404, 'ID invalide');
    }

    try{
        const userExists = await userModel.getUserById(userId);
        if(!userExists) {
            return sendError(res, 404, `utilisateur #${userId} non trouvé`);
        }

        const deleted = await userModel.deleteUser(userId);
        if(!deleted) {
            return sendError(res, 500, 'Erreur lors de la suppression');
        }

        return sendSuccess(res, 200, `utilisateur #${userId} supprimé avec succes`);

    }catch(error) {
        console.error(`Erreur dans deleteUser (${userId}) :`, error);
        return sendError(res, 500, `Erreur lors de la suppression de l\'utilisateur`);
    }
};

//rechercher un utilisateur par son nom ou son email
const userSearch = async (req, res) => {

    //recupere le terme de recherche depuis la query string
    const searchTerm = req.query.q;
    console.log(`Recherche d'utilisateurs : "${searchTerm}"`);

    //validation du terme de recherche
    if(!searchTerm || searchTerm.trim().length < 2) {
        return sendError(res, 400, 'le terme de recherche doit contenir au moins 2 caracteres');
    }

    try{
        const users = await userModel.searchUsers(searchTerm.trim());

        sendSuccess(res, 200, `${users.length} utilisateur(s) trouvée :`, users);

    }catch(error) {
        console.error('Erreur dans searchUser', error);
        sendError(res, 500, 'Erreur lors de la recherche');
    }
};

//=========================================================================
// EXPORTATION 
//=========================================================================

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    userSearch
};