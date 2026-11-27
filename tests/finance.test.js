/* Tests unitaires du moteur financier (finance.js).
   Lancement : node --test tests/   (Node 18+, rien à installer) */
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

// finance.js est un script navigateur : on l'exécute dans un contexte isolé et on récupère Finance
const ctx = {};
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(__dirname, "..", "finance.js"), "utf8") + "\nthis.Finance = Finance;", ctx);
const F = ctx.Finance;
const proche = (a, b, tol = 1e-6) => assert.ok(Math.abs(a - b) <= tol, `${a} ≠ ${b} (tolérance ${tol})`);
// série de prix de référence : hausse régulière de 0,1 % par séance sur 1 an
const croissante = Array.from({ length: 252 }, (_, i) => 100 * 1.001 ** i);

test("F01 rendements : variations relatives entre clôtures", () => {
  const r = F.rendements([100, 110, 99]);
  assert.equal(r.length, 2);
  proche(r[0], 0.10); proche(r[1], -0.10);
});

test("F02 moyenne mobile : null avant n valeurs, puis moyenne glissante", () => {
  const m = F.mm([1, 2, 3, 4, 5], 3);
  assert.deepEqual(Array.from(m.slice(0, 2)), [null, null]);
  proche(m[2], 2); proche(m[3], 3); proche(m[4], 4);
});

test("F03 RSI : 100 si hausse continue, 0 si baisse continue, null si historique trop court", () => {
  assert.equal(F.rsi(croissante), 100);
  proche(F.rsi(croissante.slice().reverse()), 0);
  assert.equal(F.rsi([1, 2, 3]), null);
});

test("F04 RSI : 50 pour des hausses et baisses égales en alternance", () => {
  const alterne = Array.from({ length: 60 }, (_, i) => (i % 2 ? 101 : 100));
  proche(F.rsi(alterne), 50, 2);
});

test("F05 loi normale : Φ(0) = 0,5 ; Φ(1,96) ≈ 0,975 ; symétrie", () => {
  proche(F.normCdf(0), 0.5, 1e-6);
  proche(F.normCdf(1.96), 0.975, 1e-4);
  proche(F.normCdf(-1.2) + F.normCdf(1.2), 1, 1e-6);
});

test("F06 pire variation sur 5 séances", () => {
  const prix = [100, 100, 100, 100, 100, 80, 85, 90, 95, 100];
  proche(F.pireVariation(prix, 5), -0.20);
  assert.equal(F.pireVariation(croissante, 5), 0); // jamais de baisse
});

test("F07 statsTitre : performance, volatilité nulle, estimation rétrécie vers 7 %", () => {
  const s = F.statsTitre(croissante);
  proche(s.perf1an, 1.001 ** 251 - 1);
  proche(s.sigma, 0, 1e-9);
  proche(s.muHisto, 0.001 * 252, 1e-6);
  proche(s.mu, 0.5 * s.muHisto + 0.5 * 0.07, 1e-9);
  assert.equal(s.drawdown, 0);
  assert.equal(s.pos52, 1); // au plus haut sur un an
});

test("F08 drawdown maximal d'une série avec chute de 40 %", () => {
  const prix = [100, 120, 72, 90, 130];
  const s = F.statsTitre(prix.concat(Array(30).fill(130)));
  proche(s.drawdown, 72 / 120 - 1);
});

test("F09 signal : « Acheter » en tendance haussière, « Alléger » en tendance baissière", () => {
  const hausse = { mm20: 105, mm50: 100, rsi: 25, mom5: 0.03 };
  const baisse = { mm20: 95, mm50: 100, rsi: 75, mom5: -0.03 };
  assert.equal(F.signal(hausse, 110).avis, "Acheter");
  assert.equal(F.signal(baisse, 90).avis, "Alléger");
  assert.equal(F.signal({ mm20: 100, mm50: 99, rsi: 50, mom5: 0 }, 99).avis, "Conserver");
});

test("F10 prévision : fourchettes ordonnées et chance de hausse cohérente", () => {
  const p = F.prevision(100, 0.10, 0.25);
  assert.ok(p.bas95 < p.bas68 && p.bas68 < p.median && p.median < p.haut68 && p.haut68 < p.haut95);
  assert.ok(p.probHausse > 0.5 && p.probHausse < 0.6);
  const n = F.prevision(100, 0, 0.25);
  assert.ok(n.probHausse < 0.5); // dérive négative (-σ²/2) sans rendement espéré
});

test("F11 cône de prévision : 6 points sur 5 séances, largeur croissante", () => {
  const c = F.chemin(100, 0.08, 0.2);
  assert.equal(c.length, 6);
  proche(c[0].bas, 100); proche(c[0].haut, 100);
  for (let k = 1; k < c.length; k++) assert.ok(c[k].haut - c[k].bas > c[k - 1].haut - c[k - 1].bas);
});

