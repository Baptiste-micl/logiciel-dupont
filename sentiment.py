"""
Weekly Edge - note d'actualité par intelligence artificielle (FinBERT).

FinBERT (ProsusAI/finbert) est un modèle de langage open source, gratuit,
entraîné sur des phrases de presse financière en anglais. Il tourne en local
(ici dans GitHub Actions) : aucun compte, aucune clé, aucun service payant.
Il est déterministe : un même titre donne toujours la même note.

Pour chaque titre : note = P(positif) - P(négatif), entre -1 et +1.
Pour chaque société : moyenne des notes, les articles récents comptant davantage.

Dépendances (facultatives) :  pip install -r requirements-ia.txt
"""
import time

MODELE = "ProsusAI/finbert"
DEMI_VIE_H = 72      # le poids d'un article est divisé par 2 tous les 3 jours
AGE_MAX_J = 14       # au-delà, l'article est ignoré
SEUIL_TON = 0.15     # en dessous (en valeur absolue), le ton est jugé neutre

_classifieur = None


def _charger():
    global _classifieur
    if _classifieur is None:
        from transformers import pipeline  # import tardif : dépendance facultative
        _classifieur = pipeline("text-classification", model=MODELE, top_k=None, device=-1)
    return _classifieur


def noter_titres(titres):
    """Note de -1 (très négatif) à +1 (très positif) pour chaque titre."""
    if not titres:
        return []
    sorties = _charger()(list(titres), truncation=True)
    notes = []
    for probas in sorties:
        p = {d["label"].lower(): d["score"] for d in probas}
        notes.append(round(p.get("positive", 0.0) - p.get("negative", 0.0), 4))
    return notes


def agreger(articles, maintenant=None):
    """Moyenne pondérée par l'ancienneté. articles : [{"date": timestamp, "note": float}]."""
    maintenant = maintenant or time.time()
    somme = poids = 0.0
    for a in articles:
        age_h = max(0.0, (maintenant - a["date"]) / 3600)
        if age_h > AGE_MAX_J * 24:
            continue
        w = 0.5 ** (age_h / DEMI_VIE_H)
        somme += w * a["note"]
        poids += w
    return round(somme / poids, 4) if poids else 0.0


def ton(note):
    if note >= SEUIL_TON:
        return "positif"
    if note <= -SEUIL_TON:
        return "négatif"
    return "neutre"


def analyser_societe(symbole, actus, maintenant=None):
    """Résultat écrit dans data/sentiment/<symbole>.json."""
    actus = [a for a in actus if a.get("titre")][:15]
    notes = noter_titres([a["titre"] for a in actus])
    articles = [{"titre": a["titre"], "lien": a.get("lien", ""), "source": a.get("source", ""),
                 "date": a.get("date", 0), "note": n} for a, n in zip(actus, notes)]
    score = agreger(articles, maintenant)
    return {"symbole": symbole, "score": score, "ton": ton(score), "modele": MODELE,
            "maj": int(maintenant or time.time()), "articles": articles}
