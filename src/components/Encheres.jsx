import { useState, useEffect } from 'react';

export default function Encheres({ entreprise, valeurNette, nomJoueur, altrJoueurs, onRenflouer, onMetreAuxEncheres, onVendreEtat }) {
  const [montantRenfloue, setMontantRenfloue] = useState('');
  const [option, setOption] = useState(null);
  const [erreur, setErreur] = useState('');
  const [timer, setTimer] = useState(30);

  useEffect(() => {
    if (!option || option !== 'encheres') return;

    const interval = setInterval(() => {
      setTimer((t) => (t > 0 ? t - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [option]);

  const valeurMinEncheres = Math.max(valeurNette * 0.40, 20);

  const renflouer = () => {
    const montant = parseInt(montantRenfloue);
    if (isNaN(montant) || montant <= 0) {
      setErreur('Montant invalide');
      return;
    }

    onRenflouer(montant);
  };

  const mettreAuxEncheres = () => {
    onMetreAuxEncheres(valeurMinEncheres);
  };

  const vendreEtat = () => {
    onVendreEtat(valeurNette * 0.30);
  };

  return (
    <div className="card" style={{ borderColor: '#ef4444' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
        <span style={{ fontSize: '2rem', marginRight: '1rem' }}>⚠️</span>
        <div>
          <h3 style={{ marginBottom: '0.25rem', color: '#ef4444' }}>Faillite!</h3>
          <p style={{ color: 'var(--text-muted)', margin: 0 }}>
            {entreprise.nom} est en situation critique
          </p>
        </div>
      </div>

      <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1.5rem' }}>
        <p style={{ marginBottom: '0.5rem' }}>
          <strong>Valeur nette:</strong> {valeurNette.toFixed(2)} 💰
        </p>
        <p style={{ marginBottom: '0.5rem' }}>
          <strong>Taux d'endettement:</strong> Critique
        </p>
        <p style={{ color: 'var(--text-muted)' }}>
          Tu as 3 options pour sortir de cette situation.
        </p>
      </div>

      <div className="grid-2" style={{ marginBottom: '1.5rem' }}>
        {/* Option 1: Renflouer */}
        <button
          className={`card ${option === 'renflouer' ? 'selected' : ''}`}
          onClick={() => setOption('renflouer')}
          style={{
            cursor: 'pointer',
            backgroundColor: option === 'renflouer' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(0,0,0,0.2)',
            borderColor: option === 'renflouer' ? '#22c55e' : 'rgba(201, 168, 76, 0.2)',
            padding: '1rem',
          }}
        >
          <p style={{ marginBottom: '0.5rem' }}>💰 Renflouer</p>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Injecter du cash personnel
          </p>
        </button>

        {/* Option 2: Enchères */}
        <button
          className={`card ${option === 'encheres' ? 'selected' : ''}`}
          onClick={() => {
            setOption('encheres');
            setTimer(30);
          }}
          style={{
            cursor: 'pointer',
            backgroundColor: option === 'encheres' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(0,0,0,0.2)',
            borderColor: option === 'encheres' ? '#3b82f6' : 'rgba(201, 168, 76, 0.2)',
            padding: '1rem',
          }}
        >
          <p style={{ marginBottom: '0.5rem' }}>🔨 Enchères</p>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Vendre aux autres joueurs
          </p>
        </button>

        {/* Option 3: Vendre à l'État */}
        <button
          className={`card ${option === 'etat' ? 'selected' : ''}`}
          onClick={() => setOption('etat')}
          style={{
            cursor: 'pointer',
            backgroundColor: option === 'etat' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(0,0,0,0.2)',
            borderColor: option === 'etat' ? '#ef4444' : 'rgba(201, 168, 76, 0.2)',
            padding: '1rem',
          }}
        >
          <p style={{ marginBottom: '0.5rem' }}>🏛️ État</p>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Vendre à prix réduit
          </p>
        </button>
      </div>

      {/* Détails option sélectionnée */}
      {option === 'renflouer' && (
        <div style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            Montant à injecter (💰 perso)
          </label>
          <input
            type="number"
            value={montantRenfloue}
            onChange={(e) => setMontantRenfloue(e.target.value)}
            placeholder="0"
            style={{ width: '100%', marginBottom: '1rem' }}
          />
          {erreur && <p style={{ color: '#ef4444', marginBottom: '0.5rem' }}>⚠️ {erreur}</p>}
          <button
            className="btn btn-success"
            onClick={renflouer}
            style={{ width: '100%' }}
          >
            Renflouer
          </button>
        </div>
      )}

      {option === 'encheres' && (
        <div style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1.5rem' }}>
          <p style={{ marginBottom: '1rem' }}>
            <strong>Prix de départ:</strong> {valeurMinEncheres.toFixed(2)} 💰
          </p>
          <p style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>
            Autres joueurs: {altrJoueurs.join(', ')}
          </p>
          <p style={{ marginBottom: '1rem', fontSize: '0.875rem' }}>
            ⏱️ Temps restant: <strong>{timer}s</strong>
          </p>
          <button
            className="btn btn-primary"
            onClick={mettreAuxEncheres}
            style={{ width: '100%' }}
          >
            Lancer les enchères
          </button>
        </div>
      )}

      {option === 'etat' && (
        <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1.5rem' }}>
          <p style={{ marginBottom: '1rem' }}>
            <strong>Prix proposé par l'État:</strong> {(valeurNette * 0.30).toFixed(2)} 💰
          </p>
          <p style={{ marginBottom: '1rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            L'entreprise sort du jeu. Elle n'appartiendra à personne.
          </p>
          <button
            className="btn btn-danger"
            onClick={vendreEtat}
            style={{ width: '100%' }}
          >
            Accepter
          </button>
        </div>
      )}
    </div>
  );
}
