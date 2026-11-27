/* =====================================================================
   Weekly Edge — moteur financier (fonctions pures, sans interface)
   ===================================================================== */
const Finance = (() => {
  const JOURS_AN = 252;
  const JOURS_SEMAINE = 5;
  const PRIOR_RENDEMENT = 0.07;  // a priori de long terme pour les actions européennes
  const POIDS_HISTO = 0.5;       // poids de l'historique dans l'estimation (rétrécissement)
  const TAUX_SANS_RISQUE = 0.02; // proche du taux monétaire de la zone euro
  const Z95 = 1.6449, Z99 = 2.3263;
  const AJUST_ACTU_MAX = 0.02;   // effet maximal de l'actualité sur le rendement espéré : ±2 points

  const moyenne = a => a.reduce((s, x) => s + x, 0) / a.length;
  const ecartType = a => {
    const m = moyenne(a);
    return Math.sqrt(a.reduce((s, x) => s + (x - m) ** 2, 0) / (a.length - 1));
  };

  // Fonction de répartition de la loi normale (approximation d'Abramowitz-Stegun)
  function normCdf(x) {
    const t = 1 / (1 + 0.2316419 * Math.abs(x));
    const d = 0.3989423 * Math.exp(-x * x / 2);
    const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
    return x > 0 ? 1 - p : p;
  }

  function rendements(prix) {
    const r = [];
    for (let i = 1; i < prix.length; i++) r.push(prix[i] / prix[i - 1] - 1);
    return r;
  }

  function mm(prix, n) {
    const out = new Array(prix.length).fill(null);
    let s = 0;
    for (let i = 0; i < prix.length; i++) {
      s += prix[i];
      if (i >= n) s -= prix[i - n];
      if (i >= n - 1) out[i] = s / n;
    }
    return out;
  }

  function rsi(prix, n = 14) {
    if (prix.length <= n) return null;
    let gain = 0, perte = 0;
    for (let i = 1; i <= n; i++) {
      const d = prix[i] - prix[i - 1];
      if (d > 0) gain += d; else perte -= d;
    }
    gain /= n; perte /= n;
    for (let i = n + 1; i < prix.length; i++) {
      const d = prix[i] - prix[i - 1];
      gain = (gain * (n - 1) + Math.max(d, 0)) / n;
      perte = (perte * (n - 1) + Math.max(-d, 0)) / n;
    }
    if (perte === 0) return 100;
    return 100 - 100 / (1 + gain / perte);
  }

  function drawdownMax(prix) {
    let pic = prix[0], dd = 0;
    for (const p of prix) { pic = Math.max(pic, p); dd = Math.min(dd, p / pic - 1); }
    return dd;
  }

  /* Statistiques d'un titre à partir de ses clôtures (1 an) */
  function statsTitre(prix) {
    const r = rendements(prix);
    const muHisto = moyenne(r) * JOURS_AN;
    const sigma = ecartType(r) * Math.sqrt(JOURS_AN);
    const mu = POIDS_HISTO * muHisto + (1 - POIDS_HISTO) * PRIOR_RENDEMENT;
    const n = prix.length, P = prix[n - 1];
    const mm20 = mm(prix, 20), mm50 = mm(prix, 50);
    const haut = Math.max(...prix), bas = Math.min(...prix);
    return {
      muHisto, mu, sigma,
      sharpe: (mu - TAUX_SANS_RISQUE) / sigma,
      perf1an: P / prix[0] - 1,
      mom5: n > 5 ? P / prix[n - 6] - 1 : 0,
      mom20: n > 20 ? P / prix[n - 21] - 1 : 0,
      mm20: mm20[n - 1], mm50: mm50[n - 1],
      rsi: rsi(prix),
      drawdown: drawdownMax(prix),
      pos52: haut > bas ? (P - bas) / (haut - bas) : 0.5,
      haut, bas,
      pireSemaine: pireVariation(prix, JOURS_SEMAINE),
    };
  }

  function pireVariation(prix, h) {
    let pire = 0;
    for (let i = h; i < prix.length; i++) pire = Math.min(pire, prix[i] / prix[i - h] - 1);
    return pire;
  }

  /* Ajustement du rendement espéré selon la note d'actualité FinBERT (-1 à +1), plafonné à ±2 points */
  function ajustementActu(note) {
    if (typeof note !== "number" || !Number.isFinite(note)) return 0;
    return Math.max(-1, Math.min(1, note)) * AJUST_ACTU_MAX;
  }

  /* Signal technique de court terme (horizon semaine) */
  function signal(s, P) {
    let score = 0;
    const raisons = [];
    if (P > s.mm20) { score += 1; raisons.push("cours au-dessus de la MM20"); }
    else { score -= 1; raisons.push("cours sous la MM20"); }
    if (s.mm20 > s.mm50) { score += 1; raisons.push("MM20 > MM50 (tendance haussière)"); }
    else { score -= 1; raisons.push("MM20 < MM50 (tendance baissière)"); }
    if (s.rsi !== null) {
      if (s.rsi < 30) { score += 1.5; raisons.push(`RSI ${s.rsi.toFixed(0)} : survente, rebond possible`); }
      else if (s.rsi > 70) { score -= 1.5; raisons.push(`RSI ${s.rsi.toFixed(0)} : surachat, risque de repli`); }
      else raisons.push(`RSI ${s.rsi.toFixed(0)} : neutre`);
    }
    if (s.mom5 > 0.02) { score += 0.5; raisons.push("forte dynamique sur 5 séances"); }
    if (s.mom5 < -0.02) { score -= 0.5; raisons.push("repli marqué sur 5 séances"); }
    let avis = "Conserver", niveau = "neutre";
    if (score >= 1.5) { avis = "Acheter"; niveau = "bon"; }
    else if (score <= -1.5) { avis = "Alléger"; niveau = "alerte"; }
    return { score, avis, niveau, raisons };
  }

  /* Prévision à h séances (mouvement brownien géométrique) */
  function prevision(P, mu, sigma, h = JOURS_SEMAINE) {
    const t = h / JOURS_AN;
    const drift = (mu - sigma * sigma / 2) * t;
    const vol = sigma * Math.sqrt(t);
    return {
      median: P * Math.exp(drift),
      bas95: P * Math.exp(drift - 1.96 * vol),
      haut95: P * Math.exp(drift + 1.96 * vol),
      bas68: P * Math.exp(drift - vol),
      haut68: P * Math.exp(drift + vol),
      probHausse: normCdf(drift / vol),
      esperance: Math.exp(mu * t) - 1,
      var95: -(mu * t - Z95 * vol),
    };
  }

  function chemin(P, mu, sigma, h = JOURS_SEMAINE) {
    const pts = [];
    for (let k = 0; k <= h; k++) {
      const t = k / JOURS_AN, drift = (mu - sigma * sigma / 2) * t, vol = sigma * Math.sqrt(t);
      pts.push({ median: P * Math.exp(drift), bas: P * Math.exp(drift - 1.96 * vol), haut: P * Math.exp(drift + 1.96 * vol) });
    }
    return pts;
  }

  function covariance(seriesRend) {
    const n = seriesRend.length, m = seriesRend.map(moyenne);
    const T = seriesRend[0].length;
    const C = Array.from({ length: n }, () => new Array(n).fill(0));
    for (let i = 0; i < n; i++) for (let j = i; j < n; j++) {
      let s = 0;
      for (let t = 0; t < T; t++) s += (seriesRend[i][t] - m[i]) * (seriesRend[j][t] - m[j]);
      C[i][j] = C[j][i] = s / (T - 1) * JOURS_AN;
    }
    return C;
  }

  function correlation(C) {
    return C.map((l, i) => l.map((c, j) => c / Math.sqrt(C[i][i] * C[j][j])));
  }

  const produitQ = (w, C) => {
    let s = 0;
    for (let i = 0; i < w.length; i++) for (let j = 0; j < w.length; j++) s += w[i] * w[j] * C[i][j];
    return s;
  };

  function mesuresPortef(w, mu, C) {
    const r = w.reduce((s, x, i) => s + x * mu[i], 0);     // liquidités rémunérées à 0 %
    const sig = Math.sqrt(produitQ(w, C));
    const t = JOURS_SEMAINE / JOURS_AN;
    return {
      rendement: r, volatilite: sig,
      sharpe: sig > 0 ? (r - TAUX_SANS_RISQUE) / sig : 0,
      var95s: -(r * t - Z95 * sig * Math.sqrt(t)),
      var99s: -(r * t - Z99 * sig * Math.sqrt(t)),
    };
  }

  function contributionsRisque(w, C) {
    const v = produitQ(w, C);
    return w.map((wi, i) => {
      const cw = C[i].reduce((s, c, j) => s + c * w[j], 0);
      return v > 0 ? wi * cw / v : 0;
    });
  }

  /* Générateur pseudo-aléatoire reproductible (mulberry32) */
  function alea(graine) {
    return () => {
      graine |= 0; graine = graine + 0x6D2B79F5 | 0;
      let t = Math.imul(graine ^ graine >>> 15, 1 | graine);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  /*
   * Optimisation par simulation de Monte-Carlo.
   * Contraintes : liquidités >= cashMin, chaque titre entre wMin et wMax,
   *               VaR 99 % hebdomadaire <= perte max acceptée.
   * Critère     : parmi les portefeuilles admissibles qui atteignent l'objectif,
   *               on retient le meilleur ratio de Sharpe ; si aucun n'atteint
   *               l'objectif, on retient le rendement espéré le plus élevé.
   */
  function optimiser(mu, C, p) {
    const n = mu.length, rnd = alea(20261124);
    const wMin = 0.05, wMax = p.wMax;
    let cash = p.cashMin, nuage = [], retenu = null, minVar = null;

    for (let essai = 0; essai < 12; essai++) {
      const investi = 1 - cash;
      nuage = []; retenu = null; minVar = null;
      let tentatives = 0;
      while (nuage.length < 5000 && tentatives < 400000) {
        tentatives++;
        const e = Array.from({ length: n }, () => -Math.log(1 - rnd()));
        const s = e.reduce((a, b) => a + b, 0);
        const w = e.map(x => x / s * investi);
        if (w.some(x => x < wMin - 1e-9 || x > wMax + 1e-9)) continue;
        const m = mesuresPortef(w, mu, C);
        const pt = { w, ...m, admissible: m.var99s <= p.perteMax };
        nuage.push(pt);
        if (!minVar || m.volatilite < minVar.volatilite) minVar = pt;
      }
      const adm = nuage.filter(x => x.admissible);
      if (adm.length) {
        const atteint = adm.filter(x => x.rendement >= p.objectif);
        retenu = atteint.length
          ? atteint.reduce((a, b) => b.sharpe > a.sharpe ? b : a)
          : adm.reduce((a, b) => b.rendement > a.rendement ? b : a);
        return { retenu, nuage, minVar, cash, objectifAtteint: atteint.length > 0, ajusteCash: cash > p.cashMin };
      }
      cash = Math.min(0.9, cash + 0.05);  // trop risqué : on augmente la poche non placée
    }
    return { retenu: minVar, nuage, minVar, cash, objectifAtteint: false, ajusteCash: true, nonAdmissible: true };
  }

  /* Monte-Carlo de la perte hebdomadaire (rendements gaussiens corrélés) */
  function cholesky(C) {
    const n = C.length, L = Array.from({ length: n }, () => new Array(n).fill(0));
    for (let i = 0; i < n; i++) for (let j = 0; j <= i; j++) {
      let s = C[i][j];
      for (let k = 0; k < j; k++) s -= L[i][k] * L[j][k];
      L[i][j] = i === j ? Math.sqrt(Math.max(s, 1e-12)) : s / L[j][j];
    }
    return L;
  }

  function simulerSemaine(w, mu, C, seuil, N = 20000) {
    const n = w.length, t = JOURS_SEMAINE / JOURS_AN, L = cholesky(C), rnd = alea(42);
    const gauss = () => {
      const u = 1 - rnd(), v = rnd();
      return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
    };
    const res = [];
    let depasse = 0;
    for (let k = 0; k < N; k++) {
      const z = Array.from({ length: n }, gauss);
      let r = 0;
      for (let i = 0; i < n; i++) {
        let e = 0;
        for (let j = 0; j <= i; j++) e += L[i][j] * z[j];
        const ri = Math.exp((mu[i] - C[i][i] / 2) * t + e * Math.sqrt(t)) - 1;
        r += w[i] * ri;
      }
      res.push(r);
      if (r <= -seuil) depasse++;
    }
    res.sort((a, b) => a - b);
    const q = p => res[Math.floor(p * N)];
    const queue = res.slice(0, Math.floor(0.05 * N));
    return { probDepasse: depasse / N, var95: -q(0.05), var99: -q(0.01), es95: -moyenne(queue), median: q(0.5) };
  }

  return {
    JOURS_AN, JOURS_SEMAINE, PRIOR_RENDEMENT, POIDS_HISTO, TAUX_SANS_RISQUE, AJUST_ACTU_MAX, ajustementActu,
    rendements, mm, rsi, statsTitre, signal, prevision, chemin, covariance, correlation,
    mesuresPortef, contributionsRisque, optimiser, simulerSemaine, normCdf, pireVariation,
  };
})();
