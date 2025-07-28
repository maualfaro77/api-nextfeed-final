const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Función para generar JWT
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '1h' // El token expira en 1 hora
  });
};

// @desc    Registrar nuevo usuario
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  const { username, password, role } = req.body;

  // Validaciones básicas
  if (!username || !password) {
    return res.status(400).json({ message: 'Por favor, ingrese un nombre de usuario y una contraseña.' });
  }

  try {
    let user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ message: 'El nombre de usuario ya existe.' });
    }

    user = await User.create({
      username,
      password,
      role: role || 'user' // Si no se especifica, por defecto es 'user'
    });

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      user: {
        id: user._id,
        username: user.username,
        role: user.role
      },
      token
    });
  } catch (error) {
    console.error(error);
    if (error.code === 11000) { // Error de clave duplicada (para username único)
      return res.status(400).json({ message: 'El nombre de usuario ya está en uso.' });
    }
    res.status(500).json({ message: 'Error en el servidor al registrar usuario.' });
  }
};

// @desc    Iniciar sesión de usuario
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  const { username, password } = req.body;

  // Validaciones básicas
  if (!username || !password) {
    return res.status(400).json({ message: 'Por favor, ingrese un nombre de usuario y una contraseña.' });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas.' }); // Usar 401 para credenciales inválidas
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciales inválidas.' });
    }

    const token = generateToken(user._id, user.role);

    res.status(200).json({
      message: 'Inicio de sesión exitoso',
      user: {
        id: user._id,
        username: user.username,
        role: user.role
      },
      token
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor al iniciar sesión.' });
  }
};