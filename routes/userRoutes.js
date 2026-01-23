//importation des modules
const express = require('express');

//creation du routeur avec express
const router = express();

//route qui liste tout les utilisateurs
router.get('/', (req, res) => {

    res.json({
        message : 'Lites des utilisateurs'
    });
});

//route qui recupere un utilisateur specifique 
router.get('/:id', (req, res) => {

    const userId = req.params.id;
    res.json({
        message : `Utilisateur #${userId}`,
        donnes : req.body
    });
});

//route pour creer un user
router.post('/', (req, res) => {
    
    const nouveauUser = {
        id : Date.now(),
        ...req.body,
        dateCreation : new Date()
    };

    console.log('Donnees recues :', req.body);

    res.json({
        message : 'user crée !',
        utilisateur : nouveauUser
    });
});

//route pour modifier un user 
router.put('/:id', (req, res) => {

    const id = req.params.id;

    console.log(`utilisateur #${id} modifié`);

    res.json({
        message : `utilisateur #${id} modifié`,
        donnees : req.body
    });
});

//route pour supprimer un user
router.delete('/:id', (req, res) => {
    res.json({
        message : `utilisateur #${req.params.id} supprimée`
    });
});

//exportation
module.exports = router;

