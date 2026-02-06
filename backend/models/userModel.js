// importation des modules
const bcrypt = require('bcrypt');
const { pool } = require('../config/db');

//====================================================
// VALIDATIONS DES DONNEES
//====================================================

function validateUser(userData) {

    const errors = [];

    //validation du nom
    if(!userData.nom || userData.nom.trim().length < 2 ) {
        errors.push('  le nom doit avoir minimu 2 caractères');
    }

    //validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!userData.email || !emailRegex.test(userData.email)) {
        errors.push('  Email invalide');
    }

    //validation du mot de passe
    if(!userData.password || userData.password.length < 6) {
        errors.push('  le mot de passe doit avoir au moins 6 caracteres');
    }

    //validation de la date de naissance
    if(!userData.date_naissance) {
        errors.push('  la date de naissance est requise');
    }else {
        const naissance = new Date(userData.date_naissance);
        const aujourdhui = new Date();

        if(naissance > aujourdhui){
            errors.push('  la date de naissance ne peut etre dans le futur');
        }

        const age = calculerAge(userData.date_naissance);
        if (age > 150) {
            errors.push('  age superieur à 150 ans');
        }
    }
    return {
        isValid : errors.length === 0,
        errors
    };
}

//======================================================================
// LA LOGIQUE METIER
//======================================================================

//calcule l'age sur base de la date de naissance
// dateNaissance - Format 'YYYY-MM-DD'
function calculerAge(dateNaissance) {
    
    const naissance = new Date(dateNaissance);
    const aujourdhui = new Date();

    let age = aujourdhui.getFullYear() - naissance.getFullYear();
    const mois = aujourdhui.getMonth() - naissance.getMonth();

    //ajuste si l'anniversaire n'est pas encore passée
    if(mois < 0 || (mois === 0 && aujourdhui.getDate() < naissance.getDay())) {
        age--;
    }

    return age;
}

//hasher le mot de passe avec bcrypt
async function hashPassword(password) {
    const saltRound = 10;
    return await bcrypt.hash(password, saltRound);
}

//copmare le mot de passe avec le hash
async function comparePassword(password, hash) {
    return await bcrypt.compare(password, hash);
}

//==================================================
// OPERATIONS SUR LA BASE DE DONNEES 
//==================================================

//fonction pour creer un user
async function createUser(userData) {
    let connection ;

    try{
        //validation des donnees user
        const validation = validateUser(userData);

        if(!validation.isValid) {
            throw new Error (`Validation échoué :${validation.errors.join(', ')}`);
        }

        //calcul de l'age 
        const age = calculerAge(userData.date_naissance);

        //hash du mot de passe
        const hashedPassword = await hashPassword(userData.password);

        //connexiona a la DB 
        connection = await pool.getConnection();

        //insertion 
        const [result] =  await connection.query(
            `INSERT INTO users
            (nom, postnom, email, password, date_naissance, age)
            VALUES (?, ?, ?, ?, ?, ?)`, 
            [
                userData.nom,
                userData.postnom || '',
                userData.email,
                hashedPassword,
                userData.date_naissance,
                age
            ]
        );

        //recupere le user crée
        const [users] = await connection.query(
            `SELECT * FROM users where id = ?`,
            [result.insertId]
        );

        //ne renvoie pas le mot de passe hashé
        const user = users[0];
        delete user.password;

        return user;
        
    }catch(error) { 

        if(error.code === 'ER_DUP_ENTRY') {
            throw new Error('Cet email à été utilisé');
        }
        throw error;

    }finally{
        
        if(connection) connection.release();
    }
}

//recupere tous les users
async function getAllUsers() {

    let connection;

    try{

        connection = await pool.getConnection();
        const [users] = await connection.query(
            'SELECT id, nom, postnom, email, date_naissance, age, date_creation FROM users'
        );
        return users;

    }finally{
        if(connection) connection.release();
    }
}

//recupere un user par son id
async function getUserById(userId) {

    let connection;

    try{
        connection = await pool.getConnection();

        const [users] = await connection.query(
            'SELECT id, nom, postnom, email, date_naissance, age, date_creation FROM users WHERE id = ?',
            [userId]
        );
        return users[0] || null;

    }finally{
        if(connection) connection.release();
    }
}

//mettre a jour un user
async function updateUser(userId, updates) {
    
    let connection;

    try{
        connection = await pool.getConnection();

        //construction dynamique de la requette
        const fields = [];
        const values = [];

        //verifier les champs
        if(updates.nom !== undefined) {
            fields.push('nom = ?');
            values.push(updates.nom);
        } 

        if(updates.postnom !== undefined) {
            fields.push('postnom = ?');
            values.push(updates.postnom);
        }

        if(updates.email !== undefined) {
            //valider le nouvel mail
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if(!emailRegex.test(updates.email)){
                throw new Error('  Email invalide');
            }
            fields.push('email = ?');
            values.push(updates.email);
        }

        if (updates.date_naissance !== undefined) {
            //recalculer l'age
            const age = calculerAge(updates.date_naissance);
            fields.push('date_naissance = ?', 'age = ?');
            values.push(updates.date_naissance, age)
        }
        if (fields.length === 0) {
            throw new Error('   Aucune donnée à mettre à jour');
        }

        values.push(userId); //pour le where

        const [result] = await connection.query(
            `UPDATE users SET ${fields.join(',')} WHERE id = ?`,
            values
        );

        if (result.affectedRows === 0) {
            throw new Error('  Utilisateur non trouvé');
        }

        //retoutne le user mis à jour
        return await getUserById(userId);

    }catch(error) {

        if (error.code === 'ER_DUP_ENTRY') {
            throw new Error('cet email a déjà été utilisé');
        }
        throw error;

    }finally{
        if(connection) connection.release();
    }
}

//supprimer un user
async function deleteUser(userId) {
    
    let connection;

    try{
        connection = await pool.getConnection();

        const [result] = await connection.query(
            'DELETE FROM users WHERE id = ?',
            [userId]
        );
        return result.affectedRows > 0;

    }finally{
        if (connection) connection.release();
    }
}

//rechercher un utilisateur par son nom ou son email
async function searchUsers(searchTerm) {
    
    let connection;

    try{
        connection = await pool.getConnection();
        const [users] = await connection.query(
            `SELECT id, nom, postnom, email, date_naissance, age, date_creation
            FROM users
            WHERE nom LIKE ? OR postnom LIKE ? OR email LIKE ?`,
            [`%${searchTerm}%`,`%${searchTerm}%`,`%${searchTerm}%`]
        );
        return users;

    }finally{
        if(connection) connection.release();
    }
}

//======================================================
// EXPORTATION DES MODULES
//======================================================

module.exports = {
    //validation et logique metier
    validateUser,
    calculerAge,
    hashPassword,
    comparePassword,

    //operation de CRUD
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    searchUsers
};