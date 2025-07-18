const API_URL = import.meta.env.VITE_API_URL;

// Upload d'un fichier Excel
export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  await fetch(`${API_URL}/upload`, {
    method: 'POST',
    body: formData,
  });
};

// Récupère les données extraites du dernier fichier
export const fetchData = async () => {
  const res = await fetch(`${API_URL}/data`);
  return res.json();
};

// Récupère l'historique des fichiers analysés
export const fetchHistory = async () => {
  const res = await fetch(`${API_URL}/history`);
  return res.json();
};

// Génération  l'URL de téléchargement d'un JSON précis
export const getDownloadUrl = (filename) => `${API_URL}/download-json/${filename}`; 