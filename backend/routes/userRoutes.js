//importation des modules
const router = express();
const express = require('express');
const userController = require('../controllers/userController');

//=======================================================================
// ROUTES CRUD
//=======================================================================

//route qui liste tout les utilisateurs
router.get('/', userController.getAllUsers);

//route qui recupere un utilisateur specifique 
router.get('/:id', userController.getUserById);

//route pour creer un user
router.post('/', userController.createUser);

//route pour modifier un user 
router.put('/:id', userController.updateUser);

//route pour supprimer un user
router.delete('/:id', userController.deleteUser);

//route de recherche
router.get('/search', userController.userSearch);

//========================================================================
// EXPORTATION
//========================================================================
module.exports = router;

