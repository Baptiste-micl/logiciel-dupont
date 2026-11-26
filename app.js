/* =====================================================================
   Weekly Edge — application (données, état, interface, conseils)
   ===================================================================== */

/* ---------- Univers d'investissement ---------- */
const TITRES = [
  {
    sym: "RMS.PA", nom: "Hermès International", court: "Hermès", couleur: "#2a78d6",
    secteur: "Luxe — maroquinerie, soie, prêt-à-porter", siege: "Paris",
    desc: "Maison de luxe fondée en 1837, connue pour ses sacs Birkin et Kelly. Le groupe a des marges parmi les plus élevées du secteur et une forte maîtrise de sa distribution. La famille fondatrice contrôle environ deux tiers du capital.",
    role: "valeur de croissance de qualité, mais sensible à la demande chinoise et américaine pour le luxe",
    facteurs: [
      "Demande de luxe en Chine et aux États-Unis : ce sont les deux premiers relais de croissance du secteur",
      "Publications des concurrents (LVMH, Kering, Richemont) : elles font bouger tout le secteur du luxe le jour même",
      "Euro/dollar et yen : la majorité des ventes est réalisée hors zone euro, un euro fort réduit leur valeur en euros",
      "Droits de douane sur les produits européens, notamment aux États-Unis",
      "Taux d'intérêt : le titre est très cher (valorisation élevée), une hausse des taux pèse sur ce type de valeur",
    ],
    agenda: "chiffre d'affaires du 1er trimestre fin avril, résultats semestriels fin juillet, chiffre d'affaires du 3e trimestre fin octobre, résultats annuels mi-février",
  },
  {
    sym: "TTE.PA", nom: "TotalEnergies", court: "TotalEnergies", couleur: "#eb6834",
    secteur: "Énergie — pétrole, gaz, GNL, électricité", siege: "Courbevoie",
    desc: "Major intégrée présente sur toute la chaîne de l'énergie : exploration-production, raffinage, gaz naturel liquéfié et électricité renouvelable. Son cours dépend fortement des prix du pétrole et du gaz.",
    role: "moteur décorrélé des valeurs technologiques et du luxe : son cours suit surtout le pétrole",
    facteurs: [
      "Prix du pétrole (Brent) et du gaz naturel : c'est le premier moteur du cours",
      "Décisions de l'OPEP+ sur les quotas de production",
      "Tensions géopolitiques (Moyen-Orient, Russie) : elles font souvent monter le pétrole, donc le titre",
      "Marges de raffinage et prix du gaz naturel liquéfié (GNL)",
      "Euro/dollar : le pétrole se vend en dollars, un dollar fort augmente les revenus en euros",
      "Politique climatique et taxes exceptionnelles sur les profits des énergéticiens",
    ],
    agenda: "résultats trimestriels fin avril, fin juillet, fin octobre et début février",
  },
  {
    sym: "AI.PA", nom: "Air Liquide", court: "Air Liquide", couleur: "#1baf7a",
    secteur: "Chimie — gaz industriels et médicaux", siege: "Paris",
    desc: "Leader mondial des gaz industriels (oxygène, azote, hydrogène) et des gaz médicaux. Ses revenus reposent sur des contrats de long terme avec les industriels, ce qui les rend très récurrents.",
    role: "valeur défensive à faible volatilité qui stabilise le portefeuille",
    facteurs: [
      "Production industrielle en Europe, aux États-Unis et en Chine : elle détermine la consommation de gaz industriels",
      "Prix de l'énergie : les hausses sont répercutées aux clients, mais avec retard",
      "Électronique et semi-conducteurs : un client important et en croissance",
      "Projets hydrogène et subventions publiques à la transition énergétique",
      "Taux d'intérêt : comme valeur défensive et régulière, le titre est comparé aux placements obligataires",
    ],
    agenda: "chiffre d'affaires du 1er trimestre fin avril, résultats semestriels fin juillet, chiffre d'affaires du 3e trimestre fin octobre, résultats annuels mi-février",
  },
  {
    sym: "DSY.PA", nom: "Dassault Systèmes", court: "Dassault Syst.", couleur: "#eda100",
    secteur: "Logiciels — conception 3D, PLM, simulation", siege: "Vélizy-Villacoublay",
    desc: "Éditeur des logiciels CATIA, SOLIDWORKS et de la plateforme 3DEXPERIENCE, utilisés dans l'aéronautique, l'automobile et les sciences de la vie. Son modèle repose sur des abonnements récurrents.",
    role: "exposition technologique, assez corrélée à Capgemini",
    facteurs: [
      "Budgets de recherche et développement des industriels (automobile, aéronautique, santé)",
      "Valeurs technologiques américaines (Nasdaq) : le titre suit souvent leur humeur",
      "Taux d'intérêt longs : valeur de croissance chère, sensible à leur hausse",
      "Euro/dollar : une part importante du chiffre d'affaires est réalisée en Amérique du Nord",
      "Prévisions annuelles (« guidance ») : une révision à la baisse peut faire chuter le titre de 10 % ou plus en une séance",
    ],
    agenda: "résultats trimestriels fin avril, fin juillet, fin octobre et début février",
  },
  {
    sym: "CAP.PA", nom: "Capgemini", court: "Capgemini", couleur: "#e87ba4",
    secteur: "Services informatiques — conseil, intégration, IA", siege: "Paris",
    desc: "Entreprise de services numériques présente dans plus de 50 pays : conseil, transformation numérique, cloud, data et intelligence artificielle. Son activité est cyclique : elle suit les budgets informatiques des grandes entreprises.",
    role: "exposition technologique cyclique, assez corrélée à Dassault Systèmes",
    facteurs: [
      "Budgets informatiques des grandes entreprises, qui suivent la conjoncture en Europe et aux États-Unis",
      "Publications d'Accenture, le grand concurrent américain : elles donnent le ton pour tout le secteur",
      "Intelligence artificielle générative : source de nouveaux contrats, mais aussi crainte d'automatisation des services",
      "Euro/dollar : l'Amérique du Nord est un marché important",
      "Acquisitions : les rachats d'autres sociétés modifient le profil et peuvent peser sur le cours à court terme",
    ],
    agenda: "chiffre d'affaires du 1er trimestre fin avril, résultats semestriels fin juillet, chiffre d'affaires du 3e trimestre fin octobre, résultats annuels mi-février",
  },
];
const COULEUR_CASH = "#c3c2b7";

/* ---------- Facteurs de marché (influencent les cours) ---------- */
const FACTEURS = [
  { sym: "^FCHI", nom: "CAC 40", fmt: v => Math.round(v).toLocaleString("fr-FR") + " pts",
    pourquoi: "Le marché parisien dans son ensemble : quand il baisse, presque tous les titres baissent avec lui." },
  { sym: "^GSPC", nom: "S&P 500 (Wall Street)", fmt: v => Math.round(v).toLocaleString("fr-FR") + " pts",
    pourquoi: "Wall Street donne souvent le ton à Paris, surtout en fin de séance européenne." },
  { sym: "^IXIC", nom: "Nasdaq (tech US)", fmt: v => Math.round(v).toLocaleString("fr-FR") + " pts",
    pourquoi: "Humeur des valeurs technologiques : surtout utile pour Dassault Systèmes et Capgemini." },
  { sym: "BZ=F", nom: "Pétrole Brent", fmt: v => num(v, 2) + " $",
    pourquoi: "Un baril plus cher profite à TotalEnergies mais augmente les coûts de l'industrie." },
  { sym: "EURUSD=X", nom: "Euro / dollar", fmt: v => num(v, 4) + " $",
    pourquoi: "Un euro qui monte réduit la valeur en euros des ventes faites en dollars (Hermès, Dassault, Capgemini, TotalEnergies)." },
  { sym: "^TNX", nom: "Taux US à 10 ans", fmt: v => num(v, 2) + " %", points: true,
    pourquoi: "Des taux plus hauts rendent les obligations plus attirantes et pèsent sur les valeurs de croissance chères (Hermès, Dassault)." },
  { sym: "^VIX", nom: "VIX (« indice de la peur »)", fmt: v => num(v, 1), points: true,
    pourquoi: "Nervosité anticipée des marchés : sous 15, marché calme ; au-dessus de 25, fortes baisses plus probables." },
];
let facteurs = null; // { [sym]: { prix, j1, s1, corr: [N], beta: [N] } }
let actus = {}, actusMaj = 0, actusErreur = null;
const INDICE = "^FCHI";
const N = TITRES.length;

/* ---------- Questionnaire client ---------- */
const QUESTIONNAIRE = [
  ["A-t-il déjà investi en Bourse ?", "Oui", "Interface experte : indicateurs techniques et ordres libres"],
  ["Durée d'investissement envisagée", "1 an", "Horizon de 12 mois : rendements annualisés, objectif suivi sur 1 an"],
  ["Revenus réguliers ou croissance du capital ?", "Croissance du capital, allers-retours", "Aucun critère de dividende ; signaux d'achat/vente de court terme"],
  ["Gain espéré", "10 %", "Contrainte : rendement espéré ≥ 10 % par an dans l'optimisation"],
  ["Risque élevé ou faible ?", "Élevé", "Jusqu'à 35 % par titre, peu de liquidités, choix au meilleur ratio de Sharpe"],
  ["Préférences en actions ?", "Non (univers : Hermès, TotalEnergies, Air Liquide, Dassault Systèmes, Capgemini)", "Pas de contrainte sectorielle ; poids décidés par le couple rendement/risque"],
  ["Argent disponible ?", "Oui", "Tout le capital est investissable"],
  ["Besoin de récupérer des fonds avant l'échéance ?", "Non", "Aucune réserve de précaution supplémentaire"],
  ["Somme, en une fois ou par versements ?", "Le maximum : 500 000 € en une fois", "Capital de 500 000 € investi en une fois (validation de la répartition)"],
  ["Perte maximale acceptable", "10 % sur une semaine", "Contrainte VaR 99 % hebdomadaire ≤ 10 %, jauge et alertes"],
  ["Suivi lui-même ou délégation ?", "Lui-même", "Tableau de bord, ordres en direct, conseils"],
  ["Comment valider les placements ?", "Répartition uniquement, avec justifications", "Onglet « Répartition » : chaque poids est justifié"],
  ["Souhaite-t-il des informations ?", "Oui, un onglet Infos", "Onglet « Infos & profil » : fiches sociétés, facteurs qui influencent la Bourse, actualités, événements à surveiller, lexique"],
  ["Anticipation sur combien de jours ?", "Une semaine", "Prévisions à 5 séances (fourchettes, probabilités, VaR)"],
  ["Décisions d'achat et de vente ?", "Quand il veut, instantané", "Ordres exécutés immédiatement au dernier cours"],
  ["Particulier ou professionnel ?", "Particulier", "Frais de particulier (courtage + TTF), explications pédagogiques"],
  ["Garder une partie de l'argent non placée ?", "Oui", "Poche de liquidités minimale (10 % par défaut)"],
  ["Interface personnalisée et dynamique ?", "Oui, avec des conseils", "Conseils recalculés à chaque actualisation (toutes les 60 s)"],
];

