const express = require('express');
const router = express.Router();
const {
  getCommentsByPost,
  addComment,
  updateComment,
  deleteComment
} = require('../controllers/commentController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Obtener comentarios de una publicación y agregar un comentario
router.route('/posts/:postId/comments')
  .get(getCommentsByPost) // Todos pueden ver los comentarios de un post
  .post(protect, addComment); // Solo usuarios autenticados pueden comentar

// Actualizar y eliminar comentarios específicos
router.route('/:id')
  .put(protect, updateComment) // Solo el propietario o admin
  .delete(protect, deleteComment); // Solo el propietario o admin (o dueño del post)

module.exports = router;