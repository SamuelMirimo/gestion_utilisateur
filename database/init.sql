
-- Ce script crée la base de données et la table users

CREATE DATABASE IF NOT EXISTS gestion_users
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE gestion_users;

CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(50) NOT NULL,
    postnom VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    date_naissance DATE NOT NULL,
    age INT,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insérer un utilisateur de test
INSERT IGNORE INTO users (nom, postnom, email, password, date_naissance, age) 
VALUES ('Admin', 'Test', 'admin@test.com', 'motdepasse', '1990-01-01', 34);