/* ---------- État persistant ---------- */
const CLE = "logiciel_dupont_v1";
const PARAMS_DEFAUT = { capital: 500000, objectif: 10, perte: 10, cash: 10, wmax: 35, courtage: 0.10, ttf: 0.4 };

function nouveauPortefeuille(params = PARAMS_DEFAUT) {
  return { params: { ...params }, cash: params.capital, capitalInitial: params.capital, positions: {}, ordres: [], debut: Date.now(), semaine: null };
}
function charger() {
  try { const e = JSON.parse(localStorage.getItem(CLE)); if (e && e.params) return e; } catch (_) {}
  return null;
}
function sauver() { localStorage.setItem(CLE, JSON.stringify(etat)); }
let etat = charger() || nouveauPortefeuille();

/* ---------- Données de marché ---------- */
let marche = {};    // sym -> { dates, closes, meta, prix, veille }
let analyse = null; // statistiques, covariance, optimisation
let derniereMaj = null, erreurDonnees = null;

/* Version en ligne (GitHub Pages) : pas de serveur Python, on lit les fichiers data/ générés
   par generer_donnees.py (rafraîchis automatiquement par GitHub Actions) */
const EN_LIGNE = !["localhost", "127.0.0.1", ""].includes(location.hostname);
const nomFichier = sym => sym.replace(/[^A-Za-z0-9.]/g, "_") + ".json";

async function chargerTitre(sym) {
  const url = EN_LIGNE ? `data/chart/${nomFichier(sym)}?v=${Math.floor(Date.now() / 60000)}`
    : `/api/chart?symbol=${encodeURIComponent(sym)}&range=1y&interval=1d`;
  // une nouvelle tentative si la connexion échoue ponctuellement
  const r = await fetch(url).catch(() => new Promise(ok => setTimeout(ok, 800)).then(() => fetch(url)));
  if (!r.ok) throw new Error(`${sym} : HTTP ${r.status}`);
  const j = await r.json();
  const res = j.chart && j.chart.result && j.chart.result[0];
  if (!res) throw new Error(`${sym} : réponse vide`);
  const ts = res.timestamp || [], cl = res.indicators.quote[0].close || [];
  const dates = [], closes = [];
  ts.forEach((t, i) => { if (cl[i] != null) { dates.push(jourParis(t * 1000)); closes.push(cl[i]); } });
  const meta = res.meta, prix = meta.regularMarketPrice ?? closes[closes.length - 1];
  const jourCotation = jourParis((meta.regularMarketTime || 0) * 1000);
  let veille;
  if (dates[dates.length - 1] === jourCotation) { closes[closes.length - 1] = prix; veille = closes[closes.length - 2]; }
  else veille = closes[closes.length - 1];
  return { dates, closes, meta, prix, veille };
}

async function actualiser() {
  setEtat("Actualisation…", "");
  try {
    const syms = [...TITRES.map(t => t.sym), INDICE];
    const res = await Promise.all(syms.map(chargerTitre));
    syms.forEach((s, i) => marche[s] = res[i]);
    derniereMaj = new Date(); erreurDonnees = null;
    analyser();
    majSemaine();
  } catch (e) {
    erreurDonnees = e.message || String(e);
  }
  await chargerFacteurs();
  rendre();
}

/* Les facteurs sont facultatifs : une erreur ici n'empêche pas le reste de fonctionner */
async function chargerFacteurs() {
  const autres = FACTEURS.map(f => f.sym).filter(s => s !== INDICE);
  const res = await Promise.allSettled(autres.map(chargerTitre));
  res.forEach((r, i) => { if (r.status === "fulfilled") marche[autres[i]] = r.value; });
  if (analyse) analyserFacteurs();
}

/* Variations récentes et lien statistique (corrélation, bêta) entre chaque facteur et chaque titre */
function analyserFacteurs() {
  const out = {};
  FACTEURS.forEach(f => {
    const m = marche[f.sym]; if (!m || m.closes.length < 30) return;
    const n = m.closes.length, P = m.prix;
    const ecart = ref => f.points ? P - ref : P / ref - 1;
    const idx = new Map(m.dates.map((d, i) => [d, i]));
    const corr = [], beta = [];
    TITRES.forEach((t, i) => {
      // rendements du même jour, uniquement sur les séances où les deux cotent
      const x = [], y = [], d = analyse.dates, p = analyse.prix[i];
      for (let k = 1; k < d.length; k++) {
        const a = idx.get(d[k - 1]), b = idx.get(d[k]);
        if (a == null || b == null) continue;
        x.push(m.closes[b] / m.closes[a] - 1); y.push(p[k] / p[k - 1] - 1);
      }
      const mx = x.reduce((s, v) => s + v, 0) / x.length, my = y.reduce((s, v) => s + v, 0) / y.length;
      let sxy = 0, sxx = 0, syy = 0;
      x.forEach((v, k) => { sxy += (v - mx) * (y[k] - my); sxx += (v - mx) ** 2; syy += (y[k] - my) ** 2; });
      corr.push(sxx && syy ? sxy / Math.sqrt(sxx * syy) : 0);
      beta.push(sxx ? sxy / sxx : 0);
    });
    out[f.sym] = { prix: P, j1: ecart(m.veille), s1: ecart(m.closes[Math.max(0, n - 6)]), corr, beta };
  });
  facteurs = out;
}

async function chargerActus() {
  if (Date.now() - actusMaj < 15 * 60000) return;
  actusMaj = Date.now();
  const res = await Promise.allSettled(TITRES.map(t => fetch(EN_LIGNE ? `data/actus/${nomFichier(t.sym)}?v=${Math.floor(Date.now() / 60000)}` : `/api/actus?symbol=${encodeURIComponent(t.sym)}`).then(r => r.ok ? r.json() : Promise.reject(new Error("HTTP " + r.status)))));
  res.forEach((r, i) => { if (r.status === "fulfilled") actus[TITRES[i].sym] = r.value.actus; });
  actusErreur = res.every(r => r.status === "rejected") ? "actualités indisponibles" : null;
  if (actusErreur) actusMaj = Date.now() - 14 * 60000; // nouvel essai dans 1 minute
  rendreActus();
}

