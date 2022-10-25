// Route pour les articles
const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const articlesCtrl = require("../controllers/article.js");

router.get("/", articlesCtrl.getAllArticles); // Récupération de tous les posts
router.get("/:id", articlesCtrl.getOneArticle); // Récupération d'un post
router.get("/author/:id", articlesCtrl.getArticlesFromUser); // Récupération de tous les posts d'un utilisateur spécifique
router.post("/", auth, articlesCtrl.createArticle); // Création de post
router.put("/:id", auth, articlesCtrl.modifyArticle); // Modification de post
router.delete("/:id", auth, articlesCtrl.deleteArticle); // Suppression de post

module.exports = router;
