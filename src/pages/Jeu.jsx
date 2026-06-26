import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { obtenirSession, mettreAJourSession, mettreAJourJoueur } from '../lib/sessionService';
import { obtenirEntreprise, ENTREPRISES } from '../data/entreprises';
import { SYNERGIES } from '../data/synergies';
import { CONFIG, calculerProgression, calculerRevenu, calculerNouvelleValeur, calculerCouts, calculerDividendes, estEnFaillite } from '../lib/gameLogic';
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
  const [position, setPosition] = useState(0);
  const [des, setDes] = useState(0);
  const [carteActuelle, setCarteActuelle] = useState(null);
  const [showDashboard, setShowDashboard] = useState(false);
  const [faillite, setFaillite] = useState(null);
  const [changements, setChangements] = useState({});

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
        }
      } catch (error) {
        console.error('Erreur chargement:', error);
      }
    };

    charger();
    const interval = setInterval(charger, 2000);
    return () => clearInterval(interval);
  }, [code, nom]);

  const lancerDes = () => {
    const resultat = Math.floor(Math.random() * 11) + 2;
    setDes(resultat);
    const newPos = (position + resultat) % 36;
    setPosition(newPos);
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

    setEtape(1);
    setDes(0);
    setPosition(0);
    setCarteActuelle(null);
    setFaillite(null);
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
      case 1:
        return (
          <div className="card">
            <h3 style={{ marginBottom: '1.5rem' }}>Étape 1: Pioche Automatique</h3>
            <p style={{ marginBottom: '1.5rem' }}>
              Tu pioches 1 carte automatiquement ce tour.
            </p>
            <button
              className="btn btn-primary"
              onClick={() => setEtape(2)}
              style={{ width: '100%' }}
            >
              Continuer
            </button>
          </div>
        );

      case 2:
        return (
          <div className="card">
            <h3 style={{ marginBottom: '1.5rem' }}>Étape 2: Lancer les Dés</h3>
            <p style={{ marginBottom: '1rem' }}>
              Lance tes dés physiques et saisir le résultat (2-12)
            </p>

            {des === 0 ? (
              <button
                className="btn btn-primary"
                onClick={lancerDes}
                style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}
              >
                🎲 Lancer les dés
              </button>
            ) : (
              <div>
                <p style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '1.5rem', color: 'var(--accent)' }}>
                  {des}
                </p>
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
        return (
          <div className="card">
            <h3 style={{ marginBottom: '1.5rem' }}>Étape 3: Effet de la Case</h3>
            <p style={{ marginBottom: '1.5rem' }}>
              Tu arrives sur la case {position} : Effet spécial appliqué
            </p>
            <button
              className="btn btn-primary"
              onClick={effectuerCalculs}
              style={{ width: '100%' }}
            >
              Appliquer les calculs
            </button>
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
