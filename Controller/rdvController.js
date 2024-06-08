const RDV = require("../Model/RDV");
const Patient = require("../Model/Patient");
const notificationController = require("./notificationController");


const moment = require("moment");
exports.createRDV = async (req, res) => {
  try {
    const existingRdv = await RDV.findOne({
      patient: req.body.patient,
      date: req.body.date,
    });

    if (existingRdv) {
      return res
        .status(400)
        .json("Un rendez-vous existe déjà pour ce patient à cette date.");
    } else {
      const rdv = new RDV(req.body);
      await rdv.save();
      if (rdv) {
        const date = new Date(rdv.date);

        if (!isNaN(date.getTime())) {
          // Extraire le jour (au format "01-02-2024")
          jourFormate = new Intl.DateTimeFormat("fr-FR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          }).format(date);

          // Extraire l'heure (au format "14:30")
          heureFormatee = new Intl.DateTimeFormat("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
          }).format(date);
        } else {
          console.error("La date n'est pas valide");
        }

        const newPatientInstance = await Patient.findById(req.body.patient);
        const message = `Cher(e) ${newPatientInstance.prenom},
    
          Nous vous confirmons la prise de rendez-vous sur la plateforme MediaNet. Voici les détails :

          Date et heure du rendez-vous : ${jourFormate} a ${heureFormatee}
          Médecin ou professionnel de santé :  ${rdv.title}
          
          Si vous avez des questions ou besoin de plus d'informations, n'hésitez pas à nous contacter.
          
          Merci de votre confiance et à bientôt sur MediaNet !
          
          Cordialement,
          L'équipe MediaNet`;
        const SMS = `Cher ${newPatientInstance.prenom},
    
    Votre rendez-vous sur MediaNet est confirmé pour  ${jourFormate} a ${heureFormatee} avec ${rdv.title} . 

    Pour toute question ou assistance, contactez-nous.
    
    Merci pour votre confiance.
    
    Cordialement,
    MediaNet`;
        await notificationController.sendEmail(
          newPatientInstance.mailPatient,
          message,
          `Confirmation de RDV chez ${rdv.title}`
        );
        const patientPhoneNumber = "+216" + newPatientInstance.numeroTelephone;

       
      }
      return res.status(201).json(rdv);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Contrôleur pour récupérer tous les RDVs
exports.getAllRDVs = async (req, res) => {
  try {
    const rdvs = await RDV.find({ patient: req.params.idPatient });

    res.status(200).json(rdvs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Contrôleur pour récupérer list des RDVs
exports.getListRDVs = async (req, res) => {
  const { id, status } = req.params;
  const redvs = [];
  try {
    if (status === "prochain") {
      rdvs = await RDV.find({
        patient: id,
        $or: [
          { status: "attente" },
          { status: "avant72" },
          { status: "avant24" },
        ],
      });
    } else {
      rdvs = await RDV.find({
        patient: id,
        $or: [{ status: "passer" }, { status: "Termine" }],
      });
    }

    res.status(200).json(rdvs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Contrôleur pour récupérer un RDV par son ID
exports.getRDVById = async (req, res) => {
  try {
    const rdv = await RDV.findById(req.params.id);
    if (!rdv) {
      return res.status(404).json({ message: "RDV not found" });
    }

    res.status(200).json(rdv);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Contrôleur pour mettre à jour un RDV par son ID
exports.updateRDV = async (req, res) => {
  const updateFields = {};
  if (req.body.note !== "") {
    updateFields.note = req.body.note;
  }

  if (req.body.date !== "") {
    updateFields.date = req.body.date;
  }
  updateFields.status= req.body.status;
  try {
    const rdv = await RDV.findByIdAndUpdate(req.params.id, updateFields, {
      new: true,
    });
    if (!rdv) {
      return res.status(404).json({ message: "RDV not found" });
    } else {
      const date = new Date(rdv.date);

      if (!isNaN(date.getTime())) {
        // Extraire le jour (au format "01-02-2024")
        jourFormate = new Intl.DateTimeFormat("fr-FR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }).format(date);

        // Extraire l'heure (au format "14:30")
        heureFormatee = new Intl.DateTimeFormat("fr-FR", {
          hour: "2-digit",
          minute: "2-digit",
        }).format(date);
      } else {
        console.error("La date n'est pas valide");
      }

      const newPatientInstance = await Patient.findById(rdv.patient);
      const message = `Cher(e) ${newPatientInstance.prenom},
    
          Nous vous informons que votre rendez-vous sur la plateforme MediaNet a été mis à jour avec succès. 
          Voici les nouveaux détails :

Date et heure du rendez-vous mis à jour :  ${jourFormate} a ${heureFormatee}
Médecin ou professionnel de santé : ${rdv.title}
Note : ${rdv.note}

Si vous avez des questions ou besoin de plus d'informations, n'hésitez pas à nous contacter.

Merci de votre compréhension.

Cordialement,
L'équipe MediaNet`;
      const SMS = `Cher ${newPatientInstance.prenom},
    
    Votre rendez-vous sur MediaNet a été mis à jour pour  ${jourFormate} a ${heureFormatee} avec  ${rdv.title} avec cette note ${rdv.note} .

    Pour toute question ou assistance, contactez-nous.
    
    Merci pour votre compréhension.
    
    Cordialement,
    MediaNet`;
      await notificationController.sendEmail(
        newPatientInstance.mailPatient,
        message,
        `Modification de RDV chez ${rdv.title}`
      );
      const patientPhoneNumber = "+216" + newPatientInstance.numeroTelephone;

      
    }

    const rdvs = await RDV.find({ patient: rdv.patient });

    return res.status(200).json(rdvs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Contrôleur pour supprimer un RDV par son ID
exports.deleteRDV = async (req, res) => {
  try {
    const rdv = await RDV.findByIdAndDelete(req.params.id);
    if (!rdv) {
      return res.status(404).json({ message: "RDV not found" });
    } else {
      const rdvs = await RDV.find();
      res.status(200).json(rdvs);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
