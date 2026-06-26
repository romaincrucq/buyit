import { useNavigate } from 'react-router-dom';
import RadarChart from '../components/RadarChart';
import { obtenirEntreprise } from '../data/entreprises';
import { calculerProgression, calculerValeurNette } from '../lib/gameLogic';

export default function Dashboard({ joueur, code, onClose }) {
  const navigate = useNavigate();
  const entreprises = joueur.entreprises || [];

  const valeurNette = calculerValeurNette(entreprises);
  const progression = entreprises.length > 0
    ? (entreprises.reduce((sum, e) => sum + calculerProgression(obtenirEntreprise(e.id).radar), 0) / entreprises.length)
    : 0;

  const obtenirStatutSante = (dette, valeur) => {
    const ratio = dette / valeur;
    if (ratio > 0.50) return { emoji: '🔴', couleur: '#ef4444', label: 'Critique' };
    if (ratio > 0.25) return { emoji: '🟡', couleur: '#f59e0b', label: 'Alerte' };
    return { emoji: '🟢', couleur: '#22c55e', label: 'Sain' };
  };

  return (
    <div className="container-sm" style={{ minHeight: '100vh', paddingTop: '2rem', paddingBottom: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Dashboard de {joueur.nom}</h2>
        <button className="btn btn-secondary" onClick={onClose}>
          ← Retour
        </button>
      </div>

      <div className="grid-2" style={{ marginBottom: '2rem' }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>💰 Cash personnel</p>
          <h3 style={{ color: 'var(--accent)', fontSize: '2rem' }}>
            {joueur.cash || 0}
          </h3>
        </div>

        <div className="card" style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>📈 Progression vers victoire</p>
          <h3 style={{ color: 'var(--accent)', fontSize: '2rem' }}>
            {progression.toFixed(1)}%
          </h3>
        </div>
      </div>

      <h3 style={{ marginBottom: '1rem' }}>Entreprises ({entreprises.length})</h3>
      <div style={{ marginBottom: '2rem' }}>
        {entreprises.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>Aucune entreprise possédée</p>
        ) : (
          entreprises.map((e) => {
            const data = obtenirEntreprise(e.id);
            const sante = obtenirStatutSante(e.dette, e.valeur);

            return (
              <div key={e.id} className="card" style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                  <div>
                    <h4 style={{ marginBottom: '0.25rem' }}>{data.nom}</h4>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0 }}>
                      {data.secteur}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ marginBottom: '0.25rem' }}>
                      <strong>Valeur:</strong> {e.valeur.toFixed(2)}
                    </p>
                    <p style={{ marginBottom: '0.25rem' }}>
                      <strong>Caisse:</strong> {e.caisse.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                      Dette
                    </p>
                    <p style={{ color: sante.couleur }}>
                      {sante.emoji} {e.dette.toFixed(2)} ({sante.label})
                    </p>
                  </div>
                </div>

                <RadarChart radar={data.radar} title="Radar" />
              </div>
            );
          })
        )}
      </div>

      <h3 style={{ marginBottom: '1rem' }}>Cartes en main ({joueur.cartesEnMain?.length || 0})</h3>
      <div style={{ marginBottom: '2rem' }}>
        {joueur.cartesEnMain?.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>Aucune carte</p>
        ) : (
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {joueur.cartesEnMain?.map((carte, idx) => (
              <span
                key={idx}
                style={{
                  backgroundColor: 'rgba(201, 168, 76, 0.2)',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '0.5rem',
                  fontFamily: 'monospace',
                }}
              >
                {carte.code}
              </span>
            ))}
          </div>
        )}
      </div>

      {joueur.casierIllegal > 0 && (
        <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '1rem', borderRadius: '0.5rem' }}>
          <p style={{ color: '#ef4444', marginBottom: '0' }}>
            ⚠️ Casier illégal: {joueur.casierIllegal} points
          </p>
        </div>
      )}
    </div>
  );
}
