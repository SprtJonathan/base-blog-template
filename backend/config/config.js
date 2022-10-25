// Sécurisation des identifiants de connexion au cluster dans une variable d'environnement
const dotenv = require("dotenv"); // Les identifiants sont contenus dans le fichier .env dans l'archive contenant les livrables
dotenv.config();

const mysql = require("mysql"); // Récupération du package mySQL

// Connexion à la base de données mysql
const db = mysql.createConnection({
  // Connexion à la base de données
  host: process.env.DB_URL,
  user: process.env.DB_EDITOR_NAME,
  password: process.env.DB_EDITOR_PASS,
  database: process.env.DB_NAME,
});

module.exports = db;
