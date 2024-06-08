const express = require('express');
const router = express.Router();
const userController = require('../Controller/userController');

// Définir les routes CRUD pour le modèle RDV
router.post('/user/login', userController.loginUser);
router.post('/user/register', userController.registerUser);

module.exports = router;