function jourParis(ms) {
  return new Intl.DateTimeFormat("fr-CA", { timeZone: "Europe/Paris", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(ms));
}

/* Aligne les séries sur les dates communes puis lance les calculs */
function analyser() {
  const communs = TITRES.map(t => new Set(marche[t.sym].dates))
    .reduce((a, b) => new Set([...a].filter(x => b.has(x))));
  const dates = [...communs].sort();
  const prix = TITRES.map(t => {
    const m = marche[t.sym], idx = new Map(m.dates.map((d, i) => [d, i]));
    return dates.map(d => m.closes[idx.get(d)]);
  });
  const stats = prix.map(Finance.statsTitre);
  const C = Finance.covariance(prix.map(Finance.rendements));
  const corr = Finance.correlation(C);
  const mu = stats.map(s => s.mu);
  const p = etat.params, cashMin = p.cash / 100;
  const opt = Finance.optimiser(mu, C, {
    cashMin, wMax: Math.max(p.wmax / 100, (1 - cashMin) / N + 0.01),
    perteMax: p.perte / 100, objectif: p.objectif / 100,
  });
  const signaux = TITRES.map((t, i) => Finance.signal(stats[i], marche[t.sym].prix));
  analyse = { dates, prix, stats, C, corr, mu, opt, signaux };
}

/* ---------- Valorisation ---------- */
const prixDe = sym => marche[sym] ? marche[sym].prix : 0;
const qteDe = sym => (etat.positions[sym] || {}).qte || 0;
function valeurTitres() { return TITRES.reduce((s, t) => s + qteDe(t.sym) * prixDe(t.sym), 0); }
function valeurTotale() { return etat.cash + valeurTitres(); }
function poidsActuels() { const V = valeurTotale(); return TITRES.map(t => qteDe(t.sym) * prixDe(t.sym) / V); }
const estInvesti = () => TITRES.some(t => qteDe(t.sym) > 0);

/* Référence hebdomadaire : valeur du portefeuille à la clôture de la semaine précédente */
function cleSemaine(d = new Date()) {
  const j = new Date(jourParis(d.getTime()) + "T00:00:00");
  j.setDate(j.getDate() - ((j.getDay() + 6) % 7));
  return `${j.getFullYear()}-${String(j.getMonth() + 1).padStart(2, "0")}-${String(j.getDate()).padStart(2, "0")}`;
}
function majSemaine() {
  const cle = cleSemaine();
  if (etat.semaine && etat.semaine.cle === cle) return;
  let ref = etat.cash;
  TITRES.forEach(t => {
    const m = marche[t.sym]; if (!m) return;
    let pRef = m.prix;
    for (let i = m.dates.length - 1; i >= 0; i--) if (m.dates[i] < cle) { pRef = m.closes[i]; break; }
    ref += qteDe(t.sym) * pRef;
  });
  etat.semaine = { cle, valeurRef: ref };
  sauver();
}
const variationSemaine = () => etat.semaine ? valeurTotale() / etat.semaine.valeurRef - 1 : 0;

/* ---------- Ordres ---------- */
function frais(sens, montant) {
  const p = etat.params;
  const courtage = montant * p.courtage / 100;
  const ttf = sens === "achat" ? montant * p.ttf / 100 : 0;
  return { courtage, ttf, total: courtage + ttf };
}

function executer(sym, sens, qte) {
  qte = Math.floor(qte);
  const P = prixDe(sym), t = TITRES.find(x => x.sym === sym);
  if (!P) return { ok: false, msg: "Cours indisponible." };
  if (qte <= 0) return { ok: false, msg: "Quantité nulle." };
  const montant = qte * P, f = frais(sens, montant);
  const pos = etat.positions[sym] || { qte: 0, pru: 0 };
  let pv = null;
  if (sens === "achat") {
    const cout = montant + f.total;
    if (cout > etat.cash + 1e-6) return { ok: false, msg: `Liquidités insuffisantes (${eur(cout)} nécessaires, ${eur(etat.cash)} disponibles).` };
    pos.pru = (pos.pru * pos.qte + cout) / (pos.qte + qte);
    pos.qte += qte;
    etat.cash -= cout;
  } else {
    if (qte > pos.qte) return { ok: false, msg: `Vous ne détenez que ${pos.qte} titre(s) ${t.court}.` };
    const net = montant - f.total;
    pv = net - pos.pru * qte;
    pos.qte -= qte;
    etat.cash += net;
    if (pos.qte === 0) pos.pru = 0;
  }
  etat.positions[sym] = pos;
  etat.ordres.unshift({ date: Date.now(), sym, sens, qte, prix: P, frais: f.total, total: sens === "achat" ? montant + f.total : montant - f.total, pv });
  sauver();
  return { ok: true, msg: `${sens === "achat" ? "Achat" : "Vente"} de ${qte} ${t.court} à ${eur(P)} exécuté (frais ${eur(f.total)}).` };
}

function ordresVersCible(poidsCible) {
  const V = valeurTotale(), p = etat.params;
  const fAchat = 1 + (p.courtage + p.ttf) / 100, fVente = 1 - p.courtage / 100;
  const prix = TITRES.map(t => prixDe(t.sym)), actuel = TITRES.map(t => qteDe(t.sym));
  // 1re passe : nombre entier d'actions qui tient dans l'enveloppe de chaque titre (frais inclus)
  // Tolérance : un écart inférieur à 0,5 % du portefeuille ne justifie pas de payer des frais
  const seuil = 0.005 * V;
  const cible = TITRES.map((t, i) => {
    const q = Math.floor(poidsCible[i] * V / (prix[i] * fAchat));
    return Math.abs(q - actuel[i]) * prix[i] < seuil ? actuel[i] : q;
  });
  // Coût en liquidités d'une action de plus : achat avec frais, ou vente évitée nette de frais
  const coutUne = i => prix[i] * (cible[i] < actuel[i] ? fVente : fAchat);
  let cash = etat.cash + TITRES.reduce((s, t, i) => {
    const d = cible[i] - actuel[i];
    return s - (d > 0 ? d * prix[i] * fAchat : d * prix[i] * fVente);
  }, 0);
  // 2e passe : les reliquats d'arrondi achètent des actions supplémentaires, en commençant par le titre
  // le plus en retard sur sa cible, tant que la réserve conseillée et le poids maximal sont respectés.
  // Seuls les titres déjà achetés dans cette opération sont complétés (pas de petit ordre isolé).
  const reserve = V * (1 - poidsCible.reduce((s, w) => s + w, 0));
  const wMax = i => Math.max(p.wmax / 100, poidsCible[i]);
  for (;;) {
    const candidats = TITRES.map((t, i) => i).filter(i => prix[i] > 0 && cible[i] > actuel[i]
      && cash - coutUne(i) >= reserve - 1e-6 && (cible[i] + 1) * prix[i] <= wMax(i) * V);
    if (!candidats.length) break;
    const retard = i => poidsCible[i] * V - cible[i] * prix[i];
    const i = candidats.reduce((a, b) => retard(b) > retard(a) ? b : a);
    cash -= coutUne(i);
    cible[i]++;
  }
  const ordres = [];
  TITRES.forEach((t, i) => {
    const diff = cible[i] - actuel[i];
    if (diff !== 0) ordres.push({ sym: t.sym, sens: diff > 0 ? "achat" : "vente", qte: Math.abs(diff) });
  });
  return ordres.sort((a, b) => (a.sens === "vente" ? -1 : 1) - (b.sens === "vente" ? -1 : 1));
}

/* ---------- Formatage ---------- */
const fmtEur = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 2 });
const fmtEur0 = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
const eur = x => fmtEur.format(x);
const eur0 = x => fmtEur0.format(x);
const pct = (x, d = 1, signe = false) => (signe && x > 0 ? "+" : "") + (x * 100).toFixed(d).replace(".", ",") + " %";
const num = (x, d = 2) => x.toFixed(d).replace(".", ",");
const classeSigne = x => x > 0 ? "hausse" : x < 0 ? "baisse" : "";
const $ = id => document.getElementById(id);
const melange = (a, b, k) => "#" + [0, 2, 4].map(o => Math.round(parseInt(a.substr(o + 1, 2), 16) * (1 - k) + parseInt(b.substr(o + 1, 2), 16) * k).toString(16).padStart(2, "0")).join("");
/* Remplace le contenu sans refermer les sections <details> ouvertes */
function avecDetails(id, html) {
  const el = $(id), ouverts = [...el.querySelectorAll("details")].map(d => d.open);
  el.innerHTML = html;
  el.querySelectorAll("details").forEach((d, i) => { if (ouverts[i]) d.open = true; });
}
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

/* ---------- Statut de marché ---------- */
function marcheOuvert() {
  const f = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Paris", weekday: "short", hour: "2-digit", minute: "2-digit", hour12: false }).formatToParts(new Date());
  const g = k => f.find(x => x.type === k).value;
  const j = g("weekday"), m = parseInt(g("hour")) * 60 + parseInt(g("minute"));
  return !["Sat", "Sun"].includes(j) && m >= 540 && m < 1050;
}
function setEtat(txt, cls) { const e = $("etat-donnees"); e.textContent = txt; e.className = "pastille " + cls; }

/* ---------- Graphiques ---------- */
Chart.defaults.font.family = 'system-ui, -apple-system, "Segoe UI", sans-serif';
Chart.defaults.color = "#52514e";
Chart.defaults.animation = false;
Chart.defaults.plugins.legend.labels.boxWidth = 10;
Chart.defaults.plugins.legend.labels.boxHeight = 10;
Chart.defaults.plugins.tooltip.backgroundColor = "#ffffff";
Chart.defaults.plugins.tooltip.titleColor = "#0b0b0b";
Chart.defaults.plugins.tooltip.bodyColor = "#52514e";
Chart.defaults.plugins.tooltip.borderColor = "rgba(11,11,11,0.12)";
Chart.defaults.plugins.tooltip.borderWidth = 1;
Chart.defaults.plugins.tooltip.padding = 8;
const AXE_Y = { grid: { color: "#e1e0d9" }, border: { display: false }, ticks: { color: "#898781" } };
const AXE_X = { grid: { display: false }, border: { color: "#c3c2b7" }, ticks: { color: "#898781", maxTicksLimit: 8, maxRotation: 0 } };
const graphs = {};
function graph(id, config) {
  if (graphs[id]) graphs[id].destroy();
  const c = $(id); if (!c) return;
  graphs[id] = new Chart(c, config);
}
const ligne = (label, data, couleur, extra = {}) => ({
  label, data, borderColor: couleur, backgroundColor: couleur, borderWidth: 2, pointRadius: 0, pointHoverRadius: 4, tension: 0.15, ...extra,
});
const optionsLigne = (fmtY, extra = {}) => ({
  responsive: true, maintainAspectRatio: false,
  interaction: { mode: "index", intersect: false },
  scales: { x: AXE_X, y: { ...AXE_Y, ticks: { ...AXE_Y.ticks, callback: fmtY } } },
  plugins: { legend: { position: "top", align: "start" }, tooltip: { callbacks: { label: c => ` ${c.dataset.label} : ${fmtY(c.parsed.y)}` } } },
  ...extra,
});
const dateCourte = d => d.slice(8, 10) + "/" + d.slice(5, 7);

/* ---------- Infobulle HTML (barres empilées) ---------- */
document.addEventListener("mousemove", e => {
  const cible = e.target.closest("[data-tip]"), tip = $("tooltip");
  if (!cible) { tip.style.display = "none"; return; }
  tip.innerHTML = cible.dataset.tip;
  tip.style.display = "block";
  const x = Math.min(e.clientX + 14, window.innerWidth - tip.offsetWidth - 8);
  tip.style.left = x + "px"; tip.style.top = (e.clientY + 14) + "px";
});

function barreEmpilee(conteneur, legende, poids, cash) {
  const segments = TITRES.map((t, i) => ({ nom: t.court, w: poids[i], c: t.couleur })).concat([{ nom: "Liquidités", w: cash, c: COULEUR_CASH }]);
  $(conteneur).innerHTML = segments.filter(s => s.w > 0.0005).map(s =>
    `<div style="flex:${s.w};background:${s.c}" data-tip="<b>${s.nom}</b><br>${pct(s.w)}"></div>`).join("");
  $(legende).innerHTML = segments.map(s => `<span><i class="puce" style="background:${s.c}"></i>${s.nom} ${pct(s.w)}</span>`).join("");
}

/* =====================================================================
   RENDU
   ===================================================================== */
function rendre() {
  const ouvert = marcheOuvert();
  if (erreurDonnees) setEtat("Cours indisponibles", "ko");
  else if (derniereMaj) setEtat(`${ouvert ? "Bourse ouverte" : "Bourse fermée"} · cours à ${derniereMaj.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}`, ouvert ? "ok" : "ferme");

  rendreProfil();
  if (!analyse) {
    const msg = !erreurDonnees ? `<div class="kpi">Chargement des cours réels…</div>` : `<div class="bandeau-erreur">Impossible de charger les cours (${esc(erreurDonnees || "…")}). Vérifiez votre connexion internet et que l'application est lancée via <b>python3 serveur.py</b>, puis cliquez sur « Actualiser ».</div>`;
    $("kpis").innerHTML = msg;
    return;
  }
  const actif = document.querySelector(".panneau.actif").id;
  rendreTableau(actif === "tableau");
  rendreRepartition(actif === "repartition");
  rendreMarche(actif === "marche");
  rendrePrevision(actif === "prevision");
  rendreInfos();
}

