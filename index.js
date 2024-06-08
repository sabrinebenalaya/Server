const express = require('express');
const connect = require('./ConnectDB/connectDB.JS');
const cors = require('cors')
const dotenv = require('dotenv');
const app = express();
const patientRoutes = require('./Route/patientRoutes');
const rdvRoutes = require('./Route/rdvRoutes');
const userRoutes = require('./Route/userRoutes');

const medicamentRoutes = require('./Route/medicamentRoutes');
const ordonnanceRoutes = require('./Route/ordonnanceRoutes');
const notificationRoutes = require('./Route/notificationRoutes');
const schedulejournaliere = require("./Schedules/scheduleTask")
const scheduleTaskHeure = require('./Schedules/scheduleTaskHeure')
const scheduleHebdo = require('./Schedules/scheduleTaskHebdomadaire')


dotenv.config();
const port = process.env.PORT;

app.listen(port, (e) => {
  if (e) {
    console.log("server is failed ⚠️");
  } else {
    console.log(`server is connected on port ${port} ✅`);
  }
});


connect();

app.use(cors({
  origin: '*'
})); 





app.use(express.json());
app.use('/MedicaNet', patientRoutes);
app.use('/MedicaNet', rdvRoutes);
app.use('/MedicaNet', medicamentRoutes);
app.use('/MedicaNet', ordonnanceRoutes);
app.use('/MedicaNet', notificationRoutes);
app.use('/MedicaNet', userRoutes);

schedulejournaliere.start();
scheduleTaskHeure.start();
scheduleHebdo.start();