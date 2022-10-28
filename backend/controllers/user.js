const bcrypt = require("bcrypt"); // Package permettant de chiffrer les mots de passes
const jwt = require("jsonwebtoken"); // JSON Web Token : Jeton d'authentification utilisé afin de ne pas redemander la connexion à chaque requête
const mysql = require("mysql"); // Package permettant de se connecter à la base de données mysql
const helper = require("../helpers/backend.js"); // Helper permettant de ne pas répéter certaines requêtes

const validator = require("validator"); // Le validateur permet de vérifier que le format d'email entré est correct
const db = require("../config/config"); // Importation de la configuration de la connexion à la BDD

const fs = require("fs"); // Import de fs qui permet d'accéder au file-system (pour l'enregistrement d'images)

exports.register = (req, res, next) => {
  // Middleware pour l'inscription
  const username = req.body.username;
  const fname = req.body.fname;
  const lname = req.body.lname;
  const email = req.body.email;
  const password = req.body.password;
  const profilePicture = `${req.protocol}://${req.get(
    "host"
  )}/images/userProfilePictures/default.svg`; // Photo de profil par défaut se trouvant dans le répertoire images du backend
  if (
    username == null ||
    email == null ||
    fname == null ||
    lname == null ||
    password == null ||
    username == "" ||
    email == "" ||
    fname == "" ||
    lname == "" ||
    password == ""
  ) {
    // Vérification que chaque champ soit rempli
    return res.status(400).json({ error: "Champs vides" });
  } else {
    bcrypt
      .hash(password, 10) // Salage du mot de passe 10 fois
      .then((hash) => {
        if (validator.isEmail(req.body.email)) {
          // Si la forme de l'email est correcte, alors on crée le nouvel utilisateur
          let sql =
            "INSERT INTO users (username, fname, lname, email, password, profilePictureUrl) VALUES (?, ?, ?, ?, ?, ?)"; // Commande mySQL à éxecuter
          let inserts = [username, fname, lname, email, hash, profilePicture]; // Valeurs à insérer dans la base de données
          sql = mysql.format(sql, inserts);
          db.query(sql, (error, result) => {
            // Envoi des données à la BDD
            if (!error) {
              // Si aucune erreur n'est retournée
              res.status(201).json({
                message: "L'utilisateur a été créé avec succès !", // Alors, on renvoie un message de confirmation
              });
            } else {
              // Sinon on renvoie une erreur
              console.log(error);
              return res
                .status(409)
                .json({ error: "Erreur: Cet utilisateur existe déjà !" }); // Erreur: utilisateur déjà existant
            }
          });
        } else {
          return res.status(400).json({ error: "Format email incorrect" }); // Si l'email est incorrect alors on retourne un erreur.
        }
      })

      .catch((error) =>
        res
          .status(500)
          .json({
            error:
              "Une erreur s'est produite, veuillez réessayer ultérieurement",
          })
      ); // Si une erreur est retournée, elle provient du serveur, alors on renvoie un code 500
  }
};

exports.login = (req, res, next) => {
  // Middleware pour la connexion
  const credentials = req.body.credentials;
  const password = req.body.password;
  let sql = `SELECT * FROM users WHERE email = ?`;
  if (validator.isEmail(credentials)) {
    // Si l'identifiant de l'utilisateur est un mail, alors on utilisera la commande SQL suivante
    sql = `SELECT * FROM users WHERE email = ?`;
  } else {
    // Sinon on utilisera la commande SQL suivante
    sql = `SELECT * FROM users WHERE username = ?`;
  }
  sql = mysql.format(sql, [credentials]);

  db.query(sql, (err, result) => {
    if (err) throw err;
    if (result.length > 0) {
      bcrypt
        .compare(password, result[0].password) // On compare le hash du mot de passe entré avec celui enregistré dans la base de données
        .then((valid) => {
          if (!valid) {
            // Si il ne correspond pas au mot de passe de l'utilisateur, on retourne une erreur
            console.log("Utilisateur introuvable");
            return res
              .status(401)
              .json({ error: "Nom d'utilisateur ou mot de passe incorrect" });
          } else {
            // Sinon l'utilsateur se connecte
            console.log("User connected");
            res.status(200).json({
              user: {
                // On renvoie un objet avec les informations de l'utilisateur
                userId: result[0].userId,
                username: result[0].username,
                fname: result[0].fname,
                lname: result[0].lname,
                email: result[0].email,
                profilePictureUrl: result[0].profilePictureUrl,
                roleId: result[0].roleId,
              },
              token: jwt.sign(
                {
                  // On signe égalment le token qui permettra à l'utilisateur de naviguer sur le site
                  userId: result[0].userId,
                  roleId: result[0].roleId,
                },
                process.env.JWT_TOKEN,
                { expiresIn: process.env.JWT_EXPIRATION }
              ),
            });
          }
        })
        .catch((error) => res.status(500).json({ error }));
    } else {
      console.log("user not found");
      return res
        .status(401)
        .json({ error: "Nom d'utilisateur ou mot de passe incorrect !" });
    }
  });
};

