import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { obtenirSession, mettreAJourSession, mettreAJourJoueur } from '../lib/sessionService';
import { obtenirEntreprise, ENTREPRISES } from '../data/entreprises';
import { SYNERGIES } from '../data/synergies';
import { CONFIG, calculerProgression, calculerRevenu, calculerNouvelleValeur, calculerCouts, calculerDividendes, estEnFaillite } from '../lib/gameLogic';
import { PLATEAU, obtenirCase, calculerNouvellePosition, aPasseParDepart, obtenirSecteurDeLaCase, obtenirEntreprisesDisponiblesDuSecteur, obtenirEntrepriseCorrespondanteLaCase, obtenirProprietaireSecteur, obtenirCaseDePartDuSecteur } from '../data/plateau';
import { obtenirCarte } from '../data/cartes';
import TourGuide from '../components/TourGuide';
import CarteDecision from '../components/CarteDecision';
import CarteGeo from '../components/CarteGeo';
import Encheres from '../components/Encheres';
import RecapTour from '../components/RecapTour';
import Dashboard from './Dashboard';

export default function Jeu() {
  const { code, nom } = useParams();
  const navigate = useNavigate();

  const [session, setSession] = useState(null);
  const [joueur, setJoueur] = useState(null);
  const [etape, setEtape] = useState(1);
  const [position, setPosition] = useState(1);
  const [des, setDes] = useState(0);
  const [inputDes, setInputDes] = useState('');
  const [carteActuelle, setCarteActuelle] = useState(null);
  const [showDashboard, setShowDashboard] = useState(false);
  const [faillite, setFaillite] = useState(null);
  const [changements, setChangements] = useState({});
  const [erreurDes, setErreurDes] = useState('');
  const [codeGeopolitique, setCodeGeopolitique] = useState('');
  const [erreurGeo, setErreurGeo] = useState('');
  const [actionEnCours, setActionEnCours] = useState(null);
  const [entrepriseSelectionnee, setEntrepriseSelectionnee] = useState(null);
  const [montantAction, setMontantAction] = useState('');
  const [erreurAction, setErreurAction] = useState('');
  const [entreprisesDispoCaseEtape3, setEntreprisesDispoCaseEtape3] = useState([]);
  const [secteurCaseEtape3, setSecteurCaseEtape3] = useState(null);

  useEffect(() => {
    const charger = async () => {
      try {
        const sess = await obtenirSession(code);
        setSession(sess);

        if (sess && sess.joueurs && sess.joueurs[nom]) {
          const j = sess.joueurs[nom];
          setJoueur({
            ...j,
            nom,
          });

          if (j.position !== undefined && j.position !== position) {
            setPosition(j.position);
          }
        }
      } catch (error) {
        console.error('Erreur chargement:', error);
      }
    };

    charger();
    const interval = setInterval(charger, 2000);
    return () => clearInterval(interval);
  }, [code, nom]);

  useEffect(() => {
    if (etape === 1) {
      console.log('Pioche automatique en arrière-plan, passage à l\'étape 2');
      setEtape(2);
    }
  }, [etape]);

  const handleAppliquerGeo = () => {
    const codeUpper = codeGeopolitique.toUpperCase();
    const match = codeUpper.match(/^G(\d+)$/);

    if (!match) {
      setErreurGeo('Format invalide. Utilise G01, G15, etc.');
      return;
    }

    const numero = parseInt(match[1], 10);
    if (numero < 1 || numero > 50) {
      setErreurGeo('Le numéro doit être entre 01 et 50');
      return;
    }

    console.log(`Carte géopolitique appliquée: ${codeUpper}`);
    setErreurGeo('');
  };

  const validerDes = async () => {
    const resultat = parseInt(inputDes, 10);

    if (isNaN(resultat) || resultat < 2 || resultat > 12) {
      setErreurDes('Le résultat des dés doit être entre 2 et 12');
      return;
    }

    setDes(resultat);
    setErreurDes('');

    const anciennePos = position;
    const nouvellePos = calculerNouvellePosition(anciennePos, resultat);
    setPosition(nouvellePos);

    const passePar1 = aPasseParDepart(anciennePos, nouvellePos, resultat);
    const tour = session.tourActuel || 1;

    if (passePar1 && tour > 1) {
      joueur.cash = (joueur.cash || 0) + 5;
      await mettreAJourJoueur(code, nom, { cash: joueur.cash, position: nouvellePos });
    } else {
      await mettreAJourJoueur(code, nom, { position: nouvellePos });
    }

    setInputDes('');
    setEtape(3);
  };

  const passerAuJoueur = async () => {
    const joueurs = Object.keys(session.joueurs || {});
    const indexActuel = joueurs.indexOf(nom);
    const nextIndex = (indexActuel + 1) % joueurs.length;
    const nextJoueur = joueurs[nextIndex];

    await mettreAJourSession(code, {
      tourActuel: (session.tourActuel || 1) + 1,
      joueurActif: nextJoueur,
    });

    setEtape(2);
    setDes(0);
    setInputDes('');
    setCarteActuelle(null);
    setFaillite(null);
    setErreurDes('');
  };

  const effectuerCalculs = async () => {
    if (!joueur) return;

    const entreprises = joueur.entreprises || [];
    const nouveauxChangements = { cashPersonnel: joueur.cash };

    for (const e of entreprises) {
      const data = obtenirEntreprise(e.id);
      const revenu = calculerRevenu(e.valeur, data.radar);
      const couts = calculerCouts(e.valeur, data.tauxCharges);
      const progression = calculerProgression(data.radar);
      const nouvelleValeur = calculerNouvelleValeur(e.valeur, progression);

      nouveauxChangements[e.id] = {
        ancien: e.valeur,
        nouveau: nouvelleValeur,
      };

      e.valeur = nouvelleValeur;
      e.caisse = (e.caisse || 0) + revenu - couts;

      if (e.dette > 0) {
        const interets = e.dette * CONFIG.tauxInteret;
        e.caisse -= interets;
      }

      if (estEnFaillite(e.dette, e.valeur)) {
        setFaillite({ id: e.id, nom: data.nom, valeur: e.valeur, dette: e.dette });
      }
    }

    await mettreAJourJoueur(code, nom, { entreprises });
    setChangements(nouveauxChangements);
    setEtape(5);
  };

  const afficherRecap = async () => {
    setEtape(6);
  };

  const effectuerAction = async (typeAction) => {
    if (!entrepriseSelectionnee) {
      setErreurAction('Sélectionne une entreprise');
      return;
    }

    const entreprise = joueur.entreprises.find(e => e.id === entrepriseSelectionnee);
    if (!entreprise) {
      setErreurAction('Entreprise non trouvée');
      return;
    }

    switch (typeAction) {
      case 'dividendes': {
        const montant = parseInt(montantAction, 10);
        if (isNaN(montant) || montant <= 0) {
          setErreurAction('Saisir un montant valide');
          return;
        }

        const caisse = entreprise.caisse || 0;
        if (caisse < montant) {
          setErreurAction(`Caisse insuffisante (disponible: ${caisse})`);
          return;
        }

        const dividendes = Math.floor(montant * 0.70);
        joueur.cash = (joueur.cash || 0) + dividendes;
        entreprise.caisse = caisse - montant;
        console.log(`Dividendes: ${montant} prélevés de la caisse, ${dividendes} reçus`);
        break;
      }

      case 'autofinancer': {
        const montant = parseInt(montantAction, 10);
        if (isNaN(montant) || montant <= 0) {
          setErreurAction('Saisir un montant valide');
          return;
        }

        if (joueur.cash < montant) {
          setErreurAction('Cash insuffisant');
          return;
        }

        joueur.cash -= montant;
        entreprise.caisse = (entreprise.caisse || 0) + montant;
        console.log(`Autofinancement: ${montant} ajoutés à la caisse`);
        break;
      }

      case 'rembourser': {
        const montant = parseInt(montantAction, 10);
        if (isNaN(montant) || montant <= 0) {
          setErreurAction('Saisir un montant valide');
          return;
        }

        const dette = entreprise.dette || 0;
        if (dette === 0) {
          setErreurAction('Cette entreprise n\'a pas de dette.');
          return;
        }

        if (joueur.cash < montant) {
          setErreurAction('Cash insuffisant');
          return;
        }

        joueur.cash -= montant;
        entreprise.dette = Math.max(0, dette - montant);
        console.log(`Remboursement: ${montant} déduit de la dette`);
        break;
      }

      case 'carte': {
        const codeNormalisé = montantAction.toUpperCase().replace(/-/g, '');
        if (!codeNormalisé) {
          setErreurAction('Saisir un code de carte');
          return;
        }

        const carte = obtenirCarte(codeNormalisé);
        if (!carte) {
          setErreurAction(`Carte non trouvée: ${codeNormalisé}`);
          return;
        }

        console.log(`Carte jouée: ${carte.nom} (${carte.code})`);
        break;
      }
    }

    await mettreAJourJoueur(code, nom, { cash: joueur.cash, entreprises: joueur.entreprises });
    setActionEnCours(null);
    setEntrepriseSelectionnee(null);
    setMontantAction('');
    setErreurAction('');
  };

  if (!joueur || !session) {
    return <div className="container-sm">Chargement...</div>;
  }

  if (showDashboard) {
    return (
      <Dashboard
        joueur={joueur}
        code={code}
        onClose={() => setShowDashboard(false)}
      />
    );
  }

  if (session.joueurActif !== nom) {
    return (
      <div className="container-sm" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>⏳</div>
          <h3 style={{ marginBottom: '1rem' }}>C'est le tour de</h3>
          <p style={{ fontSize: '1.75rem', color: 'var(--accent)', fontWeight: 'bold', marginBottom: '2rem' }}>
            {session.joueurActif}
          </p>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
            Attends ton tour pour jouer. Tu peux consulter ton dashboard en attendant.
          </p>
          <button
            className="btn btn-secondary"
            onClick={() => setShowDashboard(true)}
            style={{ width: '100%', padding: '1rem' }}
          >
            📊 Voir mon Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (faillite) {
    return (
      <div className="container-sm" style={{ minHeight: '100vh', paddingTop: '2rem' }}>
        <Encheres
          entreprise={{ nom: faillite.nom }}
          valeurNette={faillite.valeur - faillite.dette}
          nomJoueur={nom}
          altrJoueurs={Object.keys(session.joueurs || {}).filter(j => j !== nom)}
          onRenflouer={async (montant) => {
            if (joueur.cash >= montant) {
              joueur.cash -= montant;
              const e = joueur.entreprises.find(ent => ent.id === faillite.id);
              if (e) {
                e.caisse += montant;
                await mettreAJourJoueur(code, nom, joueur);
                setFaillite(null);
                setEtape(5);
              }
            }
          }}
          onMetreAuxEncheres={async () => {
            alert('Enchères lancées pour ' + faillite.nom);
          }}
          onVendreEtat={async (montant) => {
            joueur.cash += montant;
            joueur.entreprises = joueur.entreprises.filter(e => e.id !== faillite.id);
            await mettreAJourJoueur(code, nom, joueur);
            setFaillite(null);
            setEtape(5);
          }}
        />
      </div>
    );
  }

  const renderEtape = () => {
    switch (etape) {
      case 2:
        const caseActuelle = obtenirCase(position);
        return (
          <div className="card">
            <h3 style={{ marginBottom: '1.5rem' }}>Tour {session.tourActuel || 1}: Lancer les Dés</h3>
            <p style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>
              Lance tes dés physiques et saisis le résultat (2-12)
            </p>

            {des === 0 ? (
              <div>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                    Résultat des dés :
                  </label>
                  <input
                    type="number"
                    min="2"
                    max="12"
                    value={inputDes}
                    onChange={(e) => {
                      setInputDes(e.target.value);
                      setErreurDes('');
                    }}
                    placeholder="Entrez un nombre entre 2 et 12"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      fontSize: '1.25rem',
                      textAlign: 'center',
                      marginBottom: erreurDes ? '0.5rem' : '0',
                      borderColor: erreurDes ? '#ef4444' : undefined,
                    }}
                    onKeyDown={(e) => e.key === 'Enter' && validerDes()}
                  />
                  {erreurDes && (
                    <p style={{ color: '#ef4444', margin: 0, fontSize: '0.875rem' }}>
                      {erreurDes}
                    </p>
                  )}
                </div>
                <button
                  className="btn btn-primary"
                  onClick={validerDes}
                  style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}
                >
                  🎲 Valider
                </button>
              </div>
            ) : (
              <div>
                <div style={{ backgroundColor: 'rgba(201, 168, 76, 0.1)', padding: '1.5rem', borderRadius: '0.75rem', marginBottom: '1.5rem', textAlign: 'center' }}>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: '0 0 0.5rem 0' }}>
                    Résultat des dés
                  </p>
                  <p style={{ fontSize: '3rem', color: 'var(--accent)', margin: 0, fontWeight: 'bold' }}>
                    {des}
                  </p>
                </div>
                <div style={{ backgroundColor: 'rgba(76, 175, 201, 0.1)', padding: '1.5rem', borderRadius: '0.75rem', marginBottom: '1.5rem' }}>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: '0 0 0.5rem 0' }}>
                    Tu arrives sur
                  </p>
                  <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0 0 0.25rem 0' }}>
                    Case {position}: {caseActuelle?.nom}
                  </p>
                  {caseActuelle?.effet && (
                    <p style={{ fontSize: '0.875rem', color: 'var(--accent)', margin: 0 }}>
                      {caseActuelle.effet}
                    </p>
                  )}
                </div>
                <button
                  className="btn btn-success"
                  onClick={() => setEtape(3)}
                  style={{ width: '100%' }}
                >
                  Continuer
                </button>
              </div>
            )}
          </div>
        );

      case 3: {
        const caseActuelleEtape3 = obtenirCase(position);
        const estDecision = caseActuelleEtape3?.type === 'decision';
        const estGeopolitique = caseActuelleEtape3?.type === 'geopolitique';
        const estEntreprise = caseActuelleEtape3?.type === 'entreprise';

        if (estEntreprise && secteurCaseEtape3 === null) {
          const secteur = obtenirSecteurDeLaCase(position);
          setSecteurCaseEtape3(secteur);
          const dispo = obtenirEntreprisesDisponiblesDuSecteur(secteur, session.joueurs);
          setEntreprisesDispoCaseEtape3(dispo);
        }

        return (
          <div className="card">
            {estDecision ? (
              <>
                <div style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '1rem' }}>
                  📋
                </div>
                <h3 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
                  Pioche une carte Décision dans ta pile !
                </h3>
                <p style={{ marginBottom: '2rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                  Case {position}
                </p>
                <button
                  className="btn btn-primary"
                  onClick={() => setEtape(5)}
                  style={{ width: '100%' }}
                >
                  Continuer
                </button>
              </>
            ) : estGeopolitique ? (
              <>
                <div style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '1rem' }}>
                  🌍
                </div>
                <h3 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
                  Pioche 3 cartes Géopolitiques
                </h3>
                <p style={{ marginBottom: '1.5rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                  Choisis-en une et entre son code ci-dessous
                </p>

                {codeGeopolitique === '' ? (
                  <div>
                    <div style={{ marginBottom: '1.5rem' }}>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                        Code de la carte (G01 à G50) :
                      </label>
                      <input
                        type="text"
                        value={codeGeopolitique}
                        onChange={(e) => {
                          setCodeGeopolitique(e.target.value.toUpperCase());
                          setErreurGeo('');
                        }}
                        placeholder="Ex: G15"
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          fontSize: '1.25rem',
                          textAlign: 'center',
                          marginBottom: erreurGeo ? '0.5rem' : '0',
                          borderColor: erreurGeo ? '#ef4444' : undefined,
                        }}
                        onKeyDown={(e) => e.key === 'Enter' && codeGeopolitique && handleAppliquerGeo()}
                      />
                      {erreurGeo && (
                        <p style={{ color: '#ef4444', margin: 0, fontSize: '0.875rem' }}>
                          {erreurGeo}
                        </p>
                      )}
                    </div>
                    <button
                      className="btn btn-primary"
                      onClick={handleAppliquerGeo}
                      disabled={!codeGeopolitique}
                      style={{ width: '100%' }}
                    >
                      Appliquer
                    </button>
                  </div>
                ) : (
                  <div>
                    <div style={{ backgroundColor: 'rgba(201, 168, 76, 0.1)', padding: '1rem', borderRadius: '0.75rem', marginBottom: '1.5rem', textAlign: 'center' }}>
                      <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0, color: 'var(--accent)' }}>
                        {codeGeopolitique}
                      </p>
                    </div>
                    <p style={{ marginBottom: '1.5rem', color: 'var(--text-muted)' }}>
                      Effet appliqué à tous les joueurs
                    </p>
                    <button
                      className="btn btn-success"
                      onClick={() => {
                        setCodeGeopolitique('');
                        setEtape(5);
                      }}
                      style={{ width: '100%' }}
                    >
                      Continuer
                    </button>
                  </div>
                )}
              </>
            ) : estEntreprise ? (
              <>
                <h3 style={{ marginBottom: '1.5rem' }}>🏢 Secteur {secteurCaseEtape3}</h3>
                <p style={{ marginBottom: '1.5rem', color: 'var(--text-muted)' }}>
                  Choisis une entreprise à acheter dans ce secteur (si disponible)
                </p>

                {entreprisesDispoCaseEtape3.length > 0 ? (
                  <div>
                    <div style={{ marginBottom: '1.5rem' }}>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                        Entreprises disponibles :
                      </label>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {entreprisesDispoCaseEtape3.map(idEntreprise => {
                          const ent = obtenirEntreprise(idEntreprise);
                          return (
                            <button
                              key={idEntreprise}
                              className="btn btn-secondary"
                              onClick={() => {
                                joueur.entreprises.push({
                                  id: idEntreprise,
                                  valeur: ent.valeurInitiale,
                                  valeurInitiale: ent.valeurInitiale,
                                  caisse: 0,
                                  dette: 0,
                                });
                                mettreAJourJoueur(code, nom, { entreprises: joueur.entreprises });
                                setSecteurCaseEtape3(null);
                                setEntreprisesDispoCaseEtape3([]);
                                setEtape(5);
                              }}
                              style={{ padding: '0.75rem', textAlign: 'left' }}
                            >
                              💰 {ent.nom} ({ent.valeurInitiale} cash)
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ) : (() => {
                  const proprietaire = obtenirProprietaireSecteur(secteurCaseEtape3, session.joueurs);
                  const caseDepart = obtenirCaseDePartDuSecteur(secteurCaseEtape3);

                  return (
                    <div>
                      <p style={{ marginBottom: '1.5rem', color: 'var(--accent)', fontWeight: 'bold' }}>
                        ⚠️ Toutes les entreprises du secteur sont déjà achetées !
                      </p>
                      <p style={{ marginBottom: '1.5rem', color: 'var(--text-muted)' }}>
                        {proprietaire ? (
                          <>
                            Tu dois payer 10 💰 à <strong>{proprietaire}</strong> (propriétaire de la case {caseDepart})
                          </>
                        ) : (
                          'Tu dois payer 10 💰 de loyer.'
                        )}
                      </p>
                      <button
                        className="btn btn-primary"
                        onClick={async () => {
                          const montantLoyer = 10;
                          joueur.cash = Math.max(0, (joueur.cash || 0) - montantLoyer);
                          await mettreAJourJoueur(code, nom, { cash: joueur.cash });

                          if (proprietaire && proprietaire !== nom) {
                            const proprietaireData = session.joueurs[proprietaire];
                            if (proprietaireData) {
                              proprietaireData.cash = (proprietaireData.cash || 0) + montantLoyer;
                              await mettreAJourJoueur(code, proprietaire, { cash: proprietaireData.cash });
                            }
                          }

                          setSecteurCaseEtape3(null);
                          setEntreprisesDispoCaseEtape3([]);
                          setEtape(5);
                        }}
                        style={{ width: '100%' }}
                      >
                        Payer le loyer
                      </button>
                    </div>
                  );
                })()}
              </>
            ) : (
              <>
                <h3 style={{ marginBottom: '1.5rem' }}>Case {position}: {caseActuelleEtape3?.nom}</h3>
                <p style={{ marginBottom: '1.5rem', color: 'var(--text-muted)' }}>
                  {caseActuelleEtape3?.effet || 'Effet de la case appliqué'}
                </p>
                <button
                  className="btn btn-primary"
                  onClick={effectuerCalculs}
                  style={{ width: '100%' }}
                >
                  Continuer
                </button>
              </>
            )}
          </div>
        );
      }

      case 5:
        if (actionEnCours) {
          return (
            <div className="card">
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setActionEnCours(null);
                  setEntrepriseSelectionnee(null);
                  setMontantAction('');
                  setErreurAction('');
                }}
                style={{ marginBottom: '1.5rem', width: '100%' }}
              >
                ← Retour aux actions
              </button>

              <h3 style={{ marginBottom: '1.5rem' }}>
                {actionEnCours === 'dividendes' && '💰 Dividendes'}
                {actionEnCours === 'autofinancer' && '🏦 Autofinancer'}
                {actionEnCours === 'rembourser' && '💳 Rembourser dette'}
                {actionEnCours === 'carte' && '🃏 Jouer une carte'}
              </h3>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  Sélectionne une entreprise :
                </label>
                <select
                  value={entrepriseSelectionnee || ''}
                  onChange={(e) => {
                    setEntrepriseSelectionnee(e.target.value);
                    setErreurAction('');
                  }}
                  style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem' }}
                >
                  <option value="">-- Choisis une entreprise --</option>
                  {(joueur.entreprises || []).map(e => (
                    <option key={e.id} value={e.id}>
                      {obtenirEntreprise(e.id)?.nom} (Valeur: {e.valeur})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  {actionEnCours === 'dividendes' && 'Montant à distribuer :'}
                  {actionEnCours === 'autofinancer' && 'Montant à ajouter à la caisse :'}
                  {actionEnCours === 'rembourser' && 'Montant à rembourser :'}
                  {actionEnCours === 'carte' && 'Code de la carte :'}
                </label>
                <input
                  type="text"
                  value={montantAction}
                  onChange={(e) => {
                    setMontantAction(e.target.value);
                    setErreurAction('');
                  }}
                  placeholder={actionEnCours === 'carte' ? 'Ex: DD01 ou D-D01 ou dd01' : 'Ex: 50'}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    marginBottom: erreurAction ? '0.5rem' : '1.5rem',
                    borderColor: erreurAction ? '#ef4444' : undefined,
                  }}
                />
                {erreurAction && (
                  <p style={{ color: '#ef4444', margin: '0 0 1.5rem 0', fontSize: '0.875rem' }}>
                    {erreurAction}
                  </p>
                )}
              </div>

              <button
                className="btn btn-success"
                onClick={() => effectuerAction(actionEnCours)}
                style={{ width: '100%' }}
              >
                Appliquer
              </button>
            </div>
          );
        }

        return (
          <div className="card">
            <h3 style={{ marginBottom: '1.5rem' }}>Actions Optionnelles</h3>

            <p style={{ marginBottom: '1.5rem', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Choisis les actions à effectuer ce tour (ou passe directement)
            </p>

            <div className="grid" style={{ marginBottom: '2rem', gap: '0.75rem' }}>
              <button
                className="btn btn-secondary"
                onClick={() => setActionEnCours('dividendes')}
                style={{ padding: '1rem', fontSize: '0.95rem' }}
              >
                💰 Dividendes
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setActionEnCours('autofinancer')}
                style={{ padding: '1rem', fontSize: '0.95rem' }}
              >
                🏦 Autofinancer
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setActionEnCours('rembourser')}
                style={{ padding: '1rem', fontSize: '0.95rem' }}
              >
                💳 Rembourser dette
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setActionEnCours('carte')}
                style={{ padding: '1rem', fontSize: '0.95rem' }}
              >
                🃏 Jouer une carte
              </button>
            </div>

            <button
              className="btn btn-primary"
              onClick={afficherRecap}
              style={{ width: '100%', padding: '1rem' }}
            >
              ✅ Terminer mon tour
            </button>
          </div>
        );

      case 6:
        return (
          <RecapTour
            tour={session.tourActuel || 1}
            entreprises={joueur.entreprises || []}
            changements={changements}
            onTerminer={passerAuJoueur}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="container-sm" style={{ minHeight: '100vh', paddingTop: '2rem', paddingBottom: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Tour {session.tourActuel || 1} - {nom}</h2>
        <button
          className="btn btn-secondary"
          onClick={() => setShowDashboard(true)}
          style={{ marginRight: '0.5rem' }}
        >
          📊 Dashboard
        </button>
      </div>

      <TourGuide
        etape={etape}
        onEtapeChange={setEtape}
        contenu={renderEtape()}
      />
    </div>
  );
}
