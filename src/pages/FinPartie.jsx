import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { calculerValeurNette } from '../lib/gameLogic';

export default function FinPartie({ joueurs, session }) {
  const navigate = useNavigate();
  const [classement, setClassement] = useState([]);
  const [etapeBonus, setEtapeBonus] = useState(0);
  const [bonusAppliques, setBonusAppliques] = useState({});

  const bonusAvailable = [
    { emoji: '🤑', nom: 'La Machine à Cash', description: 'Plus gros revenus cumulés', montant: 15 },
    { emoji: '🔗', nom: 'Roi des Synergies', description: 'Plus de synergies actives', montant: 15 },
    { emoji: '🏝️', nom: 'Secteur Solitaire', description: 'Seul propriétaire dans son secteur', montant: 10 },
    { emoji: '🛡️', nom: 'PDG Prudent', description: 'Aucune faillite', montant: 10 },
    { emoji: '🗂️', nom: 'Collectionneur', description: 'Plus d\'entreprises', montant: 10 },
    { emoji: '🚑', nom: 'Gestionnaire de Crise', description: 'A renfloué une faillite', montant: 15 },
    { emoji: '🚀', nom: 'Pionnier', description: 'Premier palier radar atteint', montant: 10 },
  ];

  useEffect(() => {
    const calculerClassement = () => {
      const classementTemp = Object.entries(joueurs || {})
        .map(([nom, data]) => ({
          nom,
          valeurNette: calculerValeurNette(data.entreprises || []),
          cash: data.cash || 0,
          entreprises: data.entreprises || [],
        }))
        .sort((a, b) => b.valeurNette - a.valeurNette);

      setClassement(classementTemp);
    };

    calculerClassement();
  }, [joueurs]);

  const afficherBonus = () => {
    if (etapeBonus < bonusAvailable.length) {
      setEtapeBonus(etapeBonus + 1);
    }
  };

  const determinerBonusGagnants = () => {
    const bonus = {};

    if (classement.length > 0) {
      bonus['La Machine à Cash'] = classement[0].nom;
      bonus['Roi des Synergies'] = classement[0].nom;
      bonus['Collectionneur'] = classement[0].nom;
      bonus['PDG Prudent'] = classement[0].nom;
    }

    return bonus;
  };

  if (classement.length === 0) {
    return <div className="container-sm">Calcul du classement...</div>;
  }

  const bonusGagnants = determinerBonusGagnants();

  return (
    <div className="container-sm" style={{ minHeight: '100vh', paddingTop: '2rem', paddingBottom: '2rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏆</div>
        <h1>Partie Terminée!</h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
          Tour {session?.tourActuel || 20} atteint
        </p>
      </div>

      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Classement Final</h2>

        {classement.map((joueur, idx) => (
          <div
            key={joueur.nom}
            className="card"
            style={{
              marginBottom: '1rem',
              borderColor: idx === 0 ? 'var(--accent)' : 'rgba(201, 168, 76, 0.2)',
              backgroundColor: idx === 0 ? 'rgba(201, 168, 76, 0.1)' : undefined,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent)' }}>
                  #{idx + 1}
                </span>
                <div>
                  <p style={{ marginBottom: '0.25rem', fontWeight: 'bold' }}>
                    {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : ''} {joueur.nom}
                  </p>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0 }}>
                    {joueur.entreprises.length} entreprises
                  </p>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontWeight: 'bold', color: 'var(--accent)', fontSize: '1.25rem', marginBottom: '0.25rem' }}>
                  {joueur.valeurNette.toFixed(2)}
                </p>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0 }}>
                  Valeur nette
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {etapeBonus < bonusAvailable.length && (
        <div style={{ marginBottom: '3rem' }}>
          <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Cérémonie des Bonus</h2>
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '2rem' }}>
            {bonusAvailable.length - etapeBonus} bonus à révéler
          </p>

          {etapeBonus > 0 && (
            <div>
              {bonusAvailable.slice(0, etapeBonus).map((bonus, idx) => (
                <div key={idx} className="card" style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '2rem' }}>{bonus.emoji}</span>
                    <div>
                      <h4 style={{ marginBottom: '0.25rem' }}>{bonus.nom}</h4>
                      <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0 }}>
                        {bonus.description}
                      </p>
                    </div>
                  </div>
                  <p style={{ color: 'var(--accent)', fontWeight: 'bold', margin: '0.5rem 0 0 0' }}>
                    +{bonus.montant} valeur nette
                  </p>
                </div>
              ))}
            </div>
          )}

          <button
            className="btn btn-primary"
            onClick={afficherBonus}
            style={{ width: '100%' }}
          >
            {etapeBonus === 0 ? 'Révéler les Bonus' : 'Bonus suivant →'}
          </button>
        </div>
      )}

      {etapeBonus === bonusAvailable.length && (
        <div style={{ marginBottom: '2rem' }}>
          <button
            className="btn btn-success"
            onClick={() => navigate('/')}
            style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}
          >
            Nouvelle partie
          </button>
        </div>
      )}
    </div>
  );
}
