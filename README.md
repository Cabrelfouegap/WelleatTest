Application Web de Lecture de BPU

#Objectif
Développer une application web permettant d’uploader un fichier Excel (.xlsx), d’en extraire les données pertinentes, d’afficher un aperçu structuré, et de générer un fichier JSON. Un historique des fichiers analysés est également disponible.

---

#Architecture

- Frontend : React (Vite) — Interface utilisateur moderne et responsive
- Backend : Node.js (Express) — API REST, gestion des fichiers, appel du script Python
- Traitement : Python (pandas) — Parsing, nettoyage et structuration des données Excel



# Prérequis
- Node.js >= 16
- Python >= 3.8
- pip (pour installer pandas, openpyxl)

---

# Installation et Lancement du projet : toutes ces commandes sont lancées depuis la racine du projet 

1. Script Python
cmd : cd ../python-script; pip install -r requirements.txt


2. Backend

cmd : cd backend; npm install; npm run start
creer le fichier .env et coller le contenu du .env.exemple

2. Frontend

cmd : cd ../frontend; npm install; npm run dev
creer le fichier .env et coller le contenu du .env.exemple


# Utilisation

1. Accédez à l’interface sur [http://localhost:5173]
2. Uploadez un fichier Excel (.xlsx) via la zone d’upload
3. Cliquez sur “Analyser” pour extraire les données
4. Visualisez l’aperçu structuré dans le tableau
5. Téléchargez le JSON extrait
6. Consultez l’historique des fichiers analysés et téléchargez les anciens JSON

---

# Fonctionnalités principales
- Upload de fichiers Excel (.xlsx)
- Parsing et extraction robustes (détection automatique de l’en-tête)
- Nettoyage et structuration des données (suppression des lignes vides, gestion des valeurs manquantes)
- Aperçu dynamique des données extraites
- Génération et téléchargement du JSON
- Historique des fichiers analysés (backend + frontend)

---

# Points de personnalisation
- Colonnes extraites : modifiables dans `python-script/parser.py` (variable `COLUMNS`)
- Dossier d’upload : modifiable via la variable d’environnement `UPLOADS_DIR`
- URL de l’API : modifiable dans `frontend/.env`

---

# Commentaires et structure du code
- Le code Python et backend est abondamment commenté pour faciliter la compréhension et la maintenance.
- Le frontend est découpé en composants clairs et réutilisables.

---

# Exemple de JSON extrait

[
  {
    "N° DE BPU": "1",
    "Désignation produit": "Assortiment Belin salé ou équivalent",
    "Prix Unitaire H.T": "13,77 €",
    ...
  },
  ...
]


---

# Auteur
- Projet réalisé par : Narcisse Cabrel TSAFACK FOUEGAP

# illustration 
des captures d'écran  et fichiers sont dans le dossier Test

