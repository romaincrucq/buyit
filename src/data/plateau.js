export const PLATEAU = [
  { numero: 1, nom: 'Départ', type: 'depart', effet: 'Prime +5 cash (sauf tour 1)' },
  { numero: 2, nom: 'Décision', type: 'decision' },
  { numero: 3, nom: 'Géopolitique', type: 'geopolitique' },
  { numero: 4, nom: 'Céréales & Élevage', type: 'entreprise', secteur: 'Agroalimentaire', entrepriseId: 'cereales' },
  { numero: 5, nom: 'Bio-Premium', type: 'entreprise', secteur: 'Agroalimentaire', entrepriseId: 'biopremium' },
  { numero: 6, nom: 'Boissons', type: 'entreprise', secteur: 'Agroalimentaire', entrepriseId: 'boissons' },
  { numero: 7, nom: 'Décision', type: 'decision' },
  { numero: 8, nom: 'Contrôle Fiscal', type: 'fiscal' },
  { numero: 9, nom: 'Géopolitique', type: 'geopolitique' },
  { numero: 10, nom: 'Décision', type: 'decision' },
  { numero: 11, nom: 'Réseaux Sociaux', type: 'entreprise', secteur: 'Tech', entrepriseId: 'reseaux' },
  { numero: 12, nom: 'Jeux Vidéo', type: 'entreprise', secteur: 'Tech', entrepriseId: 'jeux' },
  { numero: 13, nom: 'IA', type: 'entreprise', secteur: 'Tech', entrepriseId: 'ia' },
  { numero: 14, nom: 'Géopolitique', type: 'geopolitique' },
  { numero: 15, nom: 'Prime', type: 'prime', effet: 'Prime +5 cash' },
  { numero: 16, nom: 'Médicaments', type: 'entreprise', secteur: 'Pharma/Médical', entrepriseId: 'medicaments' },
  { numero: 17, nom: 'Vaccins & Recherche', type: 'entreprise', secteur: 'Pharma/Médical', entrepriseId: 'vaccins' },
  { numero: 18, nom: 'Équipements Hosp.', type: 'entreprise', secteur: 'Pharma/Médical', entrepriseId: 'equipements' },
  { numero: 19, nom: 'Décision', type: 'decision' },
  { numero: 20, nom: 'Géopolitique', type: 'geopolitique' },
  { numero: 21, nom: 'Décision', type: 'decision' },
  { numero: 22, nom: 'Automobile', type: 'entreprise', secteur: 'Industrie', entrepriseId: 'automobile' },
  { numero: 23, nom: 'Aéronautique', type: 'entreprise', secteur: 'Industrie', entrepriseId: 'aeronautique' },
  { numero: 24, nom: 'Matériaux', type: 'entreprise', secteur: 'Industrie', entrepriseId: 'materiaux' },
  { numero: 25, nom: 'Contrôle Fiscal', type: 'fiscal' },
  { numero: 26, nom: 'Décision', type: 'decision' },
  { numero: 27, nom: 'Géopolitique', type: 'geopolitique' },
  { numero: 28, nom: 'Décision', type: 'decision' },
  { numero: 29, nom: 'Hypermarché', type: 'entreprise', secteur: 'Grande Distribution', entrepriseId: 'hypermarche' },
  { numero: 30, nom: 'E-commerce', type: 'entreprise', secteur: 'Grande Distribution', entrepriseId: 'ecommerce' },
  { numero: 31, nom: 'Fast-food', type: 'entreprise', secteur: 'Grande Distribution', entrepriseId: 'fastfood' },
  { numero: 32, nom: 'Prime', type: 'prime', effet: 'Prime +5 cash' },
  { numero: 33, nom: 'Décision', type: 'decision' },
  { numero: 34, nom: 'Nucléaire', type: 'entreprise', secteur: 'Énergie', entrepriseId: 'nucleaire' },
  { numero: 35, nom: 'Fossile', type: 'entreprise', secteur: 'Énergie', entrepriseId: 'fossile' },
  { numero: 36, nom: 'Renouvelable', type: 'entreprise', secteur: 'Énergie', entrepriseId: 'renouvelable' },
];

export function obtenirCase(numero) {
  return PLATEAU.find(c => c.numero === numero);
}

export function calculerNouvellePosition(positionActuelle, resultatDes) {
  const nouvellePos = (positionActuelle + resultatDes) % 36;
  return nouvellePos === 0 ? 36 : nouvellePos;
}

export function aPasseParDepart(anciennePos, nouvellePos, resultatDes) {
  if (anciennePos === 0) anciennePos = 36;
  if (nouvellePos === 0) nouvellePos = 36;

  return (anciennePos + resultatDes) > 36;
}
