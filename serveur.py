#!/usr/bin/env python3
"""
Weekly Edge - serveur local.

Sert l'application web et relaie les cours Yahoo Finance (le navigateur
ne peut pas les interroger directement à cause de la politique CORS).
Uniquement la bibliothèque standard Python : rien à installer.

Lancement :  python3 serveur.py      puis  http://localhost:8000
"""
import http.server
import json
import os
import re
import socketserver
import threading
import time
import urllib.parse
import urllib.request
import webbrowser

PORT = int(os.environ.get("PORT", "8000"))
RACINE = os.path.dirname(os.path.abspath(__file__))
SYMBOLES_AUTORISES = {
    "RMS.PA", "TTE.PA", "AI.PA", "DSY.PA", "CAP.PA", "^FCHI",
    # facteurs de marché : pétrole, euro/dollar, peur, Wall Street, taux US, Nasdaq
    "BZ=F", "EURUSD=X", "^VIX", "^GSPC", "^TNX", "^IXIC",
}
# actualités : recherche Yahoo Finance par nom de société
RECHERCHES_ACTUS = {  # symbole -> (recherche, mots dont l'un doit figurer dans le titre)
    "RMS.PA": ("Hermes International", ("hermès", "hermes")),
    "TTE.PA": ("TotalEnergies", ("totalenergies",)),
    "AI.PA": ("Air Liquide", ("air liquide",)),
    "DSY.PA": ("Dassault Systemes", ("dassault",)),
    "CAP.PA": ("Capgemini", ("capgemini",)),
}
# études de marché génériques publiées en masse : sans intérêt pour le cours
BRUIT_ACTUS = re.compile(r"market (size|report|share|research|20\d\d)|business report|forecast (to|till) 20|cagr", re.I)
ACTUS_TTL = 900  # secondes
PLAGES = {"5d", "1mo", "3mo", "6mo", "1y", "2y"}
INTERVALLES = {"1m", "5m", "15m", "1h", "1d", "1wk"}
CACHE_TTL = 30  # secondes
_cache = {}
_verrou = threading.Lock()


def recuperer_yahoo(symbole, plage, intervalle):
    cle = (symbole, plage, intervalle)
    with _verrou:
        if cle in _cache and time.time() - _cache[cle][0] < CACHE_TTL:
            return _cache[cle][1]
    url = (
        "https://query1.finance.yahoo.com/v8/finance/chart/"
        + urllib.parse.quote(symbole)
        + f"?range={plage}&interval={intervalle}&includePrePost=false"
    )
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=15) as rep:
        donnees = rep.read()
    with _verrou:
        _cache[cle] = (time.time(), donnees)
    return donnees


def recuperer_actus(symbole):
    cle = ("actus", symbole)
    with _verrou:
        if cle in _cache and time.time() - _cache[cle][0] < ACTUS_TTL:
            return _cache[cle][1]
    url = (
        "https://query1.finance.yahoo.com/v1/finance/search?quotesCount=0&newsCount=15&q="
        + urllib.parse.quote(RECHERCHES_ACTUS[symbole][0])
    )
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=15) as rep:
        brut = json.loads(rep.read())
    mots = RECHERCHES_ACTUS[symbole][1]
    actus = [
        {
            "titre": n.get("title", ""),
            "source": n.get("publisher", ""),
            "lien": n.get("link", ""),
            "date": n.get("providerPublishTime", 0),
        }
        for n in brut.get("news", [])
        if n.get("title") and str(n.get("link", "")).startswith("https://")
        and any(m in n["title"].lower() for m in mots)
        and not BRUIT_ACTUS.search(n["title"])
    ]
    actus.sort(key=lambda a: a["date"], reverse=True)
    donnees = json.dumps({"symbole": symbole, "actus": actus}).encode()
    with _verrou:
        _cache[cle] = (time.time(), donnees)
    return donnees


class Gestionnaire(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=RACINE, **kwargs)

    def log_message(self, fmt, *args):
        pass  # console silencieuse

    def do_GET(self):
        url = urllib.parse.urlparse(self.path)
        if url.path == "/api/chart":
            q = urllib.parse.parse_qs(url.query)
            symbole = q.get("symbol", [""])[0]
            plage = q.get("range", ["1y"])[0]
            intervalle = q.get("interval", ["1d"])[0]
            if symbole not in SYMBOLES_AUTORISES or plage not in PLAGES or intervalle not in INTERVALLES:
                return self._json(400, {"erreur": "paramètres invalides"})
            try:
                corps = recuperer_yahoo(symbole, plage, intervalle)
            except Exception as e:  # réseau, quota, etc.
                return self._json(502, {"erreur": f"source indisponible : {e}"})
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Cache-Control", "no-store")
            self.end_headers()
            self.wfile.write(corps)
            return
        if url.path == "/api/actus":
            symbole = urllib.parse.parse_qs(url.query).get("symbol", [""])[0]
            if symbole not in RECHERCHES_ACTUS:
                return self._json(400, {"erreur": "paramètres invalides"})
            try:
                corps = recuperer_actus(symbole)
            except Exception as e:
                return self._json(502, {"erreur": f"source indisponible : {e}"})
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Cache-Control", "no-store")
            self.end_headers()
            self.wfile.write(corps)
            return
        return super().do_GET()

    def _json(self, code, obj):
        corps = json.dumps(obj).encode()
        self.send_response(code)
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        self.wfile.write(corps)


class Serveur(socketserver.ThreadingMixIn, http.server.HTTPServer):
    daemon_threads = True
    allow_reuse_address = True
    request_queue_size = 64  # le navigateur envoie une douzaine de requêtes à la fois


if __name__ == "__main__":
    with Serveur(("127.0.0.1", PORT), Gestionnaire) as srv:
        adresse = f"http://localhost:{PORT}"
        print(f"Weekly Edge lancé sur {adresse}  (Ctrl+C pour arrêter)")
        if not os.environ.get("NO_BROWSER"):
            threading.Timer(0.8, lambda: webbrowser.open(adresse)).start()
        try:
            srv.serve_forever()
        except KeyboardInterrupt:
            print("\nArrêt.")
