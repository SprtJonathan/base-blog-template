// Route pour les utilisateurs
const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit"); // Package permettant de limiter les attaques par brute force en limitant le nombre de requêtes par IP
// Définition des paramètres du limiteur de requête
const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // = 5 minutes
  max: 10, // Chaque IP est limitée à 100 requêtes toutes les 5min
  error: "Erreur : Trop de tentatives de connexion infructueuses",
});

const userCtrl = require("../controllers/user");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config"); // Récupération du middleware multer pour pouvoir récupérer les images
const passwordValidation = require("../middleware/password-validation");

router.post("/register", passwordValidation, userCtrl.register); // Route pour l'inscription d'un utilisateur / On vérifie que le mot de passe corresponde au format accepté
router.post("/login", limiter, userCtrl.login); // Route pour la connexion d'un utilisateur / Utilisation du limiteur de requêtes par IP pour la connexion
router.put("/users/:id", auth, passwordValidation, userCtrl.editAccount); // Route pour l'édition d'un utilisateur
router.put(
  "/users/profilepicture/:id",
  auth,
  multer,
  userCtrl.editProfilePicture
); // Route pour l'édition de la photo de profil d'un utilisateur
router.put("/users/admin/:id", auth, userCtrl.editAccountAdmin); // Route pour l'édition d'un utilisateur par l'admin
router.delete("/users/:id", auth, userCtrl.deleteAccount); // Route pour la suppression d'un utilisateur
router.get("/users/:id", auth, userCtrl.getOneUser); // Route pour la récupération d'un utilisateur en particulier
router.get("/users", auth, userCtrl.getAllUsers); // Route pour la récupération de tous les utilisateurs

module.exports = router;
