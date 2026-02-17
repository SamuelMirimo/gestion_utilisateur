# Gestion d'Utilisateurs API

Une API REST construite avec Node.js, Express et MySQL pour gérer des utilisateurs. 
Ce projet inclut la validation des données, le hachage des mots de passe avec Bcrypt et une gestion complète du CRUD.

## Fonctionnalités essenteil

* **CRUD Complet** : Créer, Lire, Mettre à jour et Supprimer des utilisateurs.
* **Recherche dynamique** : Rechercher des utilisateurs par nom ou email.
* **Sécurité** : Hachage des mots de passe avec `bcrypt`.
* **Validation** : Vérification stricte des formats d'email, de la longueur des noms et de l'âge        (calculé automatiquement via la date de naissance).
* **Gestion de base de données** : Utilisation d'un pool de connexions asynchrones avec `mysql2/promise`.

## Technologies utilisées

* **Backend** : Node.js, Express
* **Base de données** : MySQL
* **Authentification/Sécurité** : Bcrypt, Dotenv
* **Outils de test** : Thunder Client / Postman

## Prérequis

* [Node.js](https://nodejs.org/) (v14+)
* [Wampserver](https://www.wampserver.com/) ou MySQL Server
* Un client pour tester l'API (Thunder Client conseillé)

## Installation et Configuration

1. **Cloner le projet**
   ```bash
   git clone https://github.com/SamuelMirimo/gestion_utilisateur.git

2. **acceder au dossier backend pour installer les dependances**
   ```bash
   cd backend
   npm install
   
3. **Configurer l'environnement Créez un fichier .env à la racine du dossier backend :**
```
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSwORD=votre_mot_de_passe
DB_NAME=gestion_users
DB_PORT=3306
```

4. **Lancer le serveur**

```bash
npm run dev
```
## Méthode,Endpoint et Description

GET,/api/users             **Récupère tous les utilisateurs**
GET,/api/users/:id         **Récupère un utilisateur par ID**
GET,/api/users/search?q=   **"Recherche (nom, postnom, email)"**
POST,/api/users            **Crée un nouvel utilisateur**
PUT,/api/users/:id         **Met à jour un utilisateur**
DELETE,/api/users/:id      **Supprime un utilisateur**

Par MIRIMO LUBUTO Samuel, Merci de laisser une étoile vous trouvez le projet intéressant !!!