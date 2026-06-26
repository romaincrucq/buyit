import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { creerSession, obtenirSession, mettreAJourSession, obtenirJoueur } from '../lib/sessionService';
import { genererCodeSession } from '../lib/gameLogic';
import { ENTREPRISES } from '../data/entreprises';

export default function Heberger() {
  const navigate = useNavigate();
  const [nom, setNom] = useState('');
  const [code, setCode] = useState('');
  const [joueurs, setJoueurs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sessionCree, setSessionCree] = useState(false);

  const creerNouvelleSesion = async () => {
    if (!nom.trim()) {
      alert('Veuillez entrer votre nom');
      return;
    }

    setLoading(true);
    try {
      const nouveauCode = genererCodeSession();
      setCode(nouveauCode);
      await creerSession(nouveauCode, nom);
      setSessionCree(true);
      setJoueurs([nom]);
    } catch (error) {
      console.error('Erreur création session:', error);
      alert('Erreur lors de la création de la session');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!code) return;

    const interval = setInterval(async () => {
      try {
        const session = await obtenirSession(code);
        if (session && session.joueurs) {
          setJoueurs(Object.keys(session.joueurs));
        }
      } catch (error) {
        console.error('Erreur lecture joueurs:', error);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [code]);

  const lancerPartie = async () => {
    if (joueurs.length < 1) {
      alert('Besoin d\'au moins 1 joueur pour lancer');
      return;
    }

    try {
      console.log('Vérification que tous les joueurs sont enregistrés...');

      let tousLesJoueursExistent = false;
      let tentatives = 0;
      const maxTentatives = 5;

      while (!tousLesJoueursExistent && tentatives < maxTentatives) {
        tentatives++;
        let joueurstrouvees = 0;

        for (const nomJoueur of joueurs) {
          try {
            const joueur = await obtenirJoueur(code, nomJoueur);
            if (joueur) {
              joueurstrouvees++;
            }
          } catch (error) {
            console.log(`Erreur vérification joueur ${nomJoueur}:`, error);
          }
        }

        tousLesJoueursExistent = joueurstrouvees === joueurs.length;

        if (!tousLesJoueursExistent && tentatives < maxTentatives) {
          console.log(
            `${joueurstrouvees}/${joueurs.length} joueurs trouvés, tentative ${tentatives}/${maxTentatives}. Nouvelle tentative dans 1s...`
          );
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      if (!tousLesJoueursExistent) {
        alert('Certains joueurs ne sont pas encore enregistrés. Veuillez réessayer.');
        return;
      }

      console.log('Tous les joueurs sont enregistrés. Lancement de la partie...');

      const entreprisesIds = ENTREPRISES.map(e => e.id);
      const entreprisesPour = entreprisesIds.slice(0, joueurs.length);

      await mettreAJourSession(code, {
        statut: 'en_cours',
        entreprisesDisponibles: entreprisesPour,
      });

      navigate(`/attribution/${code}/${nom}`);
    } catch (error) {
      console.error('Erreur lancement:', error);
      alert('Erreur lors du lancement');
    }
  };

  if (!sessionCree) {
    return (
      <div className="container-sm" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <h2 style={{ marginBottom: '2rem' }}>Héberger une partie</h2>

        <div className="card">
          <label style={{ display: 'block', marginBottom: '0.5rem', textAlign: 'left' }}>
            Votre nom
          </label>
          <input
            type="text"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            placeholder="Ex: Alice"
            style={{ width: '100%', marginBottom: '1.5rem' }}
            onKeyDown={(e) => e.key === 'Enter' && creerNouvelleSesion()}
          />

          <button
            className="btn btn-primary"
            onClick={creerNouvelleSesion}
            disabled={loading}
            style={{ width: '100%' }}
          >
            {loading ? 'Création...' : 'Créer la session'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-sm" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <h2 style={{ marginBottom: '2rem', textAlign: 'center' }}>Salle d'attente</h2>

      <div className="card" style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
          Code de session
        </p>
        <p style={{ fontSize: '2.5rem', color: 'var(--accent)', fontWeight: 'bold', fontFamily: 'monospace', marginBottom: '1rem' }}>
          {code}
        </p>
        <p style={{ color: 'var(--text-muted)' }}>
          Les autres joueurs entrent ce code pour rejoindre
        </p>
      </div>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>Joueurs connectés ({joueurs.length})</h3>
        <div style={{ textAlign: 'left' }}>
          {joueurs.map((j) => (
            <div key={j} style={{ padding: '0.75rem', backgroundColor: 'rgba(201, 168, 76, 0.1)', borderRadius: '0.5rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center' }}>
              {j === nom && <span style={{ marginRight: '0.5rem' }}>👑</span>}
              <strong>{j}</strong>
              {j === nom && <span style={{ marginLeft: 'auto', fontSize: '0.875rem', color: 'var(--text-muted)' }}>(Hôte)</span>}
            </div>
          ))}
        </div>
      </div>

      <button
        className="btn btn-success"
        onClick={lancerPartie}
        style={{ width: '100%', padding: '1rem' }}
      >
        Lancer la partie
      </button>
    </div>
  );
}
