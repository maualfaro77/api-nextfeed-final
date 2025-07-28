const express = require('express');
const router = express.Router();
const {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost
} = require('../controllers/postController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .get(getPosts)      // Todos pueden ver las publicaciones
  .post(protect, createPost); // Solo usuarios autenticados pueden crear

router.route('/:id')
  .get(getPostById) // Todos pueden ver una publicación específica
  .put(protect, updatePost) // Solo el propietario o admin puede actualizar
  .delete(protect, deletePost); // Solo el propietario o admin puede eliminar

module.exports = router;