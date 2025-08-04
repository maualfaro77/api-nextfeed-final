const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  user: { // Referencia al usuario
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: true
  },
  bio: {
    type: String,
    maxlength: 500
  },
  avatarUrl: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Profile', ProfileSchema);