// controllers/userController.js
const User = require('../Model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Fonction d'inscription
exports.registerUser = async (req, res) => {
  try {
    const { nom, userName, email, password } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé.' });
    }

    // Hacher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer un nouvel utilisateur
    const newUser = new User({
      nom,
      userName,
      email,
      password: hashedPassword
    });

    await newUser.save();
    console.log("newUser", newUser)
    res.status(201).json({ message: 'Utilisateur créé avec succès.', user: newUser });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur.', error });
  }
};

// Fonction de connexion
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
console.log(email, password)
    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User introuvable.' });
    }

    // Vérifier le mot de passe
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Mot de passe incorrect.' });
    }

    // Créer un token JWT
    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '1h' });
    
    res.status(200).json({ message: 'Connexion réussie.', token });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur.', error });
  }
};