/* ---------- Tableau de bord ---------- */
function rendreTableau(avecGraph) {
  const V = valeurTotale(), p = etat.params;
  const perf = V / etat.capitalInitial - 1, sem = variationSemaine();
  const varJour = TITRES.reduce((s, t) => s + qteDe(t.sym) * (prixDe(t.sym) - marche[t.sym].veille), 0);
  const kpis = [
    ["Valeur", eur0(V), `investi : ${eur0(etat.capitalInitial)}`],
    ["Gain total", `<span class="${classeSigne(perf)}">${pct(perf, 2, true)}</span>`, eur0(V - etat.capitalInitial)],
    ["Aujourd'hui", `<span class="${classeSigne(varJour)}">${pct(varJour / V, 2, true)}</span>`, eur0(varJour)],
    ["Liquidités", eur0(etat.cash), `${pct(etat.cash / V)} du portefeuille`],
  ];
  $("kpis").innerHTML = kpis.map(([l, v, d]) => `<div class="kpi"><div class="lib">${l}</div><div class="val">${v}</div><div class="det">${d}</div></div>`).join("");

  // Jauge hebdomadaire : de 0 à -limite
  const lim = p.perte / 100, ratio = Math.max(0, -sem) / lim;
  const coulJ = ratio >= 1 ? "var(--critique)" : ratio >= 0.8 ? "var(--alerte)" : ratio >= 0.5 ? "var(--vigilance)" : "var(--bon)";
  const statutJ = ratio >= 1 ? "Limite dépassée" : ratio >= 0.8 ? "Proche de la limite" : ratio >= 0.5 ? "Vigilance" : sem >= 0 ? "Semaine positive" : "Dans la tolérance";
  $("jauge-hebdo").innerHTML = `<div class="jauge">
      <div class="grand ${classeSigne(sem)}">${pct(sem, 2, true)}</div>
      <div class="aide">${statutJ} · limite : −${p.perte} %</div>
      <div class="piste"><div class="rempli" style="left:0;width:${Math.min(ratio, 1) * 100}%;background:${coulJ}"></div></div>
      <div class="echelle"><span>0 %</span><span>−${p.perte / 2} %</span><span>−${p.perte} %</span></div></div>`;

  // Jauge objectif
  const jours = (Date.now() - etat.debut) / 864e5, proRata = p.objectif / 100 * Math.min(jours / 365, 1);
  const avance = Math.max(0, Math.min(perf / (p.objectif / 100), 1));
  $("jauge-objectif").innerHTML = `<div class="jauge">
      <div class="grand ${classeSigne(perf)}">${pct(perf, 2, true)}</div>
      <div class="aide">Objectif +${p.objectif} % · jour ${Math.floor(jours) + 1}/365 · attendu à ce stade : ${pct(proRata, 2, true)}</div>
      <div class="piste"><div class="rempli" style="left:0;width:${avance * 100}%;background:var(--accent)"></div>
        <div class="repere" style="left:${Math.min(jours / 365, 1) * 100}%" title="Prorata temporel"></div></div>
      <div class="echelle"><span>0 %</span><span>+${p.objectif / 2} %</span><span>+${p.objectif} %</span></div></div>`;

  rendreConseils();

  // Composition
  const w = poidsActuels();
  barreEmpilee("compo-barre", "compo-legende", w, etat.cash / V);
  const lignes = TITRES.filter(t => qteDe(t.sym) > 0).map(t => {
    const pos = etat.positions[t.sym], val = pos.qte * prixDe(t.sym), pv = val - pos.qte * pos.pru;
    return `<tr><td><i class="puce" style="background:${t.couleur}"></i>${t.court}</td><td class="num">${pos.qte}</td>
      <td class="num">${eur0(val)}</td><td class="num ${classeSigne(pv)}">${pct(pv / (pos.qte * pos.pru), 1, true)}</td></tr>`;
  });
  $("table-positions").innerHTML = lignes.length
    ? `<tr><th>Titre</th><th class="num">Qté</th><th class="num">Valeur</th><th class="num">Gain</th></tr>${lignes.join("")}`
    : `<tr><td class="aide">Rien d'investi pour l'instant. Validez la répartition conseillée pour commencer.</td></tr>`;

  if (avecGraph) graphValeur();
}

function graphValeur() {
  const { dates, prix, opt } = analyse;
  const debut = Math.max(0, dates.length - 126);
  const ds = dates.slice(debut);
  const cac = marche[INDICE], idxCac = new Map(cac.dates.map((d, i) => [d, cac.closes[i]]));
  const base = v => v.map(x => x / v[0] * 100);
  const series = [];
  if (estInvesti()) {
    const vals = ds.map((_, k) => etat.cash + TITRES.reduce((s, t, i) => s + qteDe(t.sym) * prix[i][debut + k], 0));
    series.push(ligne("Mon portefeuille", base(vals), "#2a78d6"));
  }
  const wC = opt.retenu.w;
  const valsC = ds.map((_, k) => opt.cash + TITRES.reduce((s, t, i) => s + wC[i] * prix[i][debut + k] / prix[i][debut], 0));
  series.push(ligne("Répartition conseillée", base(valsC), "#eb6834", estInvesti() ? { borderDash: [5, 4] } : {}));
  let derCac = null;
  const vCac = ds.map(d => (derCac = idxCac.get(d) ?? derCac));
  if (vCac[0]) series.push(ligne("CAC 40", base(vCac), "#898781", { borderWidth: 1.5 }));
  graph("graph-valeur", {
    type: "line", data: { labels: ds.map(dateCourte), datasets: series },
    options: optionsLigne(v => num(v, 1), {
      plugins: {
        legend: { position: "top", align: "start" },
        title: { display: true, text: "Base 100, avec les poids actuels", align: "start", color: "#898781", font: { weight: "normal", size: 12 } },
        tooltip: { callbacks: { label: c => ` ${c.dataset.label} : ${num(c.parsed.y, 1)}` } },
      },
    }),
  });
}

/* ---------- Moteur de conseils ---------- */
/* Raisons du signal en langage courant (le détail technique reste dans l'onglet Ordres) */
function enClair(i) {
  const s = analyse.stats[i], P = prixDe(TITRES[i].sym), r = [];
  if (P > s.mm20 && s.mm20 > s.mm50) r.push("tendance haussière");
  else if (P < s.mm20 && s.mm20 < s.mm50) r.push("tendance baissière");
  else r.push("tendance hésitante");
  if (s.rsi !== null && s.rsi < 30) r.push("forte baisse récente, un rebond est possible");
  if (s.rsi !== null && s.rsi > 70) r.push("forte hausse récente, un repli est possible");
  if (s.mom5 > 0.02) r.push("en nette hausse cette semaine");
  if (s.mom5 < -0.02) r.push("en net recul cette semaine");
  const t = r.join(", ");
  return t.charAt(0).toUpperCase() + t.slice(1);
}

function genererConseils() {
  const c = [], p = etat.params, V = valeurTotale();
  const { opt, signaux, stats } = analyse;
  const sem = variationSemaine(), lim = p.perte / 100;
  const w = poidsActuels(), cashW = etat.cash / V;

  if (!estInvesti()) {
    c.push(["info", "i", "Capital non investi", `Vos ${eur0(V)} sont en liquidités. Consultez l'onglet « Répartition » : vous pouvez valider la répartition proposée en un clic.`]);
  }
  if (-sem >= lim) c.push(["critique", "!", "Limite de perte hebdomadaire atteinte", `Le portefeuille perd ${pct(-sem, 2)} depuis lundi, au-delà de votre tolérance de ${p.perte} %. Réduisez votre exposition : vendez les titres au signal « Alléger » ou renforcez les liquidités.`]);
  else if (-sem >= 0.8 * lim) c.push(["alerte", "!", "Proche de la limite hebdomadaire", `La perte depuis lundi atteint ${pct(-sem, 2)}, soit plus de 80 % de votre tolérance. Préparez un allègement si la baisse continue.`]);
  else if (-sem >= 0.5 * lim) c.push(["vigilance", "!", "Semaine difficile", `Le portefeuille recule de ${pct(-sem, 2)} depuis lundi, soit la moitié de votre tolérance de ${p.perte} %.`]);

  if (estInvesti()) {
    if (cashW < p.cash / 100 - 0.01) c.push(["vigilance", "€", "Liquidités sous le minimum", `Les liquidités représentent ${pct(cashW)} du portefeuille, sous votre seuil de ${p.cash} %. Pensez à reconstituer cette réserve.`]);
    if (cashW > opt.cash + 0.15) c.push(["info", "€", "Liquidités abondantes", `${pct(cashW)} du portefeuille ne sont pas placés. Les titres au signal « Acheter » sont des pistes pour les investir.`]);
    const ecarts = TITRES.map((t, i) => ({ t, e: w[i] - opt.retenu.w[i] })).filter(x => Math.abs(x.e) > 0.05);
    if (ecarts.length) c.push(["vigilance", "⇄", "Rééquilibrage conseillé",
      ecarts.map(x => `${x.t.court} ${x.e > 0 ? "−" : "+"}${eur0(Math.abs(x.e) * V)}`).join(" · ") +
      `. Le portefeuille s'écarte de plus de 5 points de la répartition conseillée. Pour l'appliquer en un clic : onglet « Répartition ».`]);
    TITRES.forEach((t, i) => {
      if (w[i] > p.wmax / 100 + 0.02) c.push(["alerte", "!", `Concentration excessive : ${t.court}`, `${pct(w[i])} du portefeuille sur un seul titre, au-delà du maximum de ${p.wmax} %.`]);
    });
  }

  TITRES.forEach((t, i) => {
    const s = signaux[i], detenu = qteDe(t.sym) > 0;
    if (s.niveau === "bon") c.push(["bon", "↑", `${t.court} : signal d'achat`, `${enClair(i)}. ${detenu ? "Renforcement possible" : "Point d'entrée possible"} dans la limite de ${p.wmax} % du portefeuille.`]);
    if (s.niveau === "alerte" && detenu) c.push(["alerte", "↓", `${t.court} : signal d'allègement`, `${enClair(i)}. ${prixDe(t.sym) >= etat.positions[t.sym].pru ? "Envisagez de prendre une partie de vos bénéfices." : "Envisagez de réduire la position pour limiter la perte."}`]);
    const pos = etat.positions[t.sym];
    if (detenu && pos.pru) {
      const pv = prixDe(t.sym) / pos.pru - 1;
      if (pv > 0.08 && stats[i].rsi > 65) c.push(["bon", "€", `${t.court} : prise de bénéfices possible`, `+${pct(pv)} sur votre prix d'achat et le titre a beaucoup monté récemment : objectif d'aller-retour atteint sur cette ligne.`]);
    }
  });

  const jours = (Date.now() - etat.debut) / 864e5;
  if (estInvesti() && jours > 7) {
    const perf = V / etat.capitalInitial - 1, prorata = p.objectif / 100 * Math.min(jours / 365, 1);
    c.push(perf >= prorata
      ? ["bon", "✓", "En avance sur l'objectif", `${pct(perf, 2, true)} contre ${pct(prorata, 2, true)} attendus au prorata.`]
      : ["info", "→", "En retard sur l'objectif", `${pct(perf, 2, true)} contre ${pct(prorata, 2, true)} attendus au prorata de l'objectif de ${p.objectif} %.`]);
  }
  if (facteurs) {
    const vix = facteurs["^VIX"], brent = facteurs["BZ=F"], fx = facteurs["EURUSD=X"];
    if (vix && vix.prix >= 35) c.push(["alerte", "!", "Marchés en panique", `Le VIX est à ${num(vix.prix, 1)} : les investisseurs anticipent de très fortes variations. Le risque de dépasser votre limite de ${p.perte} % par semaine est nettement plus élevé que d'habitude.`]);
    else if (vix && vix.prix >= 25) c.push(["vigilance", "!", "Marchés nerveux", `Le VIX est à ${num(vix.prix, 1)}, au-dessus de 25 : les fortes baisses sont plus probables. Évitez d'augmenter votre exposition dans la précipitation.`]);
    if (brent && Math.abs(brent.s1) >= 0.08) c.push(["info", "⛽", `Pétrole ${brent.s1 > 0 ? "en forte hausse" : "en forte baisse"}`, `Le Brent varie de ${pct(brent.s1, 1, true)} sur une semaine. TotalEnergies y est directement exposé${qteDe("TTE.PA") > 0 ? " : surveillez votre position" : ""}.`]);
    if (fx && Math.abs(fx.s1) >= 0.025) c.push(["info", "€", `Euro ${fx.s1 > 0 ? "en hausse" : "en baisse"} face au dollar`, `${pct(fx.s1, 1, true)} sur une semaine. ${fx.s1 > 0 ? "Défavorable" : "Favorable"} aux sociétés qui vendent beaucoup en dollars (Hermès, Dassault Systèmes, Capgemini).`]);
  }
  if (!marcheOuvert()) c.push(["info", "◷", "Marché fermé", "Euronext Paris est ouvert de 9 h à 17 h 30 en semaine. Vos ordres restent exécutables tout de suite, au dernier cours de clôture."]);
  if (!opt.objectifAtteint) c.push(["vigilance", "!", "Objectif ambitieux", `Avec les estimations actuelles, aucune répartition admissible n'atteint ${p.objectif} % de rendement espéré sans dépasser la limite de perte. La meilleure atteint ${pct(opt.retenu.rendement)}.`]);

  const ordre = { critique: 0, alerte: 1, vigilance: 2, bon: 3, info: 4 };
  return c.sort((a, b) => ordre[a[0]] - ordre[b[0]]);
}
function rendreConseils() {
  const tous = genererConseils(), max = 3;
  const li = ([niv, ico, titre, corps]) =>
    `<li class="niv-${niv}"><span class="ico" aria-hidden="true">${ico}</span><div><div class="titre">${esc(titre)}</div><div class="corps">${esc(corps)}</div></div></li>`;
  const reste = tous.slice(max);
  avecDetails("conseils", tous.slice(0, max).map(li).join("") +
    (reste.length ? `<li class="plus"><details><summary>${reste.length} autre(s) conseil(s)</summary><ul class="conseils">${reste.map(li).join("")}</ul></details></li>` : ""));
}

