const mongoose = require('mongoose');

const ordonnanceSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  medicaments: [{
    medicament: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Medicament'
    }
  }],
  rdv: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Rdv',
    required: true
  },
  dureTraitement: {
    type: Number, 
    required: true
  }
});

const Ordonnance = mongoose.model('Ordonnance', ordonnanceSchema);

module.exports = Ordonnance;
