const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_TOKEN);
    const userId = decodedToken.userId;
    if (req.body.userId && req.body.userId !== userId) {
      throw "ID utilisateur invalide"; // Authentification avec le JWT (jsonwebtoken)
    } else {
      next(); // Si l'authentification est fructueuse, alors on passe au middleware suivant
    }
  } catch (error) {
    res.status(401).json({ error: error | "Requête non authentifiée" }); // Si l'authentification échoue, alors on renvoie une erreur
  }
};