/* ---------- Répartition conseillée ---------- */
function justification(i) {
  const { stats, corr, opt, C } = analyse, s = stats[i], t = TITRES[i];
  const w = opt.retenu.w, rc = Finance.contributionsRisque(w, C)[i];
  const rangSharpe = [...stats].sort((a, b) => b.sharpe - a.sharpe).indexOf(s) + 1;
  const correlMoy = corr[i].reduce((a, c, j) => a + (j === i ? 0 : c), 0) / (N - 1);
  const jPlus = corr[i].map((c, j) => j === i ? -2 : c).reduce((b, c, j, arr) => c > arr[b] ? j : b, 0);
  const jMoins = corr[i].map((c, j) => j === i ? 2 : c).reduce((b, c, j, arr) => c < arr[b] ? j : b, 0);
  const moyW = (1 - opt.cash) / N;
  const rang = rangSharpe === 1 ? "meilleur" : rangSharpe + "ᵉ";
  const pourquoiGarde = corr[i][jMoins] < 0.1
    ? `il reste pour diversifier, car il évolue souvent indépendamment de ${TITRES[jMoins].court}`
    : `il reste pour garder au moins 5 % sur chaque titre`;
  const morceaux = [];
  if (w[i] >= moyW + 0.03) morceaux.push(`<b>Poids renforcé</b> : c'est le ${rang} titre du panier pour le gain obtenu par rapport au risque${correlMoy < 0.2 ? ", et il évolue indépendamment des autres" : ""}.`);
  else if (w[i] <= moyW - 0.05) morceaux.push(`<b>Poids réduit</b> : ${s.mu < 0 ? "gain espéré négatif" : s.sharpe < 0.3 ? "gain trop faible par rapport au risque" : "d'autres titres font mieux"}. Sa part est réduite, mais ${pourquoiGarde}.`);
  else morceaux.push(`<b>Poids intermédiaire</b> : ${rangSharpe}ᵉ titre sur ${N} pour le gain par rapport au risque. C'est un compromis entre gain et diversification.`);
  morceaux.push(`Gain espéré : ${pct(s.mu)} par an. Variations habituelles : environ ±${pct(s.sigma, 0)} sur un an.`);
  morceaux.push(`Il pèse ${pct(rc, 0)} du risque du portefeuille pour ${pct(w[i], 0)} du capital, et évolue surtout comme ${TITRES[jPlus].court}.`);
  morceaux.push(`Situation actuelle : ${enClair(i).toLowerCase()}.`);
  const role = t.role.charAt(0).toUpperCase() + t.role.slice(1) + ".";
  return `${role} <details><summary>Pourquoi ce poids ?</summary>${morceaux.join(" ")}</details>`;
}

function rendreRepartition(avecGraph) {
  const { opt, stats } = analyse, V = valeurTotale(), p = etat.params, r = opt.retenu;
  const sim = Finance.simulerSemaine(r.w, analyse.mu, analyse.C, p.perte / 100, 10000);
  const kpi = (l, v, d) => `<div class="kpi"><div class="lib">${l}</div><div class="val">${v}</div><div class="det">${d}</div></div>`;
  $("repart-resume").innerHTML = [
    kpi("Gain espéré sur 1 an", pct(r.rendement), opt.objectifAtteint ? `objectif ${p.objectif} % ✓` : `objectif ${p.objectif} % non atteint`),
    kpi("Perte possible sur 1 semaine", pct(r.var99s), `pire cas sur 100 · limite ${p.perte} % ${r.var99s <= p.perte / 100 ? "✓" : "✗"}`),
    kpi(`Risque de perdre plus de ${p.perte} %`, pct(sim.probDepasse, 2), "par semaine, d'après 10 000 simulations"),
  ].join("");

  barreEmpilee("repart-barre", "repart-legende", r.w, opt.cash);

  const lignes = TITRES.map((t, i) => {
    const montant = r.w[i] * V, P = prixDe(t.sym);
    return `<tr><td><i class="puce" style="background:${t.couleur}"></i><b>${t.court}</b></td><td class="num"><b>${pct(r.w[i])}</b></td>
      <td class="num">${eur0(montant)}</td><td class="num">${pct(qteDe(t.sym) * P / V)}</td><td class="justif">${justification(i)}</td></tr>`;
  });
  const cashJ = `Réserve demandée par le client : elle permet de saisir des opportunités et amortit les baisses.${opt.ajusteCash ? ` <b>Relevée de ${p.cash} % à ${pct(opt.cash, 0)}</b> pour respecter la limite de perte hebdomadaire.` : ""}`;
  lignes.push(`<tr><td><i class="puce" style="background:${COULEUR_CASH}"></i><b>Liquidités</b></td><td class="num"><b>${pct(opt.cash)}</b></td><td class="num">${eur0(opt.cash * V)}</td><td class="num">${pct(etat.cash / V)}</td><td class="justif">${cashJ}</td></tr>`);
  avecDetails("table-repart", `<tr><th>Ligne</th><th class="num">Conseillé</th><th class="num">Montant</th><th class="num">Actuel</th><th>Rôle</th></tr>${lignes.join("")}`);

  const ordres = ordresVersCible(r.w);
  $("repart-msg").textContent = ordres.length ? `${ordres.length} ordre(s) à passer pour atteindre la cible.` : "Votre portefeuille est déjà aligné sur la cible.";

  // Matrice de corrélation (divergente : bleu négatif, gris 0, rouge positif)
  const corr = analyse.corr;
  $("matrice-correl").innerHTML = `<table class="correl"><tr><th></th>${TITRES.map(t => `<th>${t.court}</th>`).join("")}</tr>${TITRES.map((t, i) =>
    `<tr><th style="text-align:right">${t.court}</th>${TITRES.map((u, j) => {
      const c = corr[i][j];
      if (i === j) return `<td style="background:#f0efec;color:#898781">1</td>`;
      const fond = melange("#f0efec", c >= 0 ? "#e34948" : "#2a78d6", Math.min(Math.abs(c), 1));
      return `<td style="background:${fond};color:${Math.abs(c) > 0.55 ? "#fff" : "#0b0b0b"}" data-tip="<b>${t.court} / ${u.court}</b><br>corrélation ${num(c)}">${num(c)}</td>`;
    }).join("")}</tr>`).join("")}</table>
    <div class="legende" style="margin-top:8px"><span><i class="puce" style="background:#2a78d6"></i>négative (diversifie)</span><span><i class="puce" style="background:#f0efec;border:1px solid #c3c2b7"></i>nulle</span><span><i class="puce" style="background:#e34948"></i>positive (diversifie peu)</span></div>`;

  $("methode").innerHTML = `
    <p><b>1. Données.</b> On utilise un an de cours de clôture journaliers réels (Yahoo Finance), alignés sur les séances communes aux cinq titres (${analyse.dates.length} séances).</p>
    <p><b>2. Estimation du rendement espéré.</b> La moyenne historique sur un an est très bruitée. On la « rétrécit » donc vers un a priori de long terme : μ = ${pct(Finance.POIDS_HISTO, 0)} × rendement historique annualisé + ${pct(1 - Finance.POIDS_HISTO, 0)} × ${pct(Finance.PRIOR_RENDEMENT, 0)} (prime de risque actions). Le risque est mesuré par la matrice de covariance annualisée (× 252).</p>
    <p><b>3. Contraintes issues du profil.</b> Liquidités ≥ ${p.cash} %. Chaque titre entre 5 % et ${p.wmax} % (diversification minimale, concentration acceptée pour un profil dynamique). Perte potentielle sur une semaine limitée à ${p.perte} % : VaR paramétrique 99 % = −(μ·5/252 − 2,33·σ·√(5/252)).</p>
    <p><b>4. Choix.</b> On simule 5 000 portefeuilles aléatoires (méthode de Monte-Carlo). Parmi ceux qui respectent la limite de perte et atteignent l'objectif de ${p.objectif} %, on retient celui qui a le <b>meilleur ratio de Sharpe</b>, c'est-à-dire le meilleur rendement par unité de risque. Si aucun n'atteint l'objectif, on retient le rendement espéré le plus élevé, et la poche de liquidités est relevée si nécessaire.</p>
    <p><b>5. Validation.</b> Le client valide la répartition. Les ordres sont calculés titre par titre, ventes d'abord puis achats, frais inclus.</p>`;

  if (avecGraph && $("det-analyse").open) {
    const adm = opt.nuage.filter(x => x.admissible), non = opt.nuage.filter(x => !x.admissible);
    const pt = x => ({ x: x.volatilite * 100, y: x.rendement * 100 });
    graph("graph-frontiere", {
      type: "scatter",
      data: { datasets: [
        { label: "Retenu", data: [pt(r)], backgroundColor: "#2a78d6", borderColor: "#fcfcfb", borderWidth: 2, pointRadius: 9, pointHoverRadius: 11 },
        { label: "Variance minimale", data: [pt(opt.minVar)], backgroundColor: "#eb6834", borderColor: "#fcfcfb", borderWidth: 2, pointRadius: 7, pointHoverRadius: 9 },
        { label: "Admissibles", data: adm.map(pt), backgroundColor: "rgba(137,135,129,0.35)", pointRadius: 2, pointHoverRadius: 4 },
        { label: "Hors limite de perte", data: non.map(pt), backgroundColor: "rgba(208,59,59,0.25)", pointRadius: 2, pointHoverRadius: 4 },
      ] },
      options: {
        responsive: true, maintainAspectRatio: false,
        scales: {
          x: { ...AXE_Y, title: { display: true, text: "Volatilité annuelle (%)", color: "#898781" }, ticks: { ...AXE_Y.ticks, callback: v => v + " %" } },
          y: { ...AXE_Y, title: { display: true, text: "Rendement espéré (%)", color: "#898781" }, ticks: { ...AXE_Y.ticks, callback: v => v + " %" } },
        },
        plugins: { legend: { position: "top", align: "start" }, tooltip: { callbacks: { label: c => ` ${c.dataset.label} : vol. ${num(c.parsed.x, 1)} %, rend. ${num(c.parsed.y, 1)} %` } } },
      },
    });
  }
}

