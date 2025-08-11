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
 *   description: Endpoints para gestión de perfiles de usuario
 */

/**
 * @swagger
 * /api/profile/id/{userId}:
 *   get:
 *     summary: Obtener perfil por ID de usuario (requiere autenticación)
 *     tags: [Perfiles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Perfil y publicaciones del usuario
 */

/**
 * @swagger
 * /api/profile:
 *   get:
 *     summary: Obtener información del perfil del usuario autenticado (requiere autenticación)
 *     tags: [Perfiles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Información del perfil
 *   post:
 *     summary: Agregar un perfil (requiere autenticación)
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
 *               bio:
 *                 type: string
 *               avatarUrl:
 *                 type: string
 *     responses:
 *       200:
 *         description: Perfil agregado
 */

/**
 * @swagger
 * /api/profile/{key}/{value}:
 *   put:
 *     summary: Modificar perfil por campo dinámico (requiere autenticación)
 *     tags: [Perfiles]
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
 *               username:
 *                 type: string
 *               bio:
 *                 type: string
 *               avatarUrl:
 *                 type: string
 *     responses:
 *       200:
 *         description: Perfil modificado
 */

/**
 * @swagger
 * /api/profile/follow/{userId}:
 *   post:
 *     summary: Seguir/Dejar de seguir a un usuario (requiere autenticación)
 *     tags: [Perfiles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Estado de seguimiento actualizado
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