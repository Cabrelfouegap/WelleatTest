import sys
import pandas as pd
import json
import re

# Forcer la sortie standard en UTF-8 pour éviter les problèmes d'encodage
if sys.stdout.encoding is None or sys.stdout.encoding.lower() != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')

# Liste des colonnes à extraire (adapter selon le besoin)
COLUMNS = [
    "N° DE BPU",
    "Désignation produit",
    "Produits répondant à la Loi EGALIM",
    "Quantité annuelle estimative en kilo",
    "Conditionnement recommandé",
    "Conditionnement proposé par le fournisseur",
    "Marque du produit",
    "Prix unitaire public H.T.",
    "RABAIS %",
    "Prix H.T. au Kg",
    "Prix Unitaire H.T",
    "PRIX TOTAL H.T"
]

# On compile les patterns pour matcher les titres même s'ils ne sont pas strictement identiques
COLUMN_PATTERNS = [re.compile(re.escape(col), re.IGNORECASE) for col in COLUMNS]

def find_header_row(file_path):
    """
    Détecte automatiquement la ligne d'en-tête en cherchant la première ligne
    contenant une majorité des titres attendus (même partiels).
    Retourne l'index de la ligne d'en-tête ou None si non trouvée.
    """
    max_lines = 0
    try:
        # On lit le fichier sans header pour compter le nombre de lignes
        tmp = pd.read_excel(file_path, header=None)
        max_lines = len(tmp)
    except Exception:
        pass
    for i in range(min(15, max_lines)):
        try:
            # On lit la ligne i comme en-tête
            df = pd.read_excel(file_path, header=i, nrows=1)
        except Exception:
            continue
        found = 0
        for col in df.columns:
            for pat in COLUMN_PATTERNS:
                if pat.search(str(col)):
                    found += 1
                    break
        # Si au moins la moitié des colonnes attendues sont trouvées, on considère que c'est l'en-tête
        if found >= len(COLUMNS) // 2:
            return i
    return None  # Aucun header trouvé

def main():
    if len(sys.argv) < 2:
        print(json.dumps({'error': 'Aucun fichier fourni'}))
        sys.exit(1)
    file_path = sys.argv[1]
    try:
        # Détection automatique de la ligne d'en-tête
        header_row = find_header_row(file_path)
        if header_row is None:
            print(json.dumps({'error': "Aucune ligne d’en-tête trouvée ou fichier trop court"}))
            sys.exit(1)
        # Lecture du DataFrame à partir de la bonne ligne d'en-tête
        df = pd.read_excel(file_path, header=header_row)
        # On ne garde que les colonnes d'intérêt, dans l'ordre voulu
        cols = [col for col in COLUMNS if col in df.columns]
        df = df[cols]
        # Suppression des lignes où toutes les colonnes sont vides
        df = df.dropna(how='all', subset=cols)
        # Remplacement des valeurs manquantes par des chaînes vides
        df = df.fillna("")
        # Conversion en liste de dictionnaires (format JSON)
        data = df.to_dict(orient='records')
        print(json.dumps(data, ensure_ascii=False, indent=2))
    except Exception as e:
        # Gestion des erreurs inattendues
        print(json.dumps({'error': str(e)}))
        sys.exit(1)

if __name__ == '__main__':
    main() 