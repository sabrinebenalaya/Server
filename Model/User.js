// models/user.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Définir le schéma utilisateur
const userSchema = new Schema({
  nom: {
    type: String,
    required: true
  },
  userName: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+\@.+\..+/, 'Veuillez entrer un email valide'] // Validation basique pour email
  },
  password: {
    type: String,
    required: true
  }
});

// Créer le modèle utilisateur
const User = mongoose.model('User', userSchema);

module.exports = User;
