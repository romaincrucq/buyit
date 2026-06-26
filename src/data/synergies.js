export const SYNERGIES = {
  nucleaire: ['materiaux', 'automobile', 'equipements', 'medicaments'],
  fossile: ['materiaux', 'automobile', 'aeronautique', 'cereales'],
  renouvelable: ['automobile', 'ia', 'ecommerce', 'biopremium'],
  cereales: ['hypermarche', 'ecommerce', 'fastfood', 'fossile'],
  biopremium: ['hypermarche', 'medicaments', 'renouvelable', 'boissons'],
  boissons: ['hypermarche', 'ecommerce', 'fastfood', 'reseaux'],
  hypermarche: ['cereales', 'biopremium', 'boissons', 'fastfood'],
  ecommerce: ['cereales', 'boissons', 'reseaux', 'renouvelable'],
  fastfood: ['boissons', 'jeuxvideo', 'hypermarche', 'cereales'],
  automobile: ['fossile', 'renouvelable', 'materiaux', 'equipements'],
  aeronautique: ['fossile', 'materiaux', 'equipements', 'nucleaire'],
  materiaux: ['fossile', 'automobile', 'aeronautique', 'medicaments'],
  reseaux: ['boissons', 'ecommerce', 'jeuxvideo', 'ia'],
  jeuxvideo: ['ia', 'reseaux', 'ecommerce', 'fastfood'],
  ia: ['jeuxvideo', 'reseaux', 'medicaments', 'renouvelable'],
  medicaments: ['materiaux', 'nucleaire', 'biopremium', 'ia'],
  vaccins: ['equipements', 'medicaments', 'biopremium', 'aeronautique'],
  equipements: ['vaccins', 'nucleaire', 'aeronautique', 'automobile'],
};

export const BONUS_SYNERGIE_LIEN = 0.08;
export const BONUS_SYNERGIE_SECTEUR = 0.10;
export const BONUS_MONOPOLE = 0.25;
export const MAX_SYNERGIES_ACTIVES = 3;

export function obtenirSynergies(entrepriseId) {
  return SYNERGIES[entrepriseId] || [];
}

export function estSynergie(entrepriseA, entrepriseB) {
  return SYNERGIES[entrepriseA]?.includes(entrepriseB) || false;
}
