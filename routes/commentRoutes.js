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
 *   description: Endpoints para gestión de comentarios en publicaciones
 */

/**
 * @swagger
 * /api/comments:
 *   get:
 *     summary: Obtener todos los comentarios
 *     description: Retorna una lista de todos los comentarios en el sistema
 *     tags: [Comentarios]
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
 *           default: 20
 *         description: Número de comentarios por página
 *     responses:
 *       200:
 *         description: Lista de comentarios obtenida exitosamente
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
 *                     $ref: '#/components/schemas/Comment'
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
 *     summary: Crear un nuevo comentario
 *     description: Crea un nuevo comentario en una publicación (requiere autenticación JWT)
 *     tags: [Comentarios]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *               - post
 *             properties:
 *               content:
 *                 type: string
 *                 maxLength: 500
 *                 description: Contenido del comentario
 *                 example: "¡Excelente publicación! Me gustó mucho."
 *               post:
 *                 type: string
 *                 description: ID de la publicación donde se creará el comentario
 *                 example: "507f1f77bcf86cd799439011"
 *     responses:
 *       201:
 *         description: Comentario creado exitosamente
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
 *                   example: "Comentario creado exitosamente"
 *                 data:
 *                   $ref: '#/components/schemas/Comment'
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
 * /api/comments/{key}/{value}:
 *   get:
 *     summary: Buscar comentario por campo dinámico
 *     description: Busca comentarios por cualquier campo del modelo (ej _id, user, post, etc.)
 *     tags: [Comentarios]
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
 *         description: Comentario encontrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Comment'
 *       404:
 *         description: Comentario no encontrado
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
 *     summary: Eliminar comentario por campo dinámico
 *     description: Elimina un comentario por cualquier campo
 *     tags: [Comentarios]
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
 *         description: Comentario eliminado exitosamente
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
 *                   example: "Comentario eliminado exitosamente"
 *       404:
 *         description: Comentario no encontrado
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
 *     summary: Modificar comentario por campo dinámico
 *     description: Modifica un comentario por cualquier campo
 *     tags: [Comentarios]
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
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 maxLength: 500
 *                 description: Nuevo contenido del comentario
 *                 example: "Contenido actualizado del comentario"
 *     responses:
 *       200:
 *         description: Comentario modificado exitosamente
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
 *                   example: "Comentario modificado exitosamente"
 *                 data:
 *                   $ref: '#/components/schemas/Comment'
 *       404:
 *         description: Comentario no encontrado
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
 * /api/comments/post/{value}:
 *   get:
 *     summary: Obtener comentarios de una publicación específica
 *     description: Obtener comentarios de una publicación específica
 *     tags: [Comentarios]
 *     parameters:
 *       - in: path
 *         name: value
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la publicación
 *         example: "507f1f77bcf86cd799439011"
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
 *         description: Número de comentarios por página
 *     responses:
 *       200:
 *         description: Lista de comentarios de la publicación obtenida exitosamente
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
 *                     $ref: '#/components/schemas/Comment'
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