/* ---------- Marché & ordres ---------- */
function rendreMarche(avecGraph) {
  const sel = $("ordre-titre");
  if (!sel.options.length) sel.innerHTML = TITRES.map(t => `<option value="${t.sym}">${t.court}</option>`).join("");
  majApercu();

  const { stats, signaux } = analyse;
  avecDetails("cartes-titres", TITRES.map((t, i) => {
    const m = marche[t.sym], s = stats[i], sg = signaux[i], vj = m.prix / m.veille - 1;
    return `<div class="carte carte-titre">
      <header><b><i class="puce" style="background:${t.couleur}"></i>${t.court}</b>
        <span class="badge ${sg.niveau}">${sg.avis}</span></header>
      <div><span class="prix">${eur(m.prix)}</span> <span class="${classeSigne(vj)}">${pct(vj, 2, true)}</span>
        <span class="aide"> · détenu : ${qteDe(t.sym)}</span></div>
      <div class="graph-m"><canvas id="g-${t.sym}"></canvas></div>
      <details><summary>Indicateurs</summary>
        <div class="mini">
          <div><span>RSI 14</span><b>${s.rsi.toFixed(0)}</b></div>
          <div><span>Perf. 5 j</span><b class="${classeSigne(s.mom5)}">${pct(s.mom5, 1, true)}</b></div>
          <div><span>Perf. 1 an</span><b class="${classeSigne(s.perf1an)}">${pct(s.perf1an, 0, true)}</b></div>
          <div><span>Volatilité</span><b>${pct(s.sigma, 0)}</b></div>
        </div>
        <ul class="raisons">${sg.raisons.map(r => `<li>${r}</li>`).join("")}</ul>
      </details>
      <div class="boutons">
        <button class="btn btn-petit" data-rapide="${t.sym}|achat">Acheter</button>
        <button class="btn btn-petit" data-rapide="${t.sym}|vente" ${qteDe(t.sym) ? "" : "disabled"}>Vendre</button>
      </div></div>`;
  }).join(""));

  if (avecGraph) TITRES.forEach((t, i) => {
    const m = marche[t.sym], k = Math.max(0, m.closes.length - 120);
    const mm20 = Finance.mm(m.closes, 20).slice(k), mm50 = Finance.mm(m.closes, 50).slice(k);
    graph(`g-${t.sym}`, {
      type: "line",
      data: { labels: m.dates.slice(k).map(dateCourte), datasets: [
        ligne("Cours", m.closes.slice(k), t.couleur),
        ligne("MM20", mm20, "#52514e", { borderWidth: 1.25, borderDash: [4, 3] }),
        ligne("MM50", mm50, "#898781", { borderWidth: 1.25 }),
      ] },
      options: optionsLigne(v => num(v, 0) + " €", { plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => ` ${c.dataset.label} : ${eur(c.parsed.y)}` } } } }),
    });
  });

  const o = etat.ordres;
  $("table-ordres").innerHTML = o.length
    ? `<tr><th>Date</th><th>Ordre</th><th class="num">Cours</th><th class="num">Total (frais inclus)</th><th class="num">Gain réalisé</th></tr>` +
      o.slice(0, 100).map(x => `<tr><td>${new Date(x.date).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" })}</td>
        <td>${x.sens === "achat" ? "Achat" : "Vente"} ${x.qte} ${TITRES.find(t => t.sym === x.sym).court}</td><td class="num">${eur(x.prix)}</td>
        <td class="num">${eur(x.total)}</td><td class="num ${x.pv == null ? "" : classeSigne(x.pv)}">${x.pv == null ? "—" : eur(x.pv)}</td></tr>`).join("")
    : `<tr><td class="aide">Aucun ordre pour le moment.</td></tr>`;
}

function quantiteSaisie() {
  const sym = $("ordre-titre").value, sens = $("ordre-sens").value, mode = $("ordre-mode").value;
  const v = parseFloat($("ordre-valeur").value) || 0, P = prixDe(sym), p = etat.params;
  if (mode === "qte") return Math.floor(v);
  const coef = sens === "achat" ? 1 + (p.courtage + p.ttf) / 100 : 1;
  return Math.floor(v / (P * coef));
}
function majApercu() {
  const sym = $("ordre-titre").value; if (!sym || !marche[sym]) return;
  const sens = $("ordre-sens").value, q = quantiteSaisie(), P = prixDe(sym), m = q * P, f = frais(sens, m);
  $("ordre-apercu").innerHTML = `${q} × ${eur(P)} + frais ${eur(f.total)} = <b>${eur(sens === "achat" ? m + f.total : m - f.total)}</b> ${sens === "achat" ? "débités" : "crédités"} · disponible : ${eur0(etat.cash)} · détenu : ${qteDe(sym)}`;
}

/* ---------- Prévisions semaine ---------- */
function rendrePrevision(avecGraph) {
  const { stats, signaux, mu, C, opt } = analyse, p = etat.params;
  $("table-prev").innerHTML = `<tr><th>Titre</th><th class="num">Cours</th><th class="num">Fourchette probable</th>
    <th class="num">Chance de hausse</th><th>Conseil</th></tr>` +
    TITRES.map((t, i) => {
      const P = prixDe(t.sym), f = Finance.prevision(P, stats[i].mu, stats[i].sigma), sg = signaux[i];
      let conseil;
      if (sg.niveau === "bon") conseil = "Achat ou renforcement possible.";
      else if (sg.niveau === "alerte") conseil = `Alléger sous ${eur0(f.bas68)}.`;
      else conseil = `Acheter vers ${eur0(f.bas68)}, vendre vers ${eur0(f.haut68)}.`;
      return `<tr><td><i class="puce" style="background:${t.couleur}"></i>${t.court}</td><td class="num">${eur(P)}</td>
        <td class="num" data-tip="Intervalle à 68 %<br>Médiane : ${eur(f.median)}<br>À 95 % : ${eur(f.bas95)} – ${eur(f.haut95)}<br>VaR 95 % : ${pct(f.var95, 1)}">${eur0(f.bas68)} – ${eur0(f.haut68)}</td>
        <td class="num">${pct(f.probHausse, 0)}</td><td class="justif"><span class="badge ${sg.niveau}">${sg.avis}</span> ${conseil}</td></tr>`;
    }).join("");

  const investi = estInvesti(), w = investi ? poidsActuels() : opt.retenu.w;
  const m = Finance.mesuresPortef(w, mu, C), sim = Finance.simulerSemaine(w, mu, C, p.perte / 100);
  // pire semaine historique avec ces poids
  const { prix } = analyse, T = prix[0].length;
  const vHist = Array.from({ length: T }, (_, k) => (1 - w.reduce((a, b) => a + b, 0)) + w.reduce((s, wi, i) => s + wi * prix[i][k] / prix[i][0], 0));
  const pire = Finance.pireVariation(vHist, 5);
  const lim = p.perte / 100;
  const statut = (x, txt) => x <= lim * 0.8 ? `<span class="badge bon">✓ ${txt}</span>` : x <= lim ? `<span class="badge neutre">! ${txt}</span>` : `<span class="badge alerte">✗ ${txt}</span>`;
  avecDetails("risque-portef", `<p class="aide">${investi ? "Portefeuille actuel" : "Répartition conseillée"} · limite : −${p.perte} % par semaine.</p>
    <table class="tableau">
      <tr><td>Perte possible sur une semaine (pire cas sur 100)</td><td class="num"><b>${pct(m.var99s, 2)}</b></td><td>${statut(m.var99s, "OK")}</td></tr>
      <tr><td>Risque de perdre plus de ${p.perte} %</td><td class="num"><b>${pct(sim.probDepasse, 2)}</b></td><td></td></tr>
      <tr><td>Pire semaine de l'année passée</td><td class="num"><b class="${classeSigne(pire)}">${pct(pire, 2, true)}</b></td><td>${statut(-pire, "OK")}</td></tr>
    </table>
    <details><summary>Autres mesures</summary><table class="tableau">
      <tr><td>VaR 95 % paramétrique</td><td class="num"><b>${pct(m.var95s, 2)}</b></td><td>${statut(m.var95s, "OK")}</td></tr>
      <tr><td>VaR 99 % Monte-Carlo (20 000 tirages)</td><td class="num"><b>${pct(sim.var99, 2)}</b></td><td>${statut(sim.var99, "OK")}</td></tr>
      <tr><td>Expected Shortfall 95 %</td><td class="num"><b>${pct(sim.es95, 2)}</b></td><td>${statut(sim.es95, "OK")}</td></tr>
    </table></details>`);

  const sel = $("prev-titre");
  if (!sel.options.length) sel.innerHTML = TITRES.map(t => `<option value="${t.sym}">${t.court}</option>`).join("");
  if (avecGraph) graphCone();
}

