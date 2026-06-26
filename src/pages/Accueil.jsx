import { useNavigate } from 'react-router-dom';

export default function Accueil() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }} className="container-sm">
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 style={{ fontSize: '4rem', marginBottom: '1rem' }}>BUY IT</h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)' }}>Le jeu de stratégie financière</p>
      </div>

      <div className="flex flex-col gap-3" style={{ width: '100%', maxWidth: '300px' }}>
        <button className="btn btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }} onClick={() => navigate('/heberger')}>
          🏠 Héberger une partie
        </button>
        <button className="btn btn-secondary" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }} onClick={() => navigate('/rejoindre')}>
          → Rejoindre une partie
        </button>
      </div>
    </div>
  );
}
