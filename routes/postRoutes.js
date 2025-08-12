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
 *   description: Endpoints para gestión de publicaciones, likes y búsquedas
 */

/**
 * @swagger
 * /api/posts:
 *   get:
 *     summary: Obtener todas las publicaciones
 *     description: "Retorna una lista paginada de todas las publicaciones ordenadas por fecha de creación"
 *     tags: [Publicaciones]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Número de publicaciones por página
 *     responses:
 *       200:
 *         description: Lista de publicaciones obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Post'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     pages:
 *                       type: integer
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   post:
 *     summary: Crear una nueva publicación
 *     description: "Crea una nueva publicación (requiere autenticación JWT)"
 *     tags: [Publicaciones]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *                 maxLength: 100
 *                 description: Título de la publicación
 *                 example: "Mi primera publicación"
 *               content:
 *                 type: string
 *                 description: Contenido de la publicación
 *                 example: "Este es el contenido de mi publicación..."
 *               imageUrl:
 *                 type: string
 *                 format: uri
 *                 description: URL de la imagen (opcional)
 *                 example: "https://example.com/image.jpg"
 *     responses:
 *       201:
 *         description: Publicación creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Publicación creada exitosamente"
 *                 data:
 *                   $ref: '#/components/schemas/Post'
 *       400:
 *         description: Datos de entrada inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: No autorizado - Token JWT requerido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/posts/{key}/{value}:
 *   get:
 *     summary: Buscar publicación por campo dinámico
 *     description: "Busca publicaciones por cualquier campo del modelo (ej: _id, title, user, etc.)"
 *     tags: [Publicaciones]
 *     parameters:
 *       - in: path
 *         name: key
 *         required: true
 *         schema:
 *           type: string
 *         description: Campo por el cual buscar
 *         example: "_id"
 *       - in: path
 *         name: value
 *         required: true
 *         schema:
 *           type: string
 *         description: Valor a buscar
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Publicación encontrada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Post'
 *       404:
 *         description: Publicación no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   delete:
 *     summary: Eliminar publicación por campo dinámico
 *     description: "Elimina una publicación por cualquier campo (requiere autenticación JWT)"
 *     tags: [Publicaciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: key
 *         required: true
 *         schema:
 *           type: string
 *         description: Campo por el cual buscar
 *         example: "_id"
 *       - in: path
 *         name: value
 *         required: true
 *         schema:
 *           type: string
 *         description: Valor a buscar
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Publicación eliminada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Publicación eliminada exitosamente"
 *       401:
 *         description: No autorizado - Token JWT requerido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Publicación no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   put:
 *     summary: Modificar publicación por campo dinámico
 *     description: "Modifica una publicación por cualquier campo (requiere autenticación JWT)"
 *     tags: [Publicaciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: key
 *         required: true
 *         schema:
 *           type: string
 *         description: Campo por el cual buscar
 *         example: "_id"
 *       - in: path
 *         name: value
 *         required: true
 *         schema:
 *           type: string
 *         description: Valor a buscar
 *         example: "507f1f77bcf86cd799439011"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 maxLength: 100
 *                 description: Nuevo título de la publicación
 *                 example: "Título actualizado"
 *               content:
 *                 type: string
 *                 description: Nuevo contenido de la publicación
 *                 example: "Contenido actualizado..."
 *               imageUrl:
 *                 type: string
 *                 format: uri
 *                 description: Nueva URL de la imagen
 *                 example: "https://example.com/new-image.jpg"
 *     responses:
 *       200:
 *         description: Publicación modificada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Publicación modificada exitosamente"
 *                 data:
 *                   $ref: '#/components/schemas/Post'
 *       401:
 *         description: No autorizado - Token JWT requerido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Publicación no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/posts/like/{postId}:
 *   post:
 *     summary: Dar o quitar "Me gusta" a una publicación
 *     description: "Alterna el estado de 'Me gusta' de una publicación (requiere autenticación JWT)"
 *     tags: [Publicaciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la publicación
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Estado de "Me gusta" actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "¡Me gusta agregado!"
 *                 likes:
 *                   type: integer
 *                   description: Número total de likes
 *                   example: 5
 *                 liked:
 *                   type: boolean
 *                   description: Indica si el usuario actual dio like
 *                   example: true
 *       401:
 *         description: No autorizado - Token JWT requerido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Publicación no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
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

    const userId = req.user._id;
    const alreadyLiked = post.likes.includes(userId);

    if (alreadyLiked) {
      post.likes = post.likes.filter(id => id.toString() !== userId.toString());
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