const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');

// Dossier d'upload configurable via .env
const UPLOADS_DIR = process.env.UPLOADS_DIR || 'uploads';
// Chemin du fichier d'historique
const HISTORY_FILE = path.join(__dirname, `../${UPLOADS_DIR}/history.json`);

// Génération du nom de fichier JSON unique basé sur le nom du fichier Excel et la date/heure
function makeJsonFilename(originalName) {
  const base = path.parse(originalName).name;
  const timestamp = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14);
  return `${base}_${timestamp}.json`;
}

// Mise à jour l'historique des fichiers analysés (ajoute une entrée en début de liste)
function updateHistory(entry) {
  let history = [];
  if (fs.existsSync(HISTORY_FILE)) {
    try {
      history = JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf-8'));
    } catch (e) {
      history = [];
    }
  }
  history.unshift(entry); // Plus récent d'abord
  fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2), { encoding: 'utf-8' });
}

// Route POST /upload : reçoit un fichier Excel, appelle le script Python, sauvegarde le JSON et l'historique
exports.uploadAndParse = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Aucun fichier envoyé.' });
  }
  console.log('NOUVEL UPLOAD:', req.file.path);
  // Appel du script Python pour parser le fichier Excel
  const python = spawn('python', [
    path.join(__dirname, '../../python-script/parser.py'),
    req.file.path
  ]);
  let data = '';
  // récupération de la sortie du script Python (le JSON extrait)
  python.stdout.on('data', (chunk) => {
    data += chunk;
  });
  python.stderr.on('data', (err) => {
    console.error('Erreur Python:', err.toString());
  });
  python.on('close', (code) => {
    if (code !== 0) {
      return res.status(500).json({ error: 'Erreur lors du parsing Python.' });
    }
    try {
      //parse du  JSON pour vérifier qu'il est valide et compter les lignes
      const jsonData = JSON.parse(data);
      // Génèration du nom de fichier unique pour ce JSON
      const jsonFilename = makeJsonFilename(req.file.originalname);
      const jsonPath = path.join(__dirname, `../${UPLOADS_DIR}/${jsonFilename}`);
      // Sauvegarde le JSON généré
      fs.writeFileSync(jsonPath, data, { encoding: 'utf-8' });
      // Met à jour le fichier d'historique
      updateHistory({
        excel: req.file.originalname,
        json: jsonFilename,
        date: new Date().toISOString(),
        rows: Array.isArray(jsonData) ? jsonData.length : 0
      });
      // mise à jour last_data.json (dernier résultat)  
      fs.writeFileSync(path.join(__dirname, `../${UPLOADS_DIR}/last_data.json`), data, { encoding: 'utf-8' });
      console.log('last_data.json et historique mis à jour, taille:', data.length, 'octets');
      res.json({ message: 'Fichier uploadé et analysé avec succès.' });
    } catch (e) {
      console.error('JSON invalide généré par le script Python:', e);
      return res.status(500).json({ error: 'Le script Python a généré un JSON invalide.' });
    }
  });
};

// Route GET /history : retourne la liste des fichiers analysés
exports.getHistory = (req, res) => {
  if (!fs.existsSync(HISTORY_FILE)) {
    return res.json([]);
  }
  try {
    const history = JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf-8'));
    res.json(history);
  } catch (e) {
    res.json([]);
  }
};

// Route GET /download-json/:filename : permet de télécharger un JSON précis de l'historique
exports.downloadHistoryJson = (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, `../${UPLOADS_DIR}/${filename}`);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Fichier JSON non trouvé.' });
  }
  res.download(filePath, filename);
};

// Route GET /data : retourne les données extraites du dernier fichier analysé
exports.getData = (req, res) => {
  const dataPath = path.join(__dirname, `../${UPLOADS_DIR}/last_data.json`);
  if (!fs.existsSync(dataPath)) {
    return res.status(404).json({ error: 'Aucune donnée disponible.' });
  }
  const jsonData = fs.readFileSync(dataPath, 'utf-8');
  res.json(JSON.parse(jsonData));
};

// Route GET /download-json : permet de télécharger le dernier JSON généré
exports.downloadJson = (req, res) => {
  const dataPath = path.join(__dirname, `../${UPLOADS_DIR}/last_data.json`);
  if (!fs.existsSync(dataPath)) {
    return res.status(404).json({ error: 'Aucune donnée disponible.' });
  }
  res.download(dataPath, 'bpu_data.json');
}; 