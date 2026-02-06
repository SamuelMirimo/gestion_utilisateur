//importation des modules
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

//=======================================================================
// ROUTES CRUD
//=======================================================================

//route qui liste tout les utilisateurs
router.get('/', userController.getAllUsers);

//route de recherche
router.get('/search', userController.userSearch);

//route qui recupere un utilisateur specifique 
router.get('/:id', userController.getUserById);

//route pour creer un user
router.post('/', userController.createUser);

//route pour modifier un user 
router.put('/:id', userController.updateUser);

//route pour supprimer un user
router.delete('/:id', userController.deleteUser);

//========================================================================
// EXPORTATION
//========================================================================
module.exports = router;

