import { ref, set, get, update, onValue, off } from 'firebase/database';
import { db } from './firebase';
import { obtenirEntreprise } from '../data/entreprises';

export async function creerSession(codeSession, nomHote) {
  const sessionRef = ref(db, `sessions/${codeSession}`);
  await set(sessionRef, {
    hote: nomHote,
    statut: 'attente',
    tourActuel: 1,
    joueurActif: nomHote,
    joueurs: {
      [nomHote]: {
        nom: nomHote,
        cash: 175,
        estHote: true,
        entreprises: [],
        cartesEnMain: [],
        casierIllegal: 0,
        statsFinales: {},
      },
    },
    entreprisesDisponibles: [],
    historiqueActions: [],
  });
}

export async function obtenirSession(codeSession) {
  const sessionRef = ref(db, `sessions/${codeSession}`);
  const snapshot = await get(sessionRef);
  return snapshot.val();
}

export async function ajouterJoueur(codeSession, nom) {
  const joueurRef = ref(db, `sessions/${codeSession}/joueurs/${nom}`);
  await set(joueurRef, {
    nom,
    cash: 175,
    estHote: false,
    entreprises: [],
    cartesEnMain: [],
    casierIllegal: 0,
    statsFinales: {},
  });
}

export async function mettreAJourJoueur(codeSession, nom, data) {
  const joueurRef = ref(db, `sessions/${codeSession}/joueurs/${nom}`);
  await update(joueurRef, data);
}

export async function mettreAJourSession(codeSession, data) {
  const sessionRef = ref(db, `sessions/${codeSession}`);
  await update(sessionRef, data);
}

export function ecouterSession(codeSession, callback) {
  const sessionRef = ref(db, `sessions/${codeSession}`);
  onValue(sessionRef, (snapshot) => {
    callback(snapshot.val());
  });

  return () => off(sessionRef);
}

export async function obtenirJoueur(codeSession, nom) {
  const joueurRef = ref(db, `sessions/${codeSession}/joueurs/${nom}`);
  const snapshot = await get(joueurRef);
  return snapshot.val();
}

export function ecouterJoueur(codeSession, nom, callback) {
  const joueurRef = ref(db, `sessions/${codeSession}/joueurs/${nom}`);
  onValue(joueurRef, (snapshot) => {
    callback(snapshot.val());
  });

  return () => off(joueurRef);
}

export async function ajouterAction(codeSession, action) {
  const actionRef = ref(db, `sessions/${codeSession}/historiqueActions`);
  const snapshot = await get(actionRef);
  const actions = snapshot.val() || [];
  actions.push({
    ...action,
    timestamp: new Date().toISOString(),
  });
  await set(actionRef, actions);
}

export async function attributerEntrepriseAuJoueur(codeSession, nomJoueur) {
  const joueurRef = ref(db, `sessions/${codeSession}/joueurs/${nomJoueur}`);
  const joueurSnapshot = await get(joueurRef);
  const joueur = joueurSnapshot.val();

  if (!joueur) {
    throw new Error('Joueur non trouvé');
  }

  if (joueur.entreprises && joueur.entreprises.length > 0) {
    return joueur.entreprises[0].id;
  }

  const disponiblesRef = ref(db, `sessions/${codeSession}/entreprisesDisponibles`);
  const dispSnapshot = await get(disponiblesRef);
  let disponibles = dispSnapshot.val() || [];

  if (disponibles.length === 0) {
    throw new Error('Pas d\'entreprise disponible');
  }

  const randomIndex = Math.floor(Math.random() * disponibles.length);
  const entrepriseId = disponibles[randomIndex];

  const entreprise = obtenirEntreprise(entrepriseId);

  const entreprisesJoueur = joueur.entreprises || [];
  entreprisesJoueur.push({
    id: entrepriseId,
    valeur: entreprise.valeurInitiale,
    valeurInitiale: entreprise.valeurInitiale,
    caisse: 0,
    dette: 0,
  });

  await update(joueurRef, { entreprises: entreprisesJoueur });

  disponibles = disponibles.filter(e => e !== entrepriseId);
  await set(disponiblesRef, disponibles);

  return entrepriseId;
}

export async function attributerEntreprise(codeSession, nomJoueur, entrepriseId, valeur) {
  const joueurRef = ref(db, `sessions/${codeSession}/joueurs/${nomJoueur}/entreprises`);
  const snapshot = await get(joueurRef);
  const entreprises = snapshot.val() || [];

  entreprises.push({
    id: entrepriseId,
    valeur,
    valeurInitiale: valeur,
    caisse: 0,
    dette: 0,
  });

  await set(joueurRef, entreprises);

  const disponiblesRef = ref(db, `sessions/${codeSession}/entreprisesDisponibles`);
  const dispSnapshot = await get(disponiblesRef);
  const disponibles = (dispSnapshot.val() || []).filter(e => e !== entrepriseId);
  await set(disponiblesRef, disponibles);
}
