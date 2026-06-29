import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { obtenirSession, mettreAJourSession, mettreAJourJoueur } from '../lib/sessionService';
import { obtenirEntreprise, ENTREPRISES } from '../data/entreprises';
import { SYNERGIES } from '../data/synergies';
import { CONFIG, calculerProgression, calculerRevenu, calculerNouvelleValeur, calculerCouts, calculerDividendes, estEnFaillite } from '../lib/gameLogic';
import { PLATEAU, obtenirCase, calculerNouvellePosition, aPasseParDepart } from '../data/plateau';
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

      case 3:
        const caseActuelleEtape3 = obtenirCase(position);
        const estDecision = caseActuelleEtape3?.type === 'decision';

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

      case 5:
        return (
          <div>
            <div className="card" style={{ marginBottom: '2rem' }}>
              <h3 style={{ marginBottom: '1.5rem' }}>Étape 5: Actions Optionnelles</h3>

              <div className="grid" style={{ marginBottom: '2rem' }}>
                <button className="btn btn-secondary" style={{ padding: '1rem' }}>
                  💰 Dividendes
                </button>
                <button className="btn btn-secondary" style={{ padding: '1rem' }}>
                  🏦 Autofinancer
                </button>
                <button className="btn btn-secondary" style={{ padding: '1rem' }}>
                  💳 Rembourser dette
                </button>
                <button className="btn btn-secondary" style={{ padding: '1rem' }}>
                  🃏 Jouer une carte
                </button>
              </div>

              <CarteDecision
                onCartePlayed={(carte) => {
                  console.log('Carte jouée:', carte);
                }}
                entreprisesJoueur={joueur.entreprises || []}
                caisseDisponible={{}}
              />

              <CarteGeo
                onCarteGeoPlayed={(carte) => {
                  console.log('Carte géo jouée:', carte);
                }}
              />

              <button
                className="btn btn-primary"
                onClick={afficherRecap}
                style={{ width: '100%', marginTop: '1.5rem' }}
              >
                Terminer les actions
              </button>
            </div>
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

      {session.joueurActif !== nom && (
        <div className="card" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', borderColor: 'var(--sector-energie)', marginBottom: '2rem' }}>
          <p style={{ margin: 0, fontSize: '1.1rem' }}>
            C'est le tour de <strong>{session.joueurActif}</strong>
          </p>
        </div>
      )}

      <TourGuide
        etape={etape}
        onEtapeChange={setEtape}
        contenu={renderEtape()}
      />
    </div>
  );
}
