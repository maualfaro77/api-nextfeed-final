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

/**
 * @swagger
 * tags:
 *   name: Publicaciones
 *   description: Endpoints para gestión de publicaciones
 */

/**
 * @swagger
 * /api/posts:
 *   get:
 *     summary: Obtener todas las publicaciones
 *     tags: [Publicaciones]
 *     responses:
 *       200:
 *         description: Lista de publicaciones
 *   post:
 *     summary: Agregar publicación (requiere autenticación)
 *     tags: [Publicaciones]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               imageUrl:
 *                 type: string
 *     responses:
 *       200:
 *         description: Publicación agregada
 */

/**
 * @swagger
 * /api/posts/{key}/{value}:
 *   get:
 *     summary: Buscar publicación por campo dinámico
 *     tags: [Publicaciones]
 *     parameters:
 *       - in: path
 *         name: key
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: value
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Publicación encontrada
 *   delete:
 *     summary: Eliminar publicación por campo dinámico (requiere autenticación)
 *     tags: [Publicaciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: key
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: value
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Publicación eliminada
 *   put:
 *     summary: Modificar publicación por campo dinámico (requiere autenticación)
 *     tags: [Publicaciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: key
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: value
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               imageUrl:
 *                 type: string
 *     responses:
 *       200:
 *         description: Publicación modificada
 */

/**
 * @swagger
 * /api/posts/like/{postId}:
 *   post:
 *     summary: Dar/Quitar "Me gusta" a una publicación (requiere autenticación)
 *     tags: [Publicaciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Estado de "Me gusta" actualizado
 */

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