test("F12 covariance et corrélation : matrice symétrique, diagonale de corrélation à 1", () => {
  const a = [0.01, -0.02, 0.015, 0.0, -0.01], b = a.map(x => 2 * x), c = a.map(x => -x);
  const C = F.covariance([a, b, c]), R = F.correlation(C);
  for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) proche(C[i][j], C[j][i], 1e-12);
  for (let i = 0; i < 3; i++) proche(R[i][i], 1);
  proche(R[0][1], 1); proche(R[0][2], -1);
  proche(C[1][1], 4 * C[0][0], 1e-12); // variance × 4 quand la série est doublée
});

test("F13 mesures du portefeuille : rendement pondéré, volatilité √(wᵀCw)", () => {
  const C = [[0.04, 0], [0, 0.09]];
  const m = F.mesuresPortef([0.5, 0.5], [0.10, 0.20], C);
  proche(m.rendement, 0.15);
  proche(m.volatilite, Math.sqrt(0.25 * 0.04 + 0.25 * 0.09));
  assert.ok(m.var99s > m.var95s);
});

test("F14 contributions au risque : somme égale à 100 %", () => {
  const C = [[0.04, 0.01, 0.0], [0.01, 0.09, 0.02], [0.0, 0.02, 0.06]];
  const c = F.contributionsRisque([0.3, 0.3, 0.3], C);
  proche(c.reduce((s, x) => s + x, 0), 1, 1e-9);
});

/* Univers de test réaliste à 5 titres */
const mu5 = [0.12, 0.08, 0.09, 0.10, 0.11];
const sig5 = [0.25, 0.22, 0.18, 0.30, 0.28];
const C5 = sig5.map((si, i) => sig5.map((sj, j) => (i === j ? 1 : 0.4) * si * sj));
const params = { cashMin: 0.10, wMax: 0.35, perteMax: 0.10, objectif: 0.10 };

test("F15 optimisation : contraintes respectées (liquidités, poids 5–35 %, VaR ≤ 10 %)", () => {
  const o = F.optimiser(mu5, C5, params);
  const w = o.retenu.w, investi = w.reduce((s, x) => s + x, 0);
  proche(investi, 1 - o.cash, 1e-9);
  assert.ok(o.cash >= params.cashMin - 1e-9);
  w.forEach(x => assert.ok(x >= 0.05 - 1e-9 && x <= 0.35 + 1e-9, `poids ${x}`));
  assert.ok(o.retenu.var99s <= params.perteMax);
  assert.equal(o.nuage.length, 5000);
});

test("F16 optimisation reproductible : même résultat à chaque exécution", () => {
  const a = F.optimiser(mu5, C5, params), b = F.optimiser(mu5, C5, params);
  assert.deepEqual(Array.from(a.retenu.w), Array.from(b.retenu.w));
});

test("F17 optimisation : poche de liquidités augmentée si la perte max est très faible", () => {
  const o = F.optimiser(mu5, C5, { ...params, perteMax: 0.03 });
  assert.ok(o.cash > params.cashMin);
  assert.equal(o.ajusteCash, true);
});

test("F18 Monte-Carlo hebdomadaire : VaR 99 % > VaR 95 %, probabilités dans [0, 1]", () => {
  const w = [0.18, 0.18, 0.18, 0.18, 0.18];
  const s = F.simulerSemaine(w, mu5, C5, 0.10, 20000);
  assert.ok(s.var99 > s.var95 && s.var95 > 0);
  assert.ok(s.es95 >= s.var95);
  assert.ok(s.probDepasse >= 0 && s.probDepasse < 0.05);
});

test("F19 Monte-Carlo cohérent avec la VaR paramétrique (écart < 1 point)", () => {
  const w = [0.18, 0.18, 0.18, 0.18, 0.18];
  const s = F.simulerSemaine(w, mu5, C5, 0.10, 20000), m = F.mesuresPortef(w, mu5, C5);
  proche(s.var99, m.var99s, 0.01);
});

test("F20 ajustement d'actualité : proportionnel à la note, plafonné à ±2 points", () => {
  proche(F.ajustementActu(0.5), 0.01);
  proche(F.ajustementActu(1), 0.02);
  proche(F.ajustementActu(-3), -0.02);   // note hors échelle : plafonnée
  assert.equal(F.ajustementActu(undefined), 0); // pas de note : pas d'ajustement
  assert.equal(F.ajustementActu(NaN), 0);
});

test("F21 actualité positive : poids du titre augmenté, toutes contraintes respectées", () => {
  const sans = F.optimiser(mu5, C5, params).retenu;
  const mu = mu5.map((m, i) => m + (i === 2 ? F.ajustementActu(1) : 0));
  const avec = F.optimiser(mu, C5, params).retenu;
  assert.ok(avec.w[2] >= sans.w[2] - 1e-9, `${avec.w[2]} < ${sans.w[2]}`);
  avec.w.forEach(x => assert.ok(x >= 0.05 - 1e-9 && x <= 0.35 + 1e-9));
  assert.ok(avec.var99s <= params.perteMax);
});
