#!/usr/bin/env python3
"""
Génère les données statiques (cours + actualités) pour la version en ligne
(GitHub Pages ne peut pas exécuter serveur.py).

    python3 generer_donnees.py      ->  data/chart/<symbole>.json, data/actus/<symbole>.json

En cas d'échec pour un symbole, le fichier existant est conservé.
"""
import os
import re
import sys

import serveur

SORTIE = os.path.join(serveur.RACINE, "data")


def nom(sym):
    """Nom de fichier sûr pour une URL (identique à nomFichier() dans app.js)."""
    return re.sub(r"[^A-Za-z0-9.]", "_", sym) + ".json"


def ecrire(chemin, octets):
    os.makedirs(os.path.dirname(chemin), exist_ok=True)
    with open(chemin, "wb") as f:
        f.write(octets)


def main():
    erreurs = 0
    for sym in sorted(serveur.SYMBOLES_AUTORISES):
        try:
            ecrire(os.path.join(SORTIE, "chart", nom(sym)), serveur.recuperer_yahoo(sym, "1y", "1d"))
        except Exception as e:
            erreurs += 1
            print(f"cours {sym} : {e}", file=sys.stderr)
    for sym in sorted(serveur.RECHERCHES_ACTUS):
        try:
            ecrire(os.path.join(SORTIE, "actus", nom(sym)), serveur.recuperer_actus(sym))
        except Exception as e:
            erreurs += 1
            print(f"actus {sym} : {e}", file=sys.stderr)
    print(f"Données générées ({erreurs} erreur(s)).")


if __name__ == "__main__":
    main()