exports.getOneUser = (req, res, next) => {
  // Middleware permettant la récupération des infos d'un utilisateur d'après son ID
  const userId = req.params.id;
  helper.data.findUser(req, res, next, userId);
};

exports.getAllUsers = (req, res, next) => {
  // Récupération de tous les utilisateurs stockés dans la BDD
  let sql = `SELECT * FROM users`;
  helper.data.sqlRequest(sql, res);
};

exports.deleteAccount = (req, res, next) => {
  // Middleware pour la suppression du compte
  const errorCode = "400";
  const errorMessage = "Une erreur s'est produite, veuillez réessayer";
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, process.env.JWT_TOKEN);
  const userId = decodedToken.userId;
  const roleId = decodedToken.roleId;
  const userProfileId = req.params.id;
  if (roleId == 2 || userId == userProfileId) {
    // Si l'utilisateur est admin ou que l'ID du profil est le même que celui de l'utilisateur authentifié
    let sql = `DELETE FROM users WHERE userId = ?`; // On effectue la commande de suppression de l'utilisateur grâce à son ID
    sql = mysql.format(sql, [userProfileId]);
    let selectUser = `SELECT profilePictureUrl FROM users WHERE userId = ?`; // On supprime également la photo de profil de l'utilisateur
    selectUser = mysql.format(selectUser, [userProfileId]);
    db.query(selectUser, (error, result) => {
      if (error) throw error;
      const profilePicture = result[0].profilePictureUrl;
      console.log(
        "profil à supprimer : " +
          userProfileId +
          "et utilisateur voulant supprimer : " +
          userId +
          " admin? " +
          roleId
      );
      if (
        profilePicture !=
        `${req.protocol}://${req.get(
          "host"
        )}/images/userProfilePictures/default.png`
      ) {
        // Si la photo de profil est différente de la photo par défaut
        const filename = result[0].profilePictureUrl.split(
          "/images/userProfilePictures/uploads/"
        )[1]; // On récupère le nom du fichier de la photo
        console.log("Nom du fichier: " + filename);
        fs.unlink(`images/userProfilePictures/uploads/${filename}`, () => {
          // On supprime la photo
          console.log("userFound " + userProfileId);
          helper.data.sqlRequest(sql, res, errorCode, errorMessage); // Puis on supprime l'utilisateur
        });
      } else {
        console.log("User has default image");
        helper.data.sqlRequest(sql, res, errorCode, errorMessage); // On supprime l'utilisateur
      }
    });
  }
};

exports.editProfilePicture = (req, res, next) => {
  // Modification de la photo de profil
  const errorCode = "409";
  const errorMessage = "Cet utilisateur existe déjà";
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, process.env.JWT_TOKEN);
  const roleId = decodedToken.roleId;
  const userId = decodedToken.userId;
  const userToEdit = req.params.id;
  const profilePicture = `${req.protocol}://${req.get(
    "host"
  )}/images/userProfilePictures/uploads/${req.file.filename}`;
  const userProfileId = req.params.id;

  if (roleId == 2 || userToEdit == userId) {
    // Si l'utilisateur est admin ou que l'ID du profil est le même que celui de l'utilisateur authentifié
    if (
      profilePicture !=
      `${req.protocol}://${req.get(
        "host"
      )}/images/userProfilePictures/default.png`
    ) {
      // Si la photo de profil n'est pas celle par défaut
      let selectUser = `SELECT profilePictureUrl FROM users WHERE userId = ?`; // On récupère le nom de la photo de profil
      selectUser = mysql.format(selectUser, [userToEdit]);
      db.query(selectUser, (error, result) => {
        if (error) throw error;
        console.log(result[0].profilePictureUrl);
        const filename = result[0].profilePictureUrl.split(
          "/images/userProfilePictures/uploads/"
        )[1];
        console.log("Nom du fichier: " + filename);
        fs.unlink(`images/userProfilePictures/uploads/${filename}`, () => {
          // On supprime l'ancienne photo de profil
          let sql = `UPDATE users SET profilePictureUrl = ?, lastUpdated = CURRENT_TIMESTAMP WHERE userId = ?;`; // On assigne le nom de fichier de la nouvelle photo de profil
          sql = mysql.format(sql, [profilePicture, userToEdit]);
          //console.log(profilePicture)
          //console.log("profil à éditer : " + userToEdit + "et utilisateur voulant éditer : " + userId + " image? " + profilePicture)
          helper.data.sqlRequest(sql, res, errorCode, errorMessage);
        });
      });
    } else {
      console.log("User has default image"); // Si l'image est par défaut
      let sql = `UPDATE users SET profilePictureUrl = ?, lastUpdated = CURRENT_TIMESTAMP WHERE userId = ?;`; // On met simlement à jour le nom du fichier
      sql = mysql.format(sql, [profilePicture, userToEdit]);
      helper.data.sqlRequest(sql, res, errorCode, errorMessage);
    }
  }
};

