export const CARTES_DECISION = [
  // DÉVELOPPEMENT (20 cartes)
  { code: 'DD01', nom: 'Atelier Créatif', tier: 'Léger', cout: 10, effet: { type: 'radar', axe: 'rnd', valeur: 1, duree: 2 } },
  { code: 'DD02', nom: 'Partenariat Universitaire', tier: 'Standard', cout: 20, effet: { type: 'radar', axe: 'rnd', valeur: 2, duree: 3 } },
  { code: 'DD03', nom: 'Rachat d\'un Brevet', tier: 'Standard', cout: 20, effet: { type: 'radar', axe: 'rnd', valeur: 1, duree: -1 } },
  { code: 'DD04', nom: 'Recrutement Agressif', tier: 'Fort', cout: 35, effets: [{ type: 'radar', axe: 'rnd', valeur: 3, duree: 3 }, { type: 'radar', axe: 'stabilite', valeur: -1, duree: 3 }] },
  { code: 'DD05', nom: 'Laboratoire d\'Innovation', tier: 'Prestige', cout: 55, effet: { type: 'radar', axe: 'rnd', valeur: 2, duree: -1 } },
  { code: 'DD06', nom: 'Campagne Réseaux Sociaux', tier: 'Léger', cout: 10, effet: { type: 'radar', axe: 'image', valeur: 1, duree: 2 } },
  { code: 'DD07', nom: 'Partenariat Influenceur', tier: 'Standard', cout: 20, effets: [{ type: 'radar', axe: 'image', valeur: 2, duree: 3 }, { type: 'radar', axe: 'stabilite', valeur: -1, duree: 3 }] },
  { code: 'DD08', nom: 'Label Responsable', tier: 'Standard', cout: 20, effet: { type: 'radar', axe: 'image', valeur: 1, duree: -1 } },
  { code: 'DD09', nom: 'Grande Cause', tier: 'Fort', cout: 35, effets: [{ type: 'radar', axe: 'image', valeur: 3, duree: 2 }, { type: 'radar', axe: 'stabilite', valeur: -1, duree: 2 }] },
  { code: 'DD10', nom: 'Icône de Marque', tier: 'Prestige', cout: 50, effet: { type: 'radar', axe: 'image', valeur: 2, duree: -1 } },
  { code: 'DD11', nom: 'Audit Interne', tier: 'Léger', cout: 10, effet: { type: 'radar', axe: 'efficacite', valeur: 1, duree: 2 } },
  { code: 'DD12', nom: 'Optimisation des Processus', tier: 'Standard', cout: 20, effet: { type: 'radar', axe: 'efficacite', valeur: 2, duree: 3 } },
  { code: 'DD13', nom: 'Automatisation Partielle', tier: 'Standard', cout: 20, effets: [{ type: 'radar', axe: 'efficacite', valeur: 1, duree: -1 }, { type: 'radar', axe: 'stabilite', valeur: -1, duree: 2 }] },
  { code: 'DD14', nom: 'Plan Social', tier: 'Fort', cout: 35, effets: [{ type: 'radar', axe: 'efficacite', valeur: 3, duree: 3 }, { type: 'radar', axe: 'image', valeur: -2, duree: 3 }] },
  { code: 'DD15', nom: 'Usine du Futur', tier: 'Prestige', cout: 55, effet: { type: 'radar', axe: 'efficacite', valeur: 2, duree: -1 } },
  { code: 'DD16', nom: 'Plan de Continuité', tier: 'Léger', cout: 10, effet: { type: 'radar', axe: 'stabilite', valeur: 1, duree: 2 } },
  { code: 'DD17', nom: 'Contrats Long Terme', tier: 'Standard', cout: 20, effets: [{ type: 'radar', axe: 'stabilite', valeur: 2, duree: -1 }, { type: 'radar', axe: 'efficacite', valeur: -1, duree: 2 }] },
  { code: 'DD18', nom: 'Diversification des Marchés', tier: 'Standard', cout: 20, effet: { type: 'radar', axe: 'stabilite', valeur: 1, duree: -1 } },
  { code: 'DD19', nom: 'Réorganisation Interne', tier: 'Fort', cout: 35, effets: [{ type: 'radar', axe: 'stabilite', valeur: 3, duree: 3 }, { type: 'radar', axe: 'rnd', valeur: -1, duree: 2 }, { type: 'radar', axe: 'efficacite', valeur: -1, duree: 2 }] },
  { code: 'DD20', nom: 'Forteresse Financière', tier: 'Prestige', cout: 60, effet: { type: 'radar', axe: 'stabilite', valeur: 2, duree: -1 } },

  // COMMERCE (11 cartes)
  { code: 'DC01', nom: 'Promotion Flash', tier: 'Léger', cout: 10, effet: { type: 'revenus', valeur: 0.20, duree: 1 } },
  { code: 'DC02', nom: 'Campagne Publicitaire', tier: 'Standard', cout: 20, effet: { type: 'revenus', valeur: 0.20, duree: 2 } },
  { code: 'DC03', nom: 'Offensive Commerciale', tier: 'Standard', cout: 20, effets: [{ type: 'revenus', valeur: 0.25, duree: 2 }, { type: 'radar', axe: 'efficacite', valeur: -1, duree: 2 }] },
  { code: 'DC04', nom: 'Conquête de Marché', tier: 'Fort', cout: 35, effets: [{ type: 'revenus', valeur: 0.30, duree: 3 }, { type: 'radar', axe: 'stabilite', valeur: -1, duree: 3 }] },
  { code: 'DC05', nom: 'Marque Premium', tier: 'Prestige', cout: 50, effet: { type: 'revenus', valeur: 0.25, duree: -1 } },
  { code: 'DC06', nom: 'Accord de Licence', tier: 'Léger', cout: 10, effet: { type: 'synergies', multiplicateur: 1.5, duree: 1 } },
  { code: 'DC07', nom: 'Coup de Pouce Mutuel', tier: 'Léger', cout: 10, effet: { type: 'synergies', multiplicateur: 1.5, duree: 1 } },
  { code: 'DC08', nom: 'Joint-Venture', tier: 'Standard', cout: 20, effets: [{ type: 'synergies', multiplicateur: 2, duree: 2 }, { type: 'radar', axe: 'image', valeur: 1, duree: -1 }] },
  { code: 'DC09', nom: 'Fusion Partielle', tier: 'Standard', cout: 20, effets: [{ type: 'synergies', multiplicateur: 2, duree: 2 }, { type: 'radar', axe: 'image', valeur: 1, duree: -1 }] },
  { code: 'DC10', nom: 'Leader de Secteur', tier: 'Prestige', cout: 55, effet: { type: 'monopole_2entreprises', duree: -1 } },
  { code: 'DC11', nom: 'Empire de Réseau', tier: 'Prestige', cout: 55, effet: { type: 'monopole_2entreprises', duree: -1 } },

  // GESTION (6 cartes)
  { code: 'DG01', nom: 'Renégociation Fournisseurs', tier: 'Léger', cout: 10, effet: { type: 'couts', valeur: -0.30, duree: 2 } },
  { code: 'DG02', nom: 'Chasse au Gaspi', tier: 'Léger', cout: 10, effet: { type: 'couts', valeur: -0.30, duree: 2 } },
  { code: 'DG03', nom: 'Plan de Rigueur', tier: 'Standard', cout: 20, effets: [{ type: 'couts', valeur: -0.50, duree: 2 }, { type: 'radar', axe: 'efficacite', valeur: -1, duree: 2 }] },
  { code: 'DG04', nom: 'Externalisation', tier: 'Standard', cout: 20, effets: [{ type: 'couts', valeur: -0.50, duree: 2 }, { type: 'radar', axe: 'efficacite', valeur: -1, duree: 2 }] },
  { code: 'DG05', nom: 'Restructuration Opérationnelle', tier: 'Fort', cout: 35, effets: [{ type: 'couts', valeur: -0.30, duree: -1 }, { type: 'radar', axe: 'efficacite', valeur: 1, duree: -1 }] },
  { code: 'DG06', nom: 'Lean Management', tier: 'Fort', cout: 35, effets: [{ type: 'couts', valeur: -0.30, duree: -1 }, { type: 'radar', axe: 'efficacite', valeur: 1, duree: -1 }] },

  // SPÉCIALES (5 cartes)
  { code: 'DSP01', nom: 'Changement de Stratégie', tier: 'Spéciale', cout: 0, effet: { type: 'defausse_et_repioche', nb: 3 } },
  { code: 'DSP02', nom: 'Changement de Stratégie', tier: 'Spéciale', cout: 0, effet: { type: 'defausse_et_repioche', nb: 3 } },
  { code: 'DSP03', nom: 'Changement de Stratégie', tier: 'Spéciale', cout: 0, effet: { type: 'defausse_et_repioche', nb: 3 } },
  { code: 'DSP05', nom: 'Veille Concurrentielle', tier: 'Spéciale', cout: 0, effet: { type: 'voir_main_adversaire' } },
  { code: 'DSP06', nom: 'Veille Concurrentielle', tier: 'Spéciale', cout: 0, effet: { type: 'voir_main_adversaire' } },

  // OFFENSIVES (8 cartes)
  { code: 'DATK01', nom: 'Bad Buzz', tier: 'Offensive', cout: 0, effet: { type: 'radar_adverse', axe: 'image', valeur: -2, duree: 2 } },
  { code: 'DATK02', nom: 'Raid Boursier', tier: 'Offensive', cout: 0, effet: { type: 'radar_adverse', axe: 'stabilite', valeur: -2, duree: 2 } },
  { code: 'DATK03', nom: 'Grève Surprise', tier: 'Offensive', cout: 0, effet: { type: 'radar_adverse', axe: 'efficacite', valeur: -2, duree: 2 } },
  { code: 'DATK04', nom: 'Fuite des Talents', tier: 'Offensive', cout: 0, effet: { type: 'radar_adverse', axe: 'rnd', valeur: -2, duree: 2 } },
  { code: 'DATK05', nom: 'Guerre des Prix', tier: 'Offensive', cout: 0, effet: { type: 'revenus_adverse', valeur: -0.30, duree: 1 } },
  { code: 'DATK06', nom: 'Dumping', tier: 'Offensive', cout: 0, effet: { type: 'revenus_secteur_adverse', valeur: -0.25, duree: 2 } },
  { code: 'DATK07', nom: 'Rapport d\'Analyste', tier: 'Offensive', cout: 0, effet: { type: 'reveler_progression_adverse' } },
  { code: 'DATK08', nom: 'Clause d\'Exclusivité', tier: 'Offensive', cout: 0, effet: { type: 'bloquer_synergies_adverse', duree: 2 } },

  // FINANCIÈRES (6 cartes)
  { code: 'DF01', nom: 'Prêt Bancaire', tier: 'Financière', cout: 0, effet: { type: 'caisse_et_dette', valeur: 30 } },
  { code: 'DF05', nom: 'Investisseur Providentiel', tier: 'Financière', cout: 0, effet: { type: 'caisse_plus_cession_revenus', caisse: 50, cession: 0.10, duree: 3 } },
  { code: 'DF07', nom: 'Vente d\'Actifs Mineurs', tier: 'Financière', cout: 0, effets: [{ type: 'caisse', valeur: 20 }, { type: 'radar', axe: 'efficacite', valeur: -1, duree: 2 }] },
  { code: 'DF08', nom: 'Boom de Trésorerie', tier: 'Financière', cout: 10, effet: { type: 'double_revenus_ce_tour_puis_double_couts' } },
  { code: 'DF10', nom: 'Report de Dette', tier: 'Financière', cout: 10, effet: { type: 'suspendre_interets', duree: 2 } },
  { code: 'DF11', nom: 'Subvention Publique', tier: 'Financière', cout: 0, effet: { type: 'caisse', valeur: 25 } },

  // ILLÉGALES (8 cartes)
  { code: 'DI01', nom: 'Fraude Fiscale', tier: 'Illégale', cout: 0, effet: { type: 'dividendes_sans_impots_ce_tour' } },
  { code: 'DI02', nom: 'Entente sur les Prix', tier: 'Illégale', cout: 0, effet: { type: 'revenus_secteur', valeur: 0.25, duree: 2 } },
  { code: 'DI03', nom: 'Délit d\'Initié', tier: 'Illégale', cout: 0, effet: { type: 'immunite_prochaine_geo' } },
  { code: 'DI04', nom: 'Main d\'Œuvre Clandestine', tier: 'Illégale', cout: 0, effet: { type: 'couts', valeur: -0.60, duree: 3 } },
  { code: 'DI05', nom: 'Concurrence Déloyale', tier: 'Illégale', cout: 0, effet: { type: 'radar_adverse', axe: 'efficacite', valeur: -2, duree: 3 } },
  { code: 'DI06', nom: 'Taupe Interne', tier: 'Illégale', cout: 0, effet: { type: 'piocher', nb: 3 } },
  { code: 'DI07', nom: 'Espionnage Industriel', tier: 'Illégale', cout: 0, effet: { type: 'radar', axe: 'rnd', valeur: 2, duree: 3 } },
  { code: 'DI08', nom: 'Transfert Intra-Groupe', tier: 'Illégale', cout: 0, effet: { type: 'transfert_caisse_entre_entreprises', max: 50 } },
];

export function obtenirCarte(code) {
  const codeNormalisé = code.toUpperCase().replace(/-/g, '');
  return CARTES_DECISION.find(c => c.code.replace(/-/g, '') === codeNormalisé);
}
