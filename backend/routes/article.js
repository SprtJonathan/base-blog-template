// Route pour les articles
const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const articlesCtrl = require("../controllers/article.js");

router.get("/", articlesCtrl.getAllArticles); // Récupération de tous les articles
router.get("/:id", articlesCtrl.getOneArticle); // Récupération d'un article
router.get("/author/:id", articlesCtrl.getArticlesFromUser); // Récupération de tous les posts d'un utilisateur spécifique
router.post("/", auth, articlesCtrl.createArticle); // Création d'article
router.put("/:id", auth, articlesCtrl.modifyArticle); // Modification d'article
router.delete("/:id", auth, articlesCtrl.deleteArticle); // Suppression d'article

module.exports = router;
