import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { obtenirSession, ajouterJoueur } from '../lib/sessionService';

export default function Rejoindre() {
  const navigate = useNavigate();
  const [nom, setNom] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [rejoint, setRejoint] = useState(false);
  const [hote, setHote] = useState('');
  const [statut, setStatut] = useState('attente');

  const rejoindreSession = async () => {
    if (!nom.trim() || !code.trim()) {
      alert('Veuillez entrer votre nom et le code');
      return;
    }

    setLoading(true);
    try {
      const session = await obtenirSession(code.toUpperCase());
      if (!session) {
        alert('Session non trouvée');
        setLoading(false);
        return;
      }

      if (session.statut !== 'attente') {
        alert('La partie est déjà lancée');
        setLoading(false);
        return;
      }

      await ajouterJoueur(code.toUpperCase(), nom);
      setRejoint(true);
      setHote(session.hote);
      setCode(code.toUpperCase());

      const checkInterval = setInterval(async () => {
        try {
          const updatedSession = await obtenirSession(code.toUpperCase());
          if (updatedSession && updatedSession.statut === 'en_cours') {
            clearInterval(checkInterval);
            navigate(`/attribution/${code.toUpperCase()}/${nom}`);
          }
        } catch (error) {
          console.error('Erreur:', error);
        }
      }, 1000);
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la connexion à la session');
    } finally {
      setLoading(false);
    }
  };

  if (!rejoint) {
    return (
      <div className="container-sm" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <h2 style={{ marginBottom: '2rem' }}>Rejoindre une partie</h2>

        <div className="card">
          <label style={{ display: 'block', marginBottom: '0.5rem', textAlign: 'left' }}>
            Votre nom
          </label>
          <input
            type="text"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            placeholder="Ex: Bob"
            style={{ width: '100%', marginBottom: '1.5rem' }}
          />

          <label style={{ display: 'block', marginBottom: '0.5rem', textAlign: 'left' }}>
            Code de session (6 caractères)
          </label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="Ex: ABC123"
            maxLength="6"
            style={{ width: '100%', marginBottom: '1.5rem', fontFamily: 'monospace', fontSize: '1.25rem', textAlign: 'center' }}
            onKeyDown={(e) => e.key === 'Enter' && rejoindreSession()}
          />

          <button
            className="btn btn-primary"
            onClick={rejoindreSession}
            disabled={loading}
            style={{ width: '100%' }}
          >
            {loading ? 'Connexion...' : 'Rejoindre'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-sm" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <div className="card" style={{ textAlign: 'center', maxWidth: '400px' }}>
        <h2 style={{ marginBottom: '2rem' }}>En attente...</h2>
        <p style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>
          En attente que <strong>{hote}</strong> lance la partie
        </p>
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', animation: 'fadeIn 1s ease-in-out infinite' }}>⏳</div>
        </div>
        <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>
          Code: <span style={{ fontFamily: 'monospace', color: 'var(--accent)' }}>{code}</span>
        </p>
      </div>
    </div>
  );
}
