const db = require("../config/config"); // Importation de la configuration de la connexion à la BDD
const helper = require("../helpers/backend.js"); // Helper permettant de ne pas répéter les requêtes

const errorCode = "500"; // Code d'erreur interne
const errorMessage = "Une erreur s'est produite, veuillez réessayer";

exports.getAllComments = (req, res, _next) => {
  // Middleware permettant de récupérer tous les commentaires stockés dans la base de données
  let sql = `SELECT * FROM comments ORDER BY writtenOn DESC`; // On récupère les commentaires contenus dans la table comments et on les ordonne par ordre de date décroissante (le plus récent d'abord)

  helper.data.sqlRequest(sql, res, errorCode, errorMessage); // Exécution de la requête mySQL via l'utilisation du helper dédié
};

exports.getOnePostComments = (req, res, _next) => {
  // Récupération des commentaires d'un post
  let sql = `SELECT comments.commentId, comments.postId, comments.comment, comments.userId, comments.writtenOn, comments.lastUpdated, users.username, users.roleId FROM comments INNER JOIN users ON comments.userId = users.userId WHERE postId=?`;
  let postId = req.params.id;

  helper.data.sqlRequestWithParameters(
    sql,
    res,
    postId,
    errorCode,
    errorMessage
  );
};

exports.getOneComment = (req, res, _next) => {
  // Récupération d'un commentaire spécifique ainsi que de ses informations (dont son auteur)
  let sql = `SELECT * FROM comments INNER JOIN users ON comments.userId = users.userId WHERE commentId=?;`;
  let postId = req.params.id;

  helper.data.sqlRequestWithParameters(
    sql,
    res,
    postId,
    errorCode,
    errorMessage
  );
};

exports.createComment = (req, res, _next) => {
  // Création d'un commentaire
  let postId = req.body.postId;
  let comment = req.body.comment;
  let userId = req.body.userId; // Récupération des informations du commentaire : A quel post il répond, quel est son contenu et qui en est l'auteur
  let sql = `INSERT INTO comments ( postId, comment, userId, writtenOn, lastUpdated ) VALUES (?,?,?,NOW(),NOW());`; // Commende SQL permettant d'ajouter le nouveau commentaire à la BDD

  db.query(sql, [postId, comment, userId], (err, result) => {
    if (err) throw err;
    res.status(201).json({ message: "Commentaire posté !" });
  });
};

exports.modifyComment = (req, res, _next) => {
  // Modification d'un commentaire
  let id = req.params.id;
  let comment = req.body.comment;
  let sql = `UPDATE comments SET comment=?, lastUpdated=CURRENT_TIMESTAMP WHERE commentId=?;`;

  helper.data.sqlRequestWithParameters(
    sql,
    res,
    [comment, id],
    errorCode,
    errorMessage
  );
};

exports.deleteComment = (req, res, _next) => {
  // Suppression d'un commentaire à partir de son ID
  let id = req.params.id;
  let sql = `DELETE FROM comments WHERE commentId= ?;`;

  helper.data.sqlRequestWithParameters(sql, res, id, errorCode, errorMessage);
};
