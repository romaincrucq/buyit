export default function RecapTour({ tour, entreprises, changements, onTerminer }) {
  return (
    <div className="card">
      <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Récapitulatif du Tour</h2>

      <div style={{ backgroundColor: 'rgba(201, 168, 76, 0.1)', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1.5rem' }}>
        <p style={{ marginBottom: '0' }}>
          <strong>Tour {tour}</strong>
        </p>
      </div>

      <h3 style={{ marginBottom: '1rem' }}>Variations de valeur</h3>
      <div style={{ marginBottom: '2rem' }}>
        {entreprises.map((e) => {
          const changement = changements[e.id] || { ancien: e.valeur, nouveau: e.valeur };
          const variation = changement.nouveau - changement.ancien;
          const couleur = variation > 0 ? '#22c55e' : variation < 0 ? '#ef4444' : 'var(--text-muted)';

          return (
            <div
              key={e.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.75rem',
                borderBottom: '1px solid rgba(201, 168, 76, 0.1)',
              }}
            >
              <div>
                <p style={{ marginBottom: '0.25rem', fontWeight: 'bold' }}>
                  {e.nom}
                </p>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0 }}>
                  {changement.ancien.toFixed(2)} → {changement.nouveau.toFixed(2)}
                </p>
              </div>
              <p style={{ color: couleur, fontWeight: 'bold', margin: 0 }}>
                {variation > 0 ? '+' : ''}{variation.toFixed(2)}
              </p>
            </div>
          );
        })}
      </div>

      <div style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)', padding: '1rem', borderRadius: '0.5rem', marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '0.5rem', color: '#22c55e' }}>💰 Cash Personnel</h3>
        <p style={{ margin: 0, fontSize: '1.5rem', color: '#22c55e' }}>
          {changements.cashPersonnel?.toFixed(2) || '0.00'}
        </p>
      </div>

      <button
        className="btn btn-success"
        onClick={onTerminer}
        style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}
      >
        Terminer mon tour
      </button>
    </div>
  );
}
