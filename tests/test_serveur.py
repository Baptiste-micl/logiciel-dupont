"""Tests d'intégration du serveur local (serveur.py) et des données statiques (data/).

Lancement :  python3 -m unittest discover -s tests -v
Les tests marqués « réseau » interrogent Yahoo Finance et sont ignorés sans connexion.
"""
import glob
import json
import os
import re
import subprocess
import sys
import threading
import unittest
import urllib.error
import urllib.request

RACINE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, RACINE)
import generer_donnees  # noqa: E402
import sentiment  # noqa: E402
import serveur  # noqa: E402


def reseau_disponible():
    try:
        urllib.request.urlopen("https://query1.finance.yahoo.com", timeout=5)
        return True
    except urllib.error.HTTPError:
        return True  # le serveur répond, même avec une erreur
    except Exception:
        return False


RESEAU = reseau_disponible()
try:
    import transformers  # noqa: F401
    FINBERT = True
except ImportError:
    FINBERT = False


def lire_json(chemin):
    with open(chemin, encoding="utf-8") as f:
        return json.load(f)


class TestServeur(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.srv = serveur.Serveur(("127.0.0.1", 0), serveur.Gestionnaire)
        cls.base = f"http://127.0.0.1:{cls.srv.server_address[1]}"
        threading.Thread(target=cls.srv.serve_forever, daemon=True).start()

    @classmethod
    def tearDownClass(cls):
        cls.srv.shutdown()
        cls.srv.server_close()

    def get(self, chemin):
        try:
            with urllib.request.urlopen(self.base + chemin, timeout=20) as r:
                return r.status, r.headers.get("Content-Type", ""), r.read()
        except urllib.error.HTTPError as e:
            return e.code, e.headers.get("Content-Type", ""), e.read()

    def test_S01_page_accueil(self):
        code, _, corps = self.get("/")
        self.assertEqual(code, 200)
        self.assertIn(b"<html", corps.lower())

    def test_S02_fichiers_statiques(self):
        for f in ("/app.js", "/finance.js", "/style.css", "/logo.svg", "/vendor/chart.umd.min.js"):
            with self.subTest(fichier=f):
                self.assertEqual(self.get(f)[0], 200)

    def test_S03_symbole_non_autorise_refuse(self):
        code, ctype, corps = self.get("/api/chart?symbol=AAPL&range=1y&interval=1d")
        self.assertEqual(code, 400)
        self.assertIn("application/json", ctype)
        self.assertIn("erreur", json.loads(corps))

    def test_S04_parametres_invalides_refuses(self):
        for q in ("symbol=AI.PA&range=10y&interval=1d", "symbol=AI.PA&range=1y&interval=1s", ""):
            with self.subTest(requete=q):
                self.assertEqual(self.get("/api/chart?" + q)[0], 400)

    def test_S05_actus_symbole_inconnu_refuse(self):
        self.assertEqual(self.get("/api/actus?symbol=%5EVIX")[0], 400)

    def test_S06_fichier_inexistant(self):
        self.assertEqual(self.get("/inexistant.html")[0], 404)

    @unittest.skipUnless(RESEAU, "réseau indisponible")
    def test_S07_cours_reels(self):
        code, _, corps = self.get("/api/chart?symbol=AI.PA&range=1y&interval=1d")
        self.assertEqual(code, 200)
        res = json.loads(corps)["chart"]["result"][0]
        self.assertGreater(len(res["timestamp"]), 200)  # environ 1 an de séances
        self.assertGreater(res["meta"]["regularMarketPrice"], 0)

    @unittest.skipUnless(RESEAU, "réseau indisponible")
    def test_S08_actualites_filtrees(self):
        code, _, corps = self.get("/api/actus?symbol=TTE.PA")
        self.assertEqual(code, 200)
        actus = json.loads(corps)["actus"]
        for a in actus:
            self.assertIn("totalenergies", a["titre"].lower())
            self.assertTrue(a["lien"].startswith("https://"))
        dates = [a["date"] for a in actus]
        self.assertEqual(dates, sorted(dates, reverse=True))

    def test_S09_filtre_bruit_actualites(self):
        self.assertTrue(serveur.BRUIT_ACTUS.search("Hydrogen Market Size Report 2030"))
        self.assertIsNone(serveur.BRUIT_ACTUS.search("Air Liquide signs a new contract in Texas"))


class TestDonneesStatiques(unittest.TestCase):
    """Fichiers data/ lus par la version en ligne (GitHub Pages)."""

    def test_D01_nom_de_fichier_identique_python_et_javascript(self):
        with open(os.path.join(RACINE, "app.js"), encoding="utf-8") as f:
            js = f.read()
        self.assertIn('sym.replace(/[^A-Za-z0-9.]/g, "_") + ".json"', js)
        for sym, attendu in (("AI.PA", "AI.PA.json"), ("^FCHI", "_FCHI.json"), ("BZ=F", "BZ_F.json")):
            self.assertEqual(generer_donnees.nom(sym), attendu)

    def test_D02_un_fichier_de_cours_par_symbole(self):
        for sym in serveur.SYMBOLES_AUTORISES:
            with self.subTest(symbole=sym):
                chemin = os.path.join(RACINE, "data", "chart", generer_donnees.nom(sym))
                res = lire_json(chemin)["chart"]["result"][0]
                closes = [c for c in res["indicators"]["quote"][0]["close"] if c is not None]
                self.assertGreater(len(closes), 200)
                self.assertTrue(all(c > 0 for c in closes))

    def test_D03_un_fichier_actus_par_societe(self):
        for sym in serveur.RECHERCHES_ACTUS:
            with self.subTest(symbole=sym):
                d = lire_json(os.path.join(RACINE, "data", "actus", generer_donnees.nom(sym)))
                self.assertEqual(d["symbole"], sym)
                self.assertIsInstance(d["actus"], list)

    def test_D04_pas_de_fichier_orphelin(self):
        attendus = {generer_donnees.nom(s) for s in serveur.SYMBOLES_AUTORISES}
        presents = {os.path.basename(f) for f in glob.glob(os.path.join(RACINE, "data", "chart", "*.json"))}
        self.assertEqual(presents, attendus)

    def test_D05_nojekyll_present(self):
        # sans lui, GitHub Pages ignore les fichiers commençant par « _ » (_FCHI.json…)
        self.assertTrue(os.path.exists(os.path.join(RACINE, ".nojekyll")))


class TestSentiment(unittest.TestCase):
    """Note d'actualité (sentiment.py). T05 exécute FinBERT s'il est installé."""
    T0 = 1_800_000_000

    def test_T01_moyenne_ponderee_par_fraicheur(self):
        articles = [{"date": self.T0, "note": 1.0}, {"date": self.T0 - 72 * 3600, "note": -1.0}]
        # l'article de 3 jours pèse moitié moins : (1 × 1 + 0,5 × -1) / 1,5 = 0,333
        self.assertAlmostEqual(sentiment.agreger(articles, self.T0), 1 / 3, places=3)

    def test_T02_articles_trop_anciens_ignores(self):
        articles = [{"date": self.T0 - 20 * 86400, "note": -1.0}, {"date": self.T0, "note": 0.4}]
        self.assertAlmostEqual(sentiment.agreger(articles, self.T0), 0.4)
        self.assertEqual(sentiment.agreger([], self.T0), 0.0)

    def test_T03_ton(self):
        self.assertEqual(sentiment.ton(0.5), "positif")
        self.assertEqual(sentiment.ton(-0.3), "négatif")
        self.assertEqual(sentiment.ton(0.05), "neutre")

    def test_T04_fichiers_de_notes(self):
        for sym in serveur.RECHERCHES_ACTUS:
            with self.subTest(symbole=sym):
                d = lire_json(os.path.join(RACINE, "data", "sentiment", generer_donnees.nom(sym)))
                self.assertEqual(d["symbole"], sym)
                self.assertGreaterEqual(d["score"], -1)
                self.assertLessEqual(d["score"], 1)
                for a in d["articles"]:
                    self.assertTrue(-1 <= a["note"] <= 1)

    @unittest.skipUnless(FINBERT, "FinBERT non installé (pip install -r requirements-ia.txt)")
    def test_T05_finbert_reconnait_le_ton_et_reste_reproductible(self):
        titres = ["Company reports record profit and raises its full-year guidance",
                  "Shares plunge after the group issues a profit warning"]
        notes = sentiment.noter_titres(titres)
        self.assertGreater(notes[0], 0.5)
        self.assertLess(notes[1], -0.5)
        self.assertEqual(notes, sentiment.noter_titres(titres))  # même titre, même note


class TestCodeSource(unittest.TestCase):
    def test_C01_syntaxe_javascript(self):
        for f in ("app.js", "finance.js"):
            with self.subTest(fichier=f):
                r = subprocess.run(["node", "--check", os.path.join(RACINE, f)], capture_output=True, text=True)
                self.assertEqual(r.returncode, 0, r.stderr)

    def test_C02_references_html_existantes(self):
        with open(os.path.join(RACINE, "index.html"), encoding="utf-8") as f:
            html = f.read()
        for ref in re.findall(r'(?:src|href)="([^"#:]+)"', html):
            with self.subTest(ref=ref):
                self.assertTrue(os.path.exists(os.path.join(RACINE, ref.split("?")[0])), ref)


if __name__ == "__main__":
    unittest.main(verbosity=2)
