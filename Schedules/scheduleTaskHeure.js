const cron = require('node-cron');
const notification = require('../Controller/notificationController'); 
const RDV = require('../Model/RDV');
const Patient = require('../Model/Patient');
const moment = require('moment');

//changer statut et envoyer mail quant le rdv est fait pour informer le patient qu il peut MAJ son ordonnace
async function statusRDVFait() {
  try {
    const heureActuelle = moment();
    const rdvs = await RDV.find({ status: 'avant24' });

    for (const rdv of rdvs) {
      const dateRDV = moment(rdv.date);

      const differenceHeures = dateRDV.diff(heureActuelle, 'hours');
     
      if (differenceHeures <= 1 && differenceHeures >= -1) {
        await RDV.findByIdAndUpdate(rdv._id, { status: 'fait' });

        const formattedDate = moment(dateRDV).format("YYYY-MM-DD");
    
        const patient = await Patient.findById(rdv.patient);
        const message = `
        Cher(e) ${patient.prenom},

Votre rendez-vous avec ${rdv.title} a été effectué avec succès le ${formattedDate}. Nous vous informons que votre ordonnance est maintenant disponible.

Vous pouvez récupérer votre ordonnance en vous connectant à votre espace patient sur notre plateforme en ligne.

N'hésitez pas à nous contacter si vous avez des questions ou avez besoin d'assistance supplémentaire.

Cordialement,
L'équipe de prise de rendez-vous`;

        await notification.sendEmail(
          patient.mailPatient,
          message,
         " Rendez-vous réussi - Mettez à jour votre ordonnance"
        );

        const patientPhoneNumber = "+216" + patient.numeroTelephone;
        const formattedHeure = moment(dateRDV).format('HH:mm');
const SMS = `Cher(e) ${patient.prenom},

Votre rendez-vous avec ${rdv.title} a été effectué avec succès le ${formattedDate}. Votre ordonnance est maintenant disponible.

Connectez-vous à votre espace patient sur notre plateforme en ligne pour récupérer votre ordonnance.

N'hésitez pas à nous contacter si vous avez des questions ou avez besoin d'assistance supplémentaire.

Cordialement,
L'équipe de prise de rendez-vous`
      
      }
    }
  } catch (error) {
    console.error("Erreur lors de la planification de la tâche :", error);
  }
}
  


// Planifier la tâche pour s'exécuter toutes les heures entre 8h et 20h de chaque jour
const scheduleTaskHeure = cron.schedule("47 8-20 * * *", async () => {
    try {

      statusRDVFait();
    } catch (error) {
      console.error("Erreur lors de la planification de la tâche :", error);
    }
  });
  
  module.exports = scheduleTaskHeure;
  