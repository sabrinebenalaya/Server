const express = require('express');
const router = express.Router();
const rdvController = require('../Controller/rdvController');

// Définir les routes CRUD pour le modèle RDV
router.get('/rdv/:idPatient', rdvController.getAllRDVs);
router.get('/rdv/:id/:status', rdvController.getListRDVs);
router.get('/rdvs/:id', rdvController.getRDVById);
router.put('/rdv/:id', rdvController.updateRDV);
router.delete('/rdv/:id', rdvController.deleteRDV);
router.post('/rdv', rdvController.createRDV);
module.exports = router;