function graphCone() {
  const sym = $("prev-titre").value, i = TITRES.findIndex(t => t.sym === sym), t = TITRES[i];
  const m = marche[sym], k = Math.max(0, m.closes.length - 30), s = analyse.stats[i];
  const hist = m.closes.slice(k), labels = m.dates.slice(k).map(dateCourte);
  const ch = Finance.chemin(m.prix, s.mu, s.sigma);
  const futur = [];
  let d = new Date(m.dates[m.dates.length - 1] + "T12:00:00");
  while (futur.length < 5) { d.setDate(d.getDate() + 1); if (d.getDay() % 6) futur.push(dateCourte(d.toISOString().slice(0, 10)) + "*"); }
  const vide = hist.slice(0, -1).map(() => null);
  graph("graph-cone", {
    type: "line",
    data: { labels: [...labels, ...futur], datasets: [
      ligne("Cours historique", [...hist, ...futur.map(() => null)], t.couleur),
      ligne("Haut 95 %", [...vide, ...ch.map(x => x.haut)], "rgba(42,120,214,0.0)", { borderWidth: 0, fill: "+1", backgroundColor: "rgba(42,120,214,0.14)", pointHoverRadius: 0 }),
      ligne("Bas 95 %", [...vide, ...ch.map(x => x.bas)], "rgba(42,120,214,0.0)", { borderWidth: 0, pointHoverRadius: 0 }),
      ligne("Médiane prévue", [...vide, ...ch.map(x => x.median)], "#52514e", { borderDash: [5, 4], borderWidth: 1.5 }),
    ] },
    options: optionsLigne(v => num(v, 0) + " €", {
      plugins: {
        legend: { position: "top", align: "start", labels: { filter: l => !l.text.includes("95") } },
        title: { display: true, text: "* séances à venir · zone bleue : fourchette à 95 %", align: "start", color: "#898781", font: { weight: "normal", size: 12 } },
        tooltip: { filter: it => it.parsed.y != null, callbacks: { label: c => ` ${c.dataset.label} : ${eur(c.parsed.y)}` } },
      },
    }),
  });
}

/* ---------- Profil ---------- */
let profilAffiche = false;
function rendreProfil() {
  $("table-questionnaire").innerHTML = `<tr><th>Question</th><th>Réponse du client</th><th>Traduction dans le logiciel</th></tr>` +
    QUESTIONNAIRE.map(([q, r, l]) => `<tr><td>${q}</td><td>${r}</td><td style="font-weight:400;color:var(--encre-2)">${l}</td></tr>`).join("");
  if (profilAffiche) return;
  profilAffiche = true;
  const p = etat.params;
  const champs = { "p-capital": p.capital, "p-objectif": p.objectif, "p-perte": p.perte, "p-cash": p.cash, "p-wmax": p.wmax, "p-courtage": p.courtage, "p-ttf": p.ttf };
  Object.entries(champs).forEach(([id, v]) => { $(id).value = v; });
}

/* ---------- Facteurs de marché ---------- */
function rendreFacteurs() {
  if (!facteurs || !Object.keys(facteurs).length) {
    $("facteurs").innerHTML = `<p class="aide">Chargement des indicateurs de marché…</p>`;
    return;
  }
  const varF = (f, v) => f.points
    ? `<span class="${classeSigne(v)}">${v > 0 ? "+" : ""}${num(v, 2)} pt</span>`
    : `<span class="${classeSigne(v)}">${pct(v, 1, true)}</span>`;
  const dispo = FACTEURS.filter(f => facteurs[f.sym]);
  const cellule = (f, i) => {
    const d = facteurs[f.sym], c = d.corr[i], t = TITRES[i];
    const fond = melange("#f0efec", c >= 0 ? "#e34948" : "#2a78d6", Math.min(Math.abs(c), 1));
    const choc = f.points ? 1 : 0.05;
    const effet = d.beta[i] * choc;
    const tip = `<b>${t.court} / ${f.nom}</b><br>corrélation ${num(c)}<br>en moyenne, quand ${f.nom} ${f.points ? "gagne 1 point" : "monte de 5 %"}, ${t.court} varie de ${pct(effet, 1, true)} le même jour`;
    return `<td style="background:${fond};color:${Math.abs(c) > 0.55 ? "#fff" : "#0b0b0b"}" data-tip="${esc(tip)}">${num(c)}</td>`;
  };
  avecDetails("facteurs", `
    <table class="tableau">
      <tr><th>Indicateur</th><th class="num">Niveau</th><th class="num">Aujourd'hui</th><th class="num">Sur 1 semaine</th><th>Pourquoi ça compte</th></tr>
      ${dispo.map(f => { const d = facteurs[f.sym]; return `<tr><td><b>${f.nom}</b></td><td class="num">${f.fmt(d.prix)}</td><td class="num">${varF(f, d.j1)}</td><td class="num">${varF(f, d.s1)}</td><td class="justif">${f.pourquoi}</td></tr>`; }).join("")}
    </table>
    <details><summary>Lien avec vos titres</summary>
    <p class="aide">Corrélation des variations journalières sur 1 an.</p>
    <table class="correl"><tr><th></th>${TITRES.map(t => `<th>${t.court}</th>`).join("")}</tr>
      ${dispo.map(f => `<tr><th style="text-align:right">${f.nom}</th>${TITRES.map((_, i) => cellule(f, i)).join("")}</tr>`).join("")}
    </table>
    <div class="legende" style="margin-top:8px"><span><i class="puce" style="background:#e34948"></i>varie dans le même sens</span><span><i class="puce" style="background:#f0efec;border:1px solid #c3c2b7"></i>peu de lien</span><span><i class="puce" style="background:#2a78d6"></i>varie en sens inverse</span></div>
    <p class="aide" style="margin-top:8px">Survolez une case pour voir l'effet moyen. Un lien passé n'est pas une garantie : il peut changer selon la conjoncture.</p>
    </details>`);
}

function rendreActus() {
  const el = $("actus"); if (!el) return;
  if (actusErreur && !Object.keys(actus).length) { el.innerHTML = `<p class="aide">Actualités indisponibles pour le moment (connexion ou source Yahoo Finance).</p>`; return; }
  if (!Object.keys(actus).length) { el.innerHTML = `<p class="aide">Chargement des actualités…</p>`; return; }
  const ilYa = ts => {
    const h = (Date.now() / 1000 - ts) / 3600;
    return h < 1 ? "il y a moins d'1 h" : h < 24 ? `il y a ${Math.floor(h)} h` : `il y a ${Math.floor(h / 24)} j`;
  };
  el.innerHTML = TITRES.map(t => {
    const liste = (actus[t.sym] || []).slice(0, 3);
    return `<div class="bloc-actus"><h3><i class="puce" style="background:${t.couleur}"></i>${t.court}</h3>
      ${liste.length ? `<ul>${liste.map(a => `<li><a href="${esc(a.lien)}" target="_blank" rel="noopener noreferrer">${esc(a.titre)}</a><span>${esc(a.source)} · ${ilYa(a.date)}</span></li>`).join("")}</ul>` : `<p class="aide">Aucune actualité récente trouvée.</p>`}
      <a class="plus-actus" href="https://finance.yahoo.com/quote/${encodeURIComponent(t.sym)}/news/" target="_blank" rel="noopener noreferrer">Plus d'actualités ↗</a>
    </div>`;
  }).join("");
}

