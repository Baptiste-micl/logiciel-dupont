# Weekly Edge — conseil & suivi de portefeuille

Application web de conseil en investissement pour un client particulier au profil dynamique.
Horizon 1 an, objectif +10 %, perte hebdomadaire maximale de 10 %, capital de 500 000 €.
Univers : Hermès, TotalEnergies, Air Liquide, Dassault Systèmes, Capgemini.

## Lancer

- **Double-cliquer sur `Lancer.command`**, ou dans un terminal : `python3 serveur.py`
- Le navigateur s'ouvre sur http://localhost:8000.
- Rien à installer : Python 3 standard suffit. Une connexion internet est nécessaire pour les cours réels.

## Version en ligne

Le site est publié sur GitHub Pages. Sans serveur Python, l'application lit les fichiers `data/`
produits par `generer_donnees.py` ; une GitHub Action les rafraîchit toutes les 30 minutes
pendant les heures de Bourse (cours non temps réel). En local (`localhost`), les cours restent en direct.

## Onglets

| Onglet | Rôle |
|---|---|
| Accueil | Valeur, gain, jauges perte hebdo (limite 10 %) et objectif annuel, conseils, composition, évolution |
| Répartition | Répartition conseillée, rôle de chaque titre (justification détaillée dépliable), validation en un clic ; analyse détaillée repliée (frontière efficiente, corrélations, méthode) |
| Ordres | Achat/vente instantané avec frais (courtage + TTF), cours et signaux par titre, historique replié |
| Prévisions | Fourchettes à 5 séances, chance de hausse, risque du portefeuille, cône de prévision |
| Infos & profil | Ce qui fait bouger la Bourse (CAC 40, S&P 500, Nasdaq, Brent, euro/dollar, taux US, VIX en direct + corrélation avec chaque titre), actualités récentes, fiches sociétés (avec facteurs d'influence et calendrier des résultats), paramètres du client ; événements à surveiller, questionnaire, lexique et points de vigilance repliés |

Les détails techniques sont repliés par défaut : cliquer sur « ▸ » pour les afficher.

## Tests

```
./tests/lancer_tests.sh
```

- `tests/finance.test.js` : 19 tests unitaires du moteur financier (Node.js 18+, `node --test tests/`)
- `tests/test_serveur.py` : 16 tests du serveur, des données en ligne et du code source (`python3 -m unittest discover -s tests -v`)

## Fichiers

- `serveur.py` : serveur local et relais Yahoo Finance (contourne le CORS) : cours (cache 30 s) et actualités filtrées (cache 15 min)
- `generer_donnees.py` : instantané des cours et actualités dans `data/` pour la version en ligne
- `finance.js` : moteur de calcul (statistiques, covariance, optimisation Monte-Carlo, VaR, Cholesky, signaux)
- `app.js` : interface, état du portefeuille (sauvegardé dans le navigateur), moteur de conseils
- `index.html`, `style.css`, `vendor/chart.umd.min.js` (Chart.js 4.4)
- `logo.svg` (icône, favicon) et `logo-complet.svg` (icône + nom)

Les ordres sont simulés : aucun ordre réel n'est transmis.
