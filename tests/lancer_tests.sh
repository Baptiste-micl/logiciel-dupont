#!/bin/bash
# Lance tous les tests automatisés de Weekly Edge
cd "$(dirname "$0")/.."
echo "== Moteur financier (finance.js) =="
node --test tests/ || echo "ÉCHEC finance.js"
echo
echo "== Serveur et données (Python) =="
python3 -m unittest discover -s tests -v