/* ---------- Infos ---------- */
function rendreInfos() {
  avecDetails("fiches", TITRES.map((t, i) => {
    const m = marche[t.sym], s = analyse.stats[i], meta = m.meta;
    return `<div class="carte fiche"><h3><i class="puce" style="background:${t.couleur}"></i>${t.nom}</h3>
      <div class="secteur">${t.secteur}</div>
      <p>${t.desc}</p>
      <dl>
        <dt>Cours</dt><dd>${eur(m.prix)}</dd>
        <dt>Sur 1 an</dt><dd class="${classeSigne(s.perf1an)}">${pct(s.perf1an, 1, true)}</dd>
      </dl>
      <details><summary>Plus de chiffres</summary><dl>
        <dt>Plus haut / bas 52 sem.</dt><dd>${eur(meta.fiftyTwoWeekHigh ?? s.haut)} / ${eur(meta.fiftyTwoWeekLow ?? s.bas)}</dd>
        <dt>Position dans la fourchette</dt><dd>${pct(s.pos52, 0)}</dd>
        <dt>Volatilité annuelle</dt><dd>${pct(s.sigma, 1)}</dd>
        <dt>Baisse max. sur 1 an</dt><dd class="baisse">${pct(s.drawdown, 1)}</dd>
        <dt>Pire semaine sur 1 an</dt><dd class="baisse">${pct(s.pireSemaine, 1)}</dd>
        <dt>Volume du jour</dt><dd>${(meta.regularMarketVolume ?? 0).toLocaleString("fr-FR")}</dd>
        <dt>Siège · code</dt><dd>${t.siege} · ${t.sym}</dd>
      </dl></details>
      <details><summary>Ce qui fait bouger le cours</summary>
        <ul class="facteurs-titre">${t.facteurs.map(x => `<li>${x}</li>`).join("")}</ul>
        <p class="agenda"><b>Publications habituelles :</b> ${t.agenda}. Le cours bouge souvent fortement le jour des résultats.</p>
      </details></div>`;
  }).join(""));

  rendreFacteurs();
  if (!$("actus").innerHTML) rendreActus();
  if (document.querySelector(".panneau.actif").id === "infos") chargerActus();

  if (!$("evenements").innerHTML) {
    const ev = [
      ["Banque centrale européenne (BCE)", "Décide des taux de la zone euro environ toutes les six semaines. Une baisse des taux soutient généralement les actions ; une hausse les freine."],
      ["Réserve fédérale américaine (Fed)", "Huit réunions par an. Ses décisions font bouger Wall Street, le dollar et, par ricochet, la Bourse de Paris."],
      ["Inflation", "Chiffres de la zone euro (estimation rapide en début de mois) et des États-Unis (vers le milieu du mois). Une inflation plus forte que prévu fait craindre des taux plus élevés."],
      ["Emploi américain", "Publié en général le premier vendredi du mois à 14 h 30 (heure de Paris) : souvent un pic de volatilité en séance."],
      ["Résultats des sociétés", "Les cinq titres publient chaque trimestre ou semestre (voir « Ce qui fait bouger le cours » dans chaque fiche). Un écart avec les attentes des analystes peut faire varier le cours de 5 à 10 % en une séance."],
      ["Chine", "Indicateurs d'activité (PMI) et plans de relance : importants pour le luxe (Hermès), l'industrie (Air Liquide) et la demande de pétrole."],
      ["Géopolitique et droits de douane", "Conflits, sanctions et guerres commerciales : ils font monter le pétrole et la nervosité (VIX), et pèsent sur les exportateurs comme Hermès."],
      ["Politique et budget français", "Une crise politique ou budgétaire élargit l'écart entre les taux français et allemands, et pèse sur l'ensemble du CAC 40."],
      ["Détachement du dividende", "Le jour où le dividende est versé, le cours baisse mécaniquement d'un montant proche du dividende. Ce n'est pas une vraie perte pour l'actionnaire."],
    ];
    $("evenements").innerHTML = ev.map(([a, b]) => `<dt>${a}</dt><dd>${b}</dd>`).join("");
  }

  if (!$("lexique").innerHTML) {
    const lex = [
      ["Rendement espéré (μ)", "Gain annuel moyen attendu. Ici, c'est un mélange entre l'historique sur un an et un a priori de long terme de 7 %."],
      ["Volatilité (σ)", "Écart-type annualisé des rendements journaliers. C'est la mesure standard du risque : plus elle est élevée, plus le cours varie fortement."],
      ["Ratio de Sharpe", "(Rendement − taux sans risque) / volatilité : le rendement obtenu par unité de risque prise."],
      ["VaR (Value at Risk)", "Perte qui ne devrait être dépassée qu'avec une faible probabilité sur un horizon donné. Exemple : une VaR 99 % à 1 semaine de 8 % signifie qu'une semaine sur cent seulement devrait perdre plus de 8 %."],
      ["Expected Shortfall", "Perte moyenne dans les pires scénarios, au-delà de la VaR. Cette mesure est plus prudente que la VaR."],
      ["Corrélation", "Mesure entre −1 et +1 de la tendance de deux titres à varier ensemble. Moins deux titres sont corrélés, plus les associer réduit le risque."],
      ["Frontière efficiente", "Ensemble des portefeuilles qui offrent le meilleur rendement pour chaque niveau de risque (théorie de Markowitz)."],
      ["MM20 / MM50", "Moyennes mobiles des cours sur 20 et 50 séances. Quand la MM20 passe au-dessus de la MM50, la tendance est haussière."],
      ["RSI 14", "Indicateur de force relative, de 0 à 100. Au-dessus de 70, le titre est en surachat (risque de repli) ; en dessous de 30, il est en survente (rebond possible)."],
      ["PRU", "Prix de revient unitaire : le prix moyen payé par titre, frais d'achat inclus."],
      ["TTF", "Taxe sur les transactions financières : elle s'applique aux achats d'actions françaises dont la capitalisation dépasse 1 milliard d'euros, ce qui est le cas des cinq titres. Le taux est paramétrable dans le profil."],
      ["Mouvement brownien géométrique", "Modèle standard de l'évolution d'un cours (celui de Black-Scholes). Il sert ici à projeter la fourchette de prix à 5 séances."],
    ];
    $("lexique").innerHTML = lex.map(([a, b]) => `<dt>${a}</dt><dd>${b}</dd>`).join("");
    $("a-savoir").innerHTML = `
      <p><b>Horaires.</b> Euronext Paris cote en continu de 9 h à 17 h 30, du lundi au vendredi. En dehors de ces horaires, le logiciel exécute les ordres au dernier cours connu.</p>
      <p><b>Enveloppe fiscale.</b> Avec un horizon d'un an et des allers-retours, un compte-titres ordinaire est le plus souple. Un PEA accepte ces cinq titres européens, mais ses versements sont plafonnés à 150 000 € et tout retrait avant 5 ans entraîne en principe sa clôture. Il ne peut donc pas accueillir les 500 000 €.</p>
      <p><b>Fiscalité des plus-values.</b> Sur un compte-titres, les plus-values et dividendes sont soumis par défaut au prélèvement forfaitaire unique (« flat tax »). Vérifiez le taux en vigueur au moment de la cession.</p>
      <p><b>Limites du modèle.</b> Les rendements passés ne préjugent pas des rendements futurs. Les modèles gaussiens sous-estiment les krachs : en 2020, des baisses de plus de 20 % en une semaine ont eu lieu. La limite de 10 % par semaine n'est donc pas une garantie.</p>
      <ul><li>Concentration : cinq titres, tous français et de grande capitalisation. Le portefeuille reste exposé au marché parisien dans son ensemble.</li>
      <li>Les données de Yahoo Finance peuvent être décalées de quelques minutes.</li>
      <li>Les ordres sont simulés : aucun ordre réel n'est transmis à un courtier.</li></ul>`;
  }
}

/* =====================================================================
   ÉVÉNEMENTS
   ===================================================================== */
function ouvrirOnglet(id) {
  if (id === "profil") id = "infos";
  const b = document.querySelector(`.onglet[data-onglet="${id}"]`); if (!b) return;
  document.querySelectorAll(".onglet").forEach(x => x.classList.toggle("actif", x === b));
  document.querySelectorAll(".panneau").forEach(p => p.classList.toggle("actif", p.id === id));
  history.replaceState(null, "", "#" + id);
}
document.querySelectorAll(".onglet").forEach(b => b.addEventListener("click", () => { ouvrirOnglet(b.dataset.onglet); rendre(); }));
if (location.hash) ouvrirOnglet(location.hash.slice(1));

$("btn-rafraichir").addEventListener("click", actualiser);
["ordre-titre", "ordre-sens", "ordre-mode", "ordre-valeur"].forEach(id => $(id).addEventListener("input", majApercu));
$("prev-titre").addEventListener("change", graphCone);
$("det-analyse").addEventListener("toggle", () => { if ($("det-analyse").open) rendre(); });

$("form-ordre").addEventListener("submit", e => {
  e.preventDefault();
  const r = executer($("ordre-titre").value, $("ordre-sens").value, quantiteSaisie());
  const m = $("ordre-msg"); m.textContent = r.msg; m.className = "msg " + (r.ok ? "ok" : "ko");
  rendre();
});

document.addEventListener("click", e => {
  const b = e.target.closest("[data-rapide]"); if (!b) return;
  const [sym, sens] = b.dataset.rapide.split("|");
  $("ordre-titre").value = sym; $("ordre-sens").value = sens;
  if (sens === "vente") { $("ordre-mode").value = "qte"; $("ordre-valeur").value = qteDe(sym); }
  majApercu();
  $("form-ordre").scrollIntoView({ behavior: "smooth", block: "center" });
  $("ordre-valeur").focus();
});

$("btn-valider-repart").addEventListener("click", () => {
  if (!analyse) return;
  const ordres = ordresVersCible(analyse.opt.retenu.w);
  if (!ordres.length) { $("repart-msg").textContent = "Le portefeuille est déjà conforme à la répartition conseillée."; return; }
  const recap = ordres.map(o => `• ${o.sens === "achat" ? "Acheter" : "Vendre"} ${o.qte} ${TITRES.find(t => t.sym === o.sym).court} (≈ ${eur0(o.qte * prixDe(o.sym))})`).join("\n");
  if (!confirm(`Valider la répartition conseillée ?\n\n${recap}\n\nLes ordres seront exécutés immédiatement au dernier cours.`)) return;
  const res = ordres.map(o => executer(o.sym, o.sens, o.qte));
  const ko = res.filter(r => !r.ok);
  rendre();
  $("repart-msg").textContent = ko.length ? `${res.length - ko.length} ordre(s) exécuté(s), ${ko.length} refusé(s) : ${ko.map(r => r.msg).join(" ")}` : `${res.length} ordre(s) exécuté(s). Répartition appliquée.`;
});

$("form-profil").addEventListener("submit", e => {
  e.preventDefault();
  const v = id => parseFloat($(id).value);
  const n = { capital: v("p-capital"), objectif: v("p-objectif"), perte: v("p-perte"), cash: v("p-cash"), wmax: v("p-wmax"), courtage: v("p-courtage"), ttf: v("p-ttf") };
  if (Object.values(n).some(x => isNaN(x) || x < 0)) { const m = $("profil-msg"); m.textContent = "Valeurs invalides."; m.className = "msg ko"; return; }
  let msg = "Paramètres enregistrés. Répartition et conseils recalculés.";
  if (n.capital !== etat.params.capital) {
    if (!estInvesti() && !etat.ordres.length) { etat.cash = n.capital; etat.capitalInitial = n.capital; etat.semaine = null; }
    else msg += " Le nouveau capital sera pris en compte après une réinitialisation du portefeuille.";
  }
  etat.params = n; sauver(); profilAffiche = false;
  if (marche[TITRES[0].sym]) { analyser(); analyserFacteurs(); majSemaine(); }
  rendre();
  const m = $("profil-msg"); m.textContent = msg; m.className = "msg ok";
});

$("btn-reset").addEventListener("click", () => {
  if (!confirm("Réinitialiser le portefeuille ? Toutes les positions et l'historique des ordres seront effacés.")) return;
  etat = nouveauPortefeuille({ ...etat.params, capital: parseFloat($("p-capital").value) || etat.params.capital });
  sauver(); majSemaine(); profilAffiche = false; rendre();
  const m = $("profil-msg"); m.textContent = "Portefeuille réinitialisé."; m.className = "msg ok";
});

/* ---------- Démarrage ---------- */
rendre();
actualiser();
setInterval(actualiser, 60000);
