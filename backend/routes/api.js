const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const bpuController = require('../controllers/bpuController');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Route pour uploader et analyser un fichier Excel
router.post('/upload', upload.single('file'), bpuController.uploadAndParse);
// Route pour obtenir les données extraites du dernier fichier
router.get('/data', bpuController.getData);
// Route pour télécharger le dernier JSON généré
router.get('/download-json', bpuController.downloadJson);

// Route pour obtenir l'historique des fichiers analysés
router.get('/history', bpuController.getHistory);
// Route pour télécharger un JSON précis de l'historique
router.get('/download-json/:filename', bpuController.downloadHistoryJson);

module.exports = router; 