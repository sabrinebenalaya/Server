const express = require('express');

const router = express.Router();
const notificationController = require('../Controller/notificationController');

// Définir les routes CRUD pour le modèle Notification
router.post('/notifications', notificationController.createNotification);

module.exports = router;
