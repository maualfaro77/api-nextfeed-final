const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Necesitamos el modelo de usuario
const { protect } = require('../middleware/authMiddleware'); // Necesitamos protect para esta ruta

// @desc    Obtener información del perfil del usuario autenticado
// @route   GET /api/profile
// @access  Private (Necesita JWT)
router.get('/', protect, async (req, res) => {
  try {
    // req.user ya está disponible desde el middleware 'protect'
    // Excluir la contraseña por seguridad
    const userProfile = await User.findById(req.user._id).select('-password -role');

    if (!userProfile) {
      return res.status(404).json({ message: 'Perfil de usuario no encontrado.' });
    }
    res.status(200).json({ message: 'Perfil obtenido exitosamente', user: userProfile });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor al obtener el perfil.' });
  }
});

// @desc    Actualizar información del perfil del usuario autenticado
// @route   PUT /api/profile
// @access  Private (Necesita JWT)
router.put('/', protect, async (req, res) => {
  const { username } = req.body; // Puedes añadir más campos aquí

  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'Perfil de usuario no encontrado.' });
    }

    if (username) {
      // Verificar si el nuevo username ya existe (excepto si es el propio usuario)
      const existingUser = await User.findOne({ username });
      if (existingUser && existingUser._id.toString() !== user._id.toString()) {
        return res.status(400).json({ message: 'Ese nombre de usuario ya está en uso.' });
      }
      user.username = username;
    }
    // Si quisieras permitir cambiar la contraseña, necesitarías lógica similar a la de registro
    // if (newPassword) { user.password = newPassword; await user.save(); } // El pre-save hook hasheará la contraseña

    const updatedUser = await user.save();
    res.status(200).json({
      message: 'Perfil actualizado exitosamente',
      user: {
        id: updatedUser._id,
        username: updatedUser.username,
        role: updatedUser.role
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor al actualizar el perfil.' });
  }
});


module.exports = router;