const multer = require("multer");

const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/svg": "svg",
  "image/gif": "gif",
}; // Extensions de fichiers reconnues par multer

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images/userProfilePictures/uploads");
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(" ").join("_"); // Récupération du fichier et renommage en supprimant les espaces
    const extension = MIME_TYPES[file.mimetype]; // ajout de l'extension selon le type de fichier reçu
    callback(null, name + Date.now() + "." + extension);
  },
});

const limits = { fileSize: 409600 }; // Limite de taille pour l'envoi des fichiers

module.exports = multer({ storage: storage, limiter: limits }).single("image"); // Exportation
