const db = require("../config/config"); // Importation de la configuration de la connexion à la BDD
const helper = require("../helpers/backend.js"); // Helper permettant de ne pas répéter les requêtes

const errorCode = "500";
const errorMessage = "Une erreur s'est produite, veuillez réessayer";

exports.getAllArticles = (req, res, _next) => {
  // Récupération de tous les articles présents dans la BDD
  let sql = `SELECT articles.articleId, articles.userId, articles.articleTitle, articles.articleCover, articles.articleContent, articles.creationDate, articles.modificationDate, users.username, users.roleId FROM articles INNER JOIN users ON articles.userId = users.userId ORDER BY creationDate DESC`;

  helper.data.sqlRequest(sql, res, errorCode, errorMessage);
};

exports.getOneArticle = (req, res, next) => {
  // Récupération d'un article en particulier grâce à son ID et récupération de l'ID de l'auteur
  let sql = `SELECT * FROM articles INNER JOIN users ON articles.userId = users.userId WHERE articleId=?; `;
  let articleId = req.params.articleId;

  helper.data.sqlRequestWithParameters(
    sql,
    res,
    articleId,
    errorCode,
    errorMessage
  );
};

exports.getArticlesFromUser = (req, res, next) => {
  // Récupération de tous les articles d'un utilisateur présents dans la BDD
  let sql = `SELECT * FROM articles INNER JOIN users ON articles.userId = users.userId WHERE users.userId=? ORDER BY creationDate DESC`;
  let articleId = req.params.articleId;

  helper.data.sqlRequestWithParameters(
    sql,
    res,
    articleId,
    errorCode,
    errorMessage
  );
};

exports.createArticle = (req, res, next) => {
  // Création d'un article en envoyant les informations requises à la BDD comme le titre, le contenu et l'auteur
  let articleTitle = req.body.articleTitle;
  let articleContent = req.body.articleContent;
  let userId = req.body.userId;
  // console.log("Article Title " + articleTitle)
  // console.log("Article Content " + articleContent)
  // console.log("Article creator " + userId)
  let sql = `INSERT INTO articles (articleTitle, articleContent, userId, creationDate ) VALUES (?,?,?,CURRENT_TIMESTAMP)`;

  db.query(sql, [articleTitle, articleContent, userId], (err, result) => {
    if (err) throw err;
    res.status(201).json({ message: "Article créé!" });
  });
};

exports.modifyArticle = (req, res, next) => {
  // Modification d'un article en le séléctionnant par son ID
  let articleId = req.params.articleId;
  let articleTitle = req.body.articleTitle;
  let articleContent = req.body.articleContent;
  let sql = `UPDATE articles SET articleContent= ?, articleTitle= ?, modificationDate=CURRENT_TIMESTAMP WHERE articleId= ?`;

  helper.data.sqlRequestWithParameters(
    sql,
    res,
    [articleContent, articleTitle, articleId],
    errorCode,
    errorMessage
  );
};

exports.deleteArticle = (req, res, next) => {
  // Suppression d'un article
  let articleId = req.params.articleId;
  let sql = `DELETE FROM articles WHERE articleId= ?`;

  helper.data.sqlRequestWithParameters(
    sql,
    res,
    articleId,
    errorCode,
    errorMessage
  );
};
