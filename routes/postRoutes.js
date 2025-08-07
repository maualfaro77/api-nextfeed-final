const express = require('express');
const router = express.Router();
const {
  buscarTodo,
  agregarPost,
  buscarPost,
  mostrarPost,
  eliminarPost,
  modificarPost
} = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');
const Post = require('../models/Post');

// Obtener todas las publicaciones
router.get('/', buscarTodo);

// Agregar una publicación
router.post('/', protect, agregarPost);

// Buscar publicación por campo dinámico
router.get('/:key/:value', buscarPost, mostrarPost);

// Eliminar publicación por campo dinámico
router.delete('/:key/:value', protect, buscarPost, eliminarPost);

// Modificar publicación por campo dinámico
router.put('/:key/:value', protect, buscarPost, modificarPost);

router.post('/like/:postId', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ mensaje: 'Publicación no encontrada' });

    const userId = req.user.id;
    const alreadyLiked = post.likes.includes(userId);

    if (alreadyLiked) {
      post.likes = post.likes.filter(id => id.toString() !== userId);
      await post.save();
      return res.json({ mensaje: 'Me gusta quitado', likes: post.likes.length, liked: false });
    } else {
      post.likes.push(userId);
      await post.save();
      return res.json({ mensaje: '¡Me gusta agregado!', likes: post.likes.length, liked: true });
    }
  } catch (e) {
    res.status(500).json({ mensaje: 'Error al dar/quitar me gusta', error: e });
  }
});

module.exports = router;