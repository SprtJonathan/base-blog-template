const mysql = require("mysql"); // Package permettant de se connecter à la base de données mysql
const db = require("../config/config"); // Importation de la configuration de la connexion à la BDD

let backendHelper = {
  findUser: function (req, res, next, id) {
    // Recherche d'un utilisateur
    let sql = `SELECT * FROM users WHERE userId = ?`;
    sql = mysql.format(sql, [id]);
    //console.log("Token : " + token);
    //console.log(decodedToken);
    console.log("User ID : " + id);
    db.query(sql, (err, result) => {
      if (err) throw err;
      res.send(result[0]);
      //console.log(result);
    });
  },

  sqlRequest: function (sql, res, errorCode, errorMessage) {
    // Requête sql commune
    db.query(sql, (error, result) => {
      if (error) {
        console.log("erreur" + error);
        return res.status(errorCode).json({ error: errorMessage });
      } else {
        res.send(result);
      }
    });
  },

  sqlRequestWithParameters: function (
    sql,
    res,
    param,
    errorCode,
    errorMessage
  ) {
    // Requête sql commune incluant un paramètre
    db.query(sql, param, (error, result) => {
      if (error) {
        console.log("erreur" + error);
        return res.status(errorCode).json({ error: errorMessage });
      } else {
        res.send(result);
      }
    });
  },
};

exports.data = backendHelper;
