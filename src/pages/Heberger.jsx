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
  const [verifying, setVerifying] = useState(false);
  const [verifyingMessage, setVerifyingMessage] = useState('');

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

    setVerifying(true);
    setVerifyingMessage('Vérification des connexions...');

    try {
      console.log('Vérification que tous les joueurs sont complètement enregistrés...');

      let tousLesJoueursOK = false;
      let tentatives = 0;
      const maxTentatives = 20;
      const delaiVérification = 500;

      while (!tousLesJoueursOK && tentatives < maxTentatives) {
        tentatives++;
        let joueursValides = 0;
        const messages = [];

        for (const nomJoueur of joueurs) {
          try {
            const joueur = await obtenirJoueur(code, nomJoueur);
            if (joueur && joueur.nom && joueur.cash !== undefined) {
              joueursValides++;
            } else {
              messages.push(`${nomJoueur}: données incomplètes`);
            }
          } catch (error) {
            messages.push(`${nomJoueur}: non trouvé`);
          }
        }

        tousLesJoueursOK = joueursValides === joueurs.length;

        if (!tousLesJoueursOK && tentatives < maxTentatives) {
          const tempsRestant = Math.ceil(((maxTentatives - tentatives) * delaiVérification) / 1000);
          setVerifyingMessage(
            `Vérification des connexions... (${joueursValides}/${joueurs.length} connectés) - ${tempsRestant}s`
          );
          console.log(
            `${joueursValides}/${joueurs.length} joueurs valides, tentative ${tentatives}/${maxTentatives}. ${messages.length > 0 ? 'Problèmes: ' + messages.join(', ') : ''}`
          );
          await new Promise(resolve => setTimeout(resolve, delaiVérification));
        }
      }

      if (!tousLesJoueursOK) {
        setVerifying(false);
        alert('Certains joueurs ne sont pas complètement connectés après 10 secondes. Veuillez réessayer.');
        return;
      }

      console.log('Tous les joueurs sont complètement enregistrés. Lancement de la partie...');
      setVerifyingMessage('Lancement de la partie...');

      const entreprisesIds = ENTREPRISES.map(e => e.id);
      const entreprisesPour = entreprisesIds.slice(0, joueurs.length);

      await mettreAJourSession(code, {
        statut: 'en_cours',
        entreprisesDisponibles: entreprisesPour,
      });

      setVerifying(false);
      navigate(`/attribution/${code}/${nom}`);
    } catch (error) {
      console.error('Erreur lancement:', error);
      setVerifying(false);
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

  if (verifying) {
    return (
      <div className="container-sm" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1.5rem', animation: 'pulse 1.5s ease-in-out infinite' }}>
            🔍
          </div>
          <h3 style={{ marginBottom: '1rem' }}>{verifyingMessage}</h3>
          <div style={{
            height: '4px',
            backgroundColor: 'rgba(201, 168, 76, 0.2)',
            borderRadius: '2px',
            overflow: 'hidden',
            marginBottom: '1rem'
          }}>
            <div style={{
              height: '100%',
              backgroundColor: 'var(--accent)',
              animation: 'slideRight 2s ease-in-out infinite',
              width: '30%'
            }} />
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
            Vérification de la connexion de tous les joueurs avant lancement...
          </p>
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
        disabled={verifying}
        style={{ width: '100%', padding: '1rem' }}
      >
        {verifying ? 'Lancement...' : 'Lancer la partie'}
      </button>
    </div>
  );
}
