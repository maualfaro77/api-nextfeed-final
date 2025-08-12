const express = require('express');
const router = express.Router();
const {
  buscarTodo,
  agregarPerfil,
  buscarPerfil,
  mostrarPerfil,
  eliminarPerfil,
  modificarPerfil
} = require('../controllers/profileController');
const { protect } = require('../middleware/authMiddleware');
const Post = require('../models/Post');
const User = require('../models/User');

/**
 * @swagger
 * tags:
 *   name: Perfiles
 *   description: Endpoints para gestión de perfiles de usuario, seguimiento y búsquedas
 */

/**
 * @swagger
 * /api/profile/id/{userId}:
 *   get:
 *     summary: Obtener perfil y publicaciones de un usuario específico
 *     description: Obtener perfil y publicaciones de un usuario específico
 *     tags: [Perfiles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario cuyo perfil se quiere obtener
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Perfil y publicaciones del usuario obtenidos exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 profile:
 *                   allOf:
 *                     - $ref: '#/components/schemas/User'
 *                     - type: object
 *                       properties:
 *                         followersCount:
 *                           type: integer
 *                           description: Número de seguidores
 *                           example: 150
 *                         followingCount:
 *                           type: integer
 *                           description: Número de usuarios que sigue
 *                           example: 75
 *                 posts:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Post'
 *                   description: Publicaciones del usuario
 *                 isFollowing:
 *                   type: boolean
 *                   description: Indica si el usuario actual sigue a este perfil
 *                   example: true
 *       401:
 *         description: No autorizado - Token JWT requerido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Usuario no encontrado
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
 * /api/profile:
 *   get:
 *     summary: Obtener perfil del usuario autenticado
 *     description: Obtiene la información del perfil del usuario que está autenticado (requiere autenticación JWT)
 *     tags: [Perfiles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Información del perfil obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/User'
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
 *   post:
 *     summary: Crear perfil de usuario
 *     description: Crear perfil de usuario
 *     tags: [Perfiles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 30
 *                 description: Nombre de usuario único
 *                 example: "johndoe"
 *               bio:
 *                 type: string
 *                 maxLength: 500
 *                 description: Biografía del usuario
 *                 example: "Desarrollador web apasionado por la tecnología"
 *               avatarUrl:
 *                 type: string
 *                 format: uri
 *                 description: URL del avatar del usuario
 *                 example: "https://example.com/avatar.jpg"
 *     responses:
 *       200:
 *         description: Perfil creado o actualizado exitosamente
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
 *                   example: "Perfil actualizado exitosamente"
 *                 data:
 *                   $ref: '#/components/schemas/User'
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
 *       409:
 *         description: Nombre de usuario ya existe
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
 * /api/profile/{key}/{value}:
 *   put:
 *     summary: Modificar perfil por campo dinámico
 *     description: Modifica un perfil por cualquier campo (requiere autenticación JWT)
 *     tags: [Perfiles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: key
 *         required: true
 *         schema:
 *           type: string
 *         description: Campo por el cual buscar
 *         example: "username"
 *       - in: path
 *         name: value
 *         required: true
 *         schema:
 *           type: string
 *         description: Valor a buscar
 *         example: "johndoe"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 30
 *                 description: Nuevo nombre de usuario
 *                 example: "johndoe_updated"
 *               bio:
 *                 type: string
 *                 maxLength: 500
 *                 description: Nueva biografía
 *                 example: "Nueva biografía actualizada"
 *               avatarUrl:
 *                 type: string
 *                 format: uri
 *                 description: Nueva URL del avatar
 *                 example: "https://example.com/new-avatar.jpg"
 *     responses:
 *       200:
 *         description: Perfil modificado exitosamente
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
 *                   example: "Perfil modificado exitosamente"
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: No autorizado - Token JWT requerido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Perfil no encontrado
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
 * /api/profile/follow/{userId}:
 *   post:
 *     summary: Seguir o dejar de seguir a un usuario
 *     description: Alterna el estado de seguimiento de un usuario (requiere autenticación JWT)
 *     tags: [Perfiles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario a seguir/dejar de seguir
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Estado de seguimiento actualizado exitosamente
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
 *                   example: "Ahora sigues a este usuario"
 *                 isFollowing:
 *                   type: boolean
 *                   description: Indica si el usuario actual sigue al usuario objetivo
 *                   example: true
 *                 followersCount:
 *                   type: integer
 *                   description: Número total de seguidores del usuario objetivo
 *                   example: 151
 *       400:
 *         description: No puedes seguirte a ti mismo
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
 *         description: Usuario a seguir no encontrado
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

router.get('/id/:userId', protect, async (req, res) => {
  try {
    const profile = await User.findById(req.params.userId)
      .select('-password -__v')
      .lean();
      
    if (!profile) {
      return res.status(404).json({ 
        success: false,
        mensaje: 'Perfil no encontrado' 
      });
    }

    const posts = await Post.find({ user: req.params.userId })
      .sort({ createdAt: -1 })
      .lean();

    // Verifica si el usuario actual sigue a este perfil
    const currentUser = await User.findById(req.user.id);
    const isFollowing = currentUser.following.includes(req.params.userId);

    res.json({ 
      success: true,
      profile: {
        ...profile,
        followersCount: profile.followers ? profile.followers.length : 0,
        followingCount: profile.following ? profile.following.length : 0
      },
      posts,
      isFollowing
    });
  } catch (e) {
    console.error('Error en /profile/id/:userId:', e);
    res.status(500).json({ 
      success: false,
      mensaje: 'Error al obtener perfil', 
      error: e.message 
    });
  }
});

// @desc    Seguir/Dejar de seguir a un usuario
// @route   POST /api/profile/follow/:userId
// @access  Private (Necesita JWT)
router.post('/follow/:userId', protect, async (req, res) => {
  try {
    const userId = req.user.id;
    const targetId = req.params.userId;
    
    if (userId === targetId) {
      return res.status(400).json({ 
        success: false,
        mensaje: 'No puedes seguirte a ti mismo' 
      });
    }

    const user = await User.findById(userId);
    const target = await User.findById(targetId);
    
    if (!target) {
      return res.status(404).json({ 
        success: false,
        mensaje: 'Usuario a seguir no encontrado' 
      });
    }

    const isFollowing = user.following.includes(targetId);
    
    if (isFollowing) {
      // Dejar de seguir
      user.following.pull(targetId);
      target.followers.pull(userId);
    } else {
      // Seguir
      user.following.push(targetId);
      target.followers.push(userId);
    }

    await Promise.all([user.save(), target.save()]);
    
    res.json({ 
      success: true,
      mensaje: isFollowing ? 'Has dejado de seguir a este usuario' : 'Ahora sigues a este usuario',
      isFollowing: !isFollowing,
      followersCount: target.followers.length
    });
  } catch (e) {
    console.error('Error al seguir/dejar de seguir usuario:', e);
    res.status(500).json({ 
      success: false,
      mensaje: 'Error al seguir usuario', 
      error: e.message 
    });
  }
});


// @desc    Obtener información del perfil del usuario autenticado
// @route   GET /api/profile
// @access  Private (Necesita JWT)
router.get('/', protect, buscarTodo);

// @desc    Agregar un perfil
// @route   POST /api/profile
// @access  Private (Necesita JWT)
router.post('/', protect, agregarPerfil);

// @desc    Buscar perfil por campo dinámico
// @route   GET /api/profile/:key/:value
// @access  Private (Necesita JWT)
router.get('/:key/:value', protect, buscarPerfil, mostrarPerfil);

// @desc    Eliminar perfil por campo dinámico
// @route   DELETE /api/profile/:key/:value
// @access  Private (Necesita JWT)
router.delete('/:key/:value', protect, buscarPerfil, eliminarPerfil);

// @desc    Modificar perfil por campo dinámico
// @route   PUT /api/profile/:key/:value
// @access  Private (Necesita JWT)
router.put('/:key/:value', protect, buscarPerfil, modificarPerfil);

// @desc    Obtener perfil y publicaciones por ID de usuario
// @route   GET /api/profile/id/:userId
// @access  Private (Necesita JWT)

module.exports = router;