exports.editAccount = (req, res, next) => {
  // Middleware pour la modification du compte
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, process.env.JWT_TOKEN);
  const userId = decodedToken.userId;
  const username = req.body.username;
  const fname = req.body.fname;
  const lname = req.body.lname;
  const email = req.body.email;
  const password = req.body.password;
  const newPassword = req.body.newPassword;
  if (
    username == null ||
    email == null ||
    fname == null ||
    lname == null ||
    password == null ||
    username == "" ||
    email == "" ||
    fname == "" ||
    lname == "" ||
    password == ""
  ) {
    // Vérification que chaque champ soit rempli
    return res.status(400).json({ error: "Champs vides" });
  } else {
    let savedHash = `SELECT * FROM users WHERE userId = ?`;
    savedHash = mysql.format(savedHash, [userId]);
    console.log("userFound " + userId);
    db.query(savedHash, (err, pass) => {
      bcrypt
        .compare(password, pass[0].password) // On compare le mot de passe avec celui déjà enregistré
        .then((valid) => {
          console.log(pass);
          if (!valid) {
            console.log("User not found");
            return res.status(400).json({ error: "Mot de passe incorrect !" });
          } else {
            bcrypt // On enregistre le nouveau mot de passe
              .hash(newPassword, 10) // Salage du mot de passe 10 fois
              .then((hash) => {
                if (validator.isEmail(req.body.email)) {
                  let sql = `UPDATE users SET username = ?, fname = ?, lname = ?, email = ?, password = ?, lastUpdated = CURRENT_TIMESTAMP WHERE userId = ?;`;
                  sql = mysql.format(sql, [
                    username,
                    fname,
                    lname,
                    email,
                    hash,
                    userId,
                  ]);
                  console.log(
                    username +
                      " fname " +
                      fname +
                      " lname " +
                      lname +
                      " email " +
                      email +
                      " hash " +
                      hash +
                      " userid " +
                      userId
                  ); // On enregistre les nouvelles informations
                  db.query(sql, (err, result) => {
                    console.log(err);
                    console.log(result);
                    if (result) {
                      return res.status(200).json({
                        message: "Utilisateur modifié",
                      });
                    } else {
                      return res.status(409).json({
                        error: "Échec de la modification",
                      });
                    }
                  });
                } else {
                  return res
                    .status(400)
                    .json({ error: "Format email incorrect" });
                }
              });
          }
        });
    });
  }
};

exports.editAccountAdmin = (req, res, next) => {
  // Middleware pour la modification du compte par un admin
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, process.env.JWT_TOKEN);
  const roleId = decodedToken.roleId;
  const userId = decodedToken.userId;
  const userToEdit = req.params.id;
  const username = req.body.username;
  const fname = req.body.fname;
  const lname = req.body.lname;
  const email = req.body.email;
  console.log(
    "profil à éditer : " +
      userToEdit +
      "et utilisateur voulant éditer : " +
      userId +
      " admin? " +
      roleId
  );
  if (roleId == 2 || userToEdit == userId) {
    if (
      username == null ||
      email == null ||
      fname == null ||
      lname == null ||
      username == "" ||
      email == "" ||
      fname == "" ||
      lname == ""
    ) {
      // Vérification que chaque champ soit rempli
      return res.status(400).json({ error: "Champs vides" });
    } else {
      if (validator.isEmail(req.body.email)) {
        let sql = `UPDATE users SET username = ?, fname = ?, lname = ?, email = ?, lastUpdated = CURRENT_TIMESTAMP WHERE userId = ?;`;
        sql = mysql.format(sql, [username, fname, lname, email, userToEdit]);
        console.log(
          username +
            " fname " +
            fname +
            " lname " +
            lname +
            " email " +
            email +
            " userid " +
            userToEdit
        );
        db.query(sql, (err, result) => {
          console.log(err);
          console.log(result);
          if (result) {
            return res.status(200).json({
              message: "Utilisateur modifié",
            });
          } else {
            return res.status(409).json({
              error: "Échec de la modification",
            });
          }
        });
      } else {
        return res.status(400).json({ error: "Format email incorrect" });
      }
    }
  }
};
