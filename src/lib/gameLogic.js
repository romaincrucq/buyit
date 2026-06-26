export const CONFIG = {
  cashInitial: 175,
  toursMax: 20,
  bonusDepart: 5,
  loyerAdverse: 10,
  tauxDividendes: 0.70,
  tauxInteret: 0.05,
  seuilFaillite: 0.50,
  seuilVictoire: 2.5,
  seuilDetteVictoire: 0.30,
  cartesDepart: 2,
  cartesParTour: 1,
};

export function calculerProgression(radar) {
  return (radar.rnd * 0.3) + (radar.image * 0.2) + (radar.efficacite * 0.3) + (radar.stabilite * 0.2);
}

export function calculerRevenu(valeur, radar, bonusSynergie = 0) {
  return valeur * (radar.efficacite / 40) * (1 + radar.image / 200) * (1 + bonusSynergie);
}

export function calculerNouvelleValeur(valeur, progression) {
  return valeur * (1 + progression / 100);
}

export function calculerCouts(valeur, tauxCharges) {
  return valeur * tauxCharges;
}

export function calculerInterets(dette) {
  return dette * 0.05;
}

export function calculerDividendes(montant) {
  return montant * 0.70;
}

export function estEnFaillite(dette, valeur) {
  return dette > valeur * 0.50;
}

export function verifierVictoireAnticipee(portefeuille, detteTotale) {
  if (portefeuille.length === 0) return false;
  const valeurTotale = portefeuille.reduce((sum, e) => sum + e.valeur, 0);
  const valeurInitialeTotale = portefeuille.reduce((sum, e) => sum + e.valeurInitiale, 0);
  const ratio = valeurTotale / valeurInitialeTotale;
  const ratioDetteValeur = detteTotale / valeurTotale;
  return ratio >= 2.5 && ratioDetteValeur < 0.30;
}

export function impactDetteStabilite(dette, valeur) {
  const ratio = dette / valeur;
  if (ratio > 0.40) return -2;
  if (ratio > 0.25) return -1;
  return 0;
}

export function genererCodeSession() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export function calculerValeurNette(portefeuille) {
  return portefeuille.reduce((sum, e) => sum + (e.valeur - e.dette), 0);
}
