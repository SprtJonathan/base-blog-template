const db = require("../config/config"); // Importation de la configuration de la connexion à la BDD
const helper = require("../helpers/backend.js"); // Helper permettant de ne pas répéter les requêtes

const errorCode = "500";
const errorMessage = "Une erreur s'est produite, veuillez réessayer";

exports.getAllArticles = (req, res, _next) => {
  // Récupération de tous les posts présents dans la BDD
  let sql = `SELECT posts.postId, posts.userId, posts.title, posts.content, posts.creationDate, posts.modificationDate, users.username, users.roleId FROM posts INNER JOIN users ON posts.userId = users.userId ORDER BY creationDate DESC`;

  helper.data.sqlRequest(sql, res, errorCode, errorMessage);
};

exports.getOneArticle = (req, res, next) => {
  // Récupération d'un post en particulier grâce à son ID et récupération de l'ID de l'auteur
  let sql = `SELECT * FROM posts INNER JOIN users ON posts.userId = users.userId WHERE postId=?; `;
  let id = req.params.id;

  helper.data.sqlRequestWithParameters(sql, res, id, errorCode, errorMessage);
};

exports.getArticlesFromUser = (req, res, next) => {
  // Récupération de tous les posts d'un utilisateur présents dans la BDD
  let sql = `SELECT * FROM posts INNER JOIN users ON posts.userId = users.userId WHERE users.userId=? ORDER BY creationDate DESC`;
  let id = req.params.id;

  helper.data.sqlRequestWithParameters(sql, res, id, errorCode, errorMessage);
};

exports.createArticle = (req, res, next) => {
  // Création d'un post en envoyant les informations requises à la BDD comme le titre, le contenu et l'auteur
  let title = req.body.title;
  let content = req.body.content;
  let userId = req.body.userId;
  // console.log("Post Title " + title)
  // console.log("Post Content " + content)
  // console.log("Post creator " + userId)
  let sql = `INSERT INTO posts (title, content, userId, creationDate ) VALUES (?,?,?,CURRENT_TIMESTAMP)`;

  db.query(sql, [title, content, userId], (err, result) => {
    if (err) throw err;
    res.status(201).json({ message: "Post créé!" });
  });
};

exports.modifyArticle = (req, res, next) => {
  // Modification d'un post en le séléctionnant par son ID
  let postId = req.params.id;
  let title = req.body.title;
  let content = req.body.content;
  let sql = `UPDATE posts SET content= ?, title= ?, modificationDate=CURRENT_TIMESTAMP WHERE postId= ?`;

  helper.data.sqlRequestWithParameters(
    sql,
    res,
    [content, title, postId],
    errorCode,
    errorMessage
  );
};

exports.deleteArticle = (req, res, next) => {
  // Suppression d'un post
  let postId = req.params.id;
  let sql = `DELETE FROM posts WHERE postId= ?`;

  helper.data.sqlRequestWithParameters(
    sql,
    res,
    postId,
    errorCode,
    errorMessage
  );
};
