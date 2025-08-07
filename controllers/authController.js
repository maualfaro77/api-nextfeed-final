const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Función mejorada para generar JWT
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user._id, 
      role: user.role,
      username: user.username,
      email: user.email
    }, 
    process.env.JWT_SECRET, 
    { expiresIn: '1d' }
  );
};

// @desc    Registrar nuevo usuario
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
    const { username, email, password } = req.body;
    
    // Validación mejorada
    if (!username || !email || !password) {
        return res.status(400).json({ 
            success: false,
            mensaje: 'Todos los campos son obligatorios' 
        });
    }

    try {
        // Verificar si el usuario o email ya existen
        const userExists = await User.findOne({ $or: [{ username }, { email }] });
        if (userExists) {
            return res.status(409).json({ 
                success: false,
                mensaje: userExists.username === username 
                    ? 'El nombre de usuario ya está en uso' 
                    : 'El correo electrónico ya está registrado'
            });
        }

        // Crear nuevo usuario
        const newUser = new User({ username, email, password });
        await newUser.save();

        // Generar token para el nuevo usuario
        const token = generateToken(newUser);

        return res.status(201).json({ 
            success: true,
            mensaje: 'Usuario registrado correctamente',
            token,
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                role: newUser.role
            }
        });
    } catch (error) {
        console.error('Error en registro:', error);
        return res.status(500).json({ 
            success: false,
            mensaje: 'Error al registrar usuario',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// @desc    Iniciar sesión de usuario
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ 
            success: false,
            mensaje: 'Correo y contraseña son obligatorios' 
        });
    }

    try {
        // Buscar usuario por email
        const user = await User.findOne({ email }).select('+password');
        
        if (!user) {
            return res.status(401).json({ 
                success: false,
                mensaje: 'Credenciales inválidas' 
            });
        }

        // Verificar contraseña
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ 
                success: false,
                mensaje: 'Credenciales inválidas' 
            });
        }

        // Generar token
        const token = generateToken(user);

        // Omitir la contraseña en la respuesta
        user.password = undefined;

        return res.status(200).json({
            success: true,
            mensaje: 'Inicio de sesión exitoso',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                avatarUrl: user.avatarUrl,
                bio: user.bio
            }
        });
    } catch (error) {
        console.error('Error en login:', error);
        return res.status(500).json({ 
            success: false,
            mensaje: 'Error al iniciar sesión',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};