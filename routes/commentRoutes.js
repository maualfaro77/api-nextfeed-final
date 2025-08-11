const express = require('express');
const router = express.Router();
const {
  buscarTodo,
  agregarComment,
  buscarComment,
  mostrarComment,
  eliminarComment,
  modificarComment
} = require('../controllers/commentController');
const { protect } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Comentarios
 *   description: Endpoints para gestión de comentarios
 */

/**
 * @swagger
 * /api/comments:
 *   get:
 *     summary: Obtener todos los comentarios
 *     tags: [Comentarios]
 *     responses:
 *       200:
 *         description: Lista de comentarios
 *   post:
 *     summary: Agregar comentario (requiere autenticación)
 *     tags: [Comentarios]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *               post:
 *                 type: string
 *     responses:
 *       200:
 *         description: Comentario agregado
 */

/**
 * @swagger
 * /api/comments/{key}/{value}:
 *   get:
 *     summary: Buscar comentario por campo dinámico
 *     tags: [Comentarios]
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
 *         description: Comentario encontrado
 *   delete:
 *     summary: Eliminar comentario por campo dinámico
 *     tags: [Comentarios]
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
 *         description: Comentario eliminado
 *   put:
 *     summary: Modificar comentario por campo dinámico
 *     tags: [Comentarios]
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
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Comentario modificado
 */

/**
 * @swagger
 * /api/comments/post/{value}:
 *   get:
 *     summary: Obtener comentarios por ID de publicación
 *     tags: [Comentarios]
 *     parameters:
 *       - in: path
 *         name: value
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de comentarios por publicación
 */

// Obtener todos los comentarios
router.get('/', buscarTodo);

// Agregar un comentario
router.post('/', protect, agregarComment);

// Buscar comentario por campo dinámico
router.get('/:key/:value', buscarComment, mostrarComment);

// Eliminar comentario por campo dinámico
router.delete('/:key/:value', buscarComment, eliminarComment);

// Modificar comentario por campo dinámico
router.put('/:key/:value', buscarComment, modificarComment);

// Obtener comentarios por ID de publicación
router.get('/post/:value', buscarComment, mostrarComment);

module.exports = router;