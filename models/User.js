const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'El nombre de usuario es obligatorio'],
    unique: true,
    trim: true,
    minlength: [3, 'El nombre de usuario debe tener al menos 3 caracteres'],
    maxlength: [30, 'El nombre de usuario no puede exceder los 30 caracteres']
  },
  email: {
    type: String,
    required: [true, 'El correo electrónico es obligatorio'],
    unique: true,
    trim: true,
    lowercase: true, // Normaliza el email a minúsculas
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Por favor ingresa un correo válido']
  },
  password: {
    type: String,
    required: [true, 'La contraseña es obligatoria'],
    minlength: [6, 'La contraseña debe tener al menos 6 caracteres'],
    select: false // No se incluirá en las consultas a menos que se solicite explícitamente
  },
  role: {
    type: String,
    enum: {
      values: ['user', 'admin'],
      message: 'El rol debe ser "user" o "admin"'
    },
    default: 'user'
  },
  bio: {
    type: String,
    default: '',
    maxlength: [500, 'La biografía no puede exceder los 500 caracteres']
  },
  avatarUrl: {
    type: String,
    default: '',
    match: [/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/, 'Por favor ingresa una URL válida']
  },
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true // Mejora el rendimiento en búsquedas
  }],
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: function(doc, ret) {
      delete ret.password; // Nunca enviar la contraseña en las respuestas
      delete ret.__v;
      return ret;
    }
  },
  toObject: {
    virtuals: true
  }
});

// Virtuals para conteo de seguidores/seguidos
userSchema.virtual('followersCount').get(function() {
  return this.followers.length;
});

userSchema.virtual('followingCount').get(function() {
  return this.following.length;
});

// Hashea la contraseña antes de guardar
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12); // Aumentar el costo a 12
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Método para comparar contraseñas
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Método para obtener perfil público (sin información sensible)
userSchema.methods.toProfileJSON = function() {
  return {
    _id: this._id,
    username: this.username,
    bio: this.bio,
    avatarUrl: this.avatarUrl,
    followersCount: this.followersCount,
    followingCount: this.followingCount,
    createdAt: this.createdAt
  };
};

// Índices para mejorar el rendimiento
userSchema.index({ username: 'text', email: 'text' });

module.exports = mongoose.model('User', userSchema);