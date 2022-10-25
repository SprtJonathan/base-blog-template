// Route pour les commentaires
const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const commentsCtrl = require('../controllers/comment.js');

router.get('/:id', commentsCtrl.getOnePostComments); // Récupération des commentaires d'un article
router.post('/', auth, commentsCtrl.createComment); // Création d'un commentaire
router.put('/:id', auth, commentsCtrl.modifyComment); // Modification d'un commentaire
router.delete('/:id', auth, commentsCtrl.deleteComment); // Suppression d'un commentaire
router.get('/comment/:id', commentsCtrl.getOneComment); // Récupération d'un commentaire
router.get('/', commentsCtrl.getAllComments); // Récupération de tous les commentaires



module.exports = router;