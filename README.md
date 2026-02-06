# Gestion d'Utilisateurs API

Une API REST construite avec Node.js, Express et MySQL pour gérer des utilisateurs. 
Ce projet inclut la validation des données, le hachage des mots de passe avec Bcrypt et une gestion complète du CRUD.

## Fonctionnalités

* **CRUD Complet** : Créer, Lire, Mettre à jour et Supprimer des utilisateurs.
* **Recherche dynamique** : Rechercher des utilisateurs par nom ou email.
* **Sécurité** : Hachage des mots de passe avec `bcrypt`.
* **Validation** : Vérification stricte des formats d'email, de la longueur des noms et de l'âge (calculé automatiquement via la date de naissance).
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
   git clone

2. acceder au dossier backend pour installer les dependances
   ```bash
   cd backend
   npm install
