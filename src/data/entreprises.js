export const ENTREPRISES = [
  // ÉNERGIE
  {
    id: 'nucleaire',
    nom: 'Nucléaire',
    secteur: 'Énergie',
    valeurInitiale: 105,
    tauxCharges: 0.06,
    radar: { rnd: 7, stabilite: 8, image: 3, efficacite: 6 }
  },
  {
    id: 'fossile',
    nom: 'Fossile',
    secteur: 'Énergie',
    valeurInitiale: 100,
    tauxCharges: 0.04,
    radar: { rnd: 3, stabilite: 6, image: 1, efficacite: 6 }
  },
  {
    id: 'renouvelable',
    nom: 'Renouvelable',
    secteur: 'Énergie',
    valeurInitiale: 90,
    tauxCharges: 0.03,
    radar: { rnd: 8, stabilite: 3, image: 9, efficacite: 4 }
  },
  // AGROALIMENTAIRE
  {
    id: 'cereales',
    nom: 'Céréales & Élevage',
    secteur: 'Agroalimentaire',
    valeurInitiale: 100,
    tauxCharges: 0.03,
    radar: { rnd: 3, stabilite: 8, image: 4, efficacite: 9 }
  },
  {
    id: 'biopremium',
    nom: 'Bio-Premium',
    secteur: 'Agroalimentaire',
    valeurInitiale: 80,
    tauxCharges: 0.03,
    radar: { rnd: 5, stabilite: 6, image: 9, efficacite: 5 }
  },
  {
    id: 'boissons',
    nom: 'Boissons',
    secteur: 'Agroalimentaire',
    valeurInitiale: 90,
    tauxCharges: 0.03,
    radar: { rnd: 4, stabilite: 7, image: 7, efficacite: 6 }
  },
  // GRANDE DISTRIBUTION
  {
    id: 'hypermarche',
    nom: 'Hypermarché',
    secteur: 'Grande Distribution',
    valeurInitiale: 100,
    tauxCharges: 0.04,
    radar: { rnd: 2, stabilite: 8, image: 4, efficacite: 8 }
  },
  {
    id: 'ecommerce',
    nom: 'E-commerce',
    secteur: 'Grande Distribution',
    valeurInitiale: 90,
    tauxCharges: 0.04,
    radar: { rnd: 8, stabilite: 4, image: 7, efficacite: 6 }
  },
  {
    id: 'fastfood',
    nom: 'Fast-food',
    secteur: 'Grande Distribution',
    valeurInitiale: 80,
    tauxCharges: 0.04,
    radar: { rnd: 3, stabilite: 8, image: 6, efficacite: 9 }
  },
  // INDUSTRIE
  {
    id: 'automobile',
    nom: 'Automobile',
    secteur: 'Industrie',
    valeurInitiale: 110,
    tauxCharges: 0.05,
    radar: { rnd: 7, stabilite: 3, image: 5, efficacite: 6 }
  },
  {
    id: 'aeronautique',
    nom: 'Aéronautique',
    secteur: 'Industrie',
    valeurInitiale: 110,
    tauxCharges: 0.05,
    radar: { rnd: 9, stabilite: 5, image: 7, efficacite: 6 }
  },
  {
    id: 'materiaux',
    nom: 'Matériaux',
    secteur: 'Industrie',
    valeurInitiale: 100,
    tauxCharges: 0.05,
    radar: { rnd: 6, stabilite: 7, image: 2, efficacite: 7 }
  },
  // TECH
  {
    id: 'reseaux',
    nom: 'Réseaux Sociaux',
    secteur: 'Tech',
    valeurInitiale: 90,
    tauxCharges: 0.03,
    radar: { rnd: 8, stabilite: 4, image: 5, efficacite: 7 }
  },
  {
    id: 'jeuxvideo',
    nom: 'Jeux Vidéo',
    secteur: 'Tech',
    valeurInitiale: 95,
    tauxCharges: 0.03,
    radar: { rnd: 8, stabilite: 4, image: 8, efficacite: 6 }
  },
  {
    id: 'ia',
    nom: 'IA',
    secteur: 'Tech',
    valeurInitiale: 95,
    tauxCharges: 0.03,
    radar: { rnd: 10, stabilite: 2, image: 6, efficacite: 4 }
  },
  // PHARMA / MÉDICAL
  {
    id: 'medicaments',
    nom: 'Médicaments',
    secteur: 'Pharma/Médical',
    valeurInitiale: 105,
    tauxCharges: 0.05,
    radar: { rnd: 8, stabilite: 7, image: 6, efficacite: 6 }
  },
  {
    id: 'vaccins',
    nom: 'Vaccins & Recherche',
    secteur: 'Pharma/Médical',
    valeurInitiale: 90,
    tauxCharges: 0.05,
    radar: { rnd: 10, stabilite: 3, image: 5, efficacite: 5 }
  },
  {
    id: 'equipements',
    nom: 'Équipements Hosp.',
    secteur: 'Pharma/Médical',
    valeurInitiale: 100,
    tauxCharges: 0.05,
    radar: { rnd: 7, stabilite: 6, image: 7, efficacite: 7 }
  },
];

export function obtenirEntreprise(id) {
  return ENTREPRISES.find(e => e.id === id);
}

export function obtenirEntreprisesParSecteur(secteur) {
  return ENTREPRISES.filter(e => e.secteur === secteur);
}
