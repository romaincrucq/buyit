import { useState } from 'react';

const CARTES_GEO = {
  'G01': { nom: 'Crise Énergétique', secteurs: ['Énergie'], effet: '-2 Efficacité pendant 2 tours' },
  'G02': { nom: 'Boom Agricole', secteurs: ['Agroalimentaire'], effet: '+3 Efficacité pendant 3 tours' },
  'G03': { nom: 'Régulation E-commerce', secteurs: ['Grande Distribution'], effet: '-1 Image pendant 2 tours' },
  'G04': { nom: 'Hausse des Matières', secteurs: ['Industrie'], effet: '+2 Coûts pendant 2 tours' },
  'G05': { nom: 'Boom Tech', secteurs: ['Tech'], effet: '+3 R&D pendant 3 tours' },
  'G06': { nom: 'Découverte Médicale', secteurs: ['Pharma/Médical'], effet: '+2 Image, +2 R&D pendant 3 tours' },
  'G07': { nom: 'Pandémie Mondiale', secteurs: ['Pharma/Médical', 'Tech'], effet: '+3 Efficacité secteur Pharma, +2 Tech pendant 2 tours' },
  'G08': { nom: 'Crise Climatique', secteurs: ['Énergie', 'Agroalimentaire'], effet: '-2 tous les deux secteurs pendant 3 tours' },
  'G09': { nom: 'Boom Durable', secteurs: ['Énergie', 'Agroalimentaire'], effet: '+2 Image pour énergie renouvelable et Bio' },
  'G10': { nom: 'Crash Boursier', secteurs: ['Tech'], effet: '-3 Valeur Tech pendant 2 tours' },
};

export default function CarteGeo({ onCarteGeoPlayed }) {
  const [code, setCode] = useState('');
  const [carte, setCarte] = useState(null);
  const [erreur, setErreur] = useState('');

  const chercherCarte = () => {
    const codeNum = parseInt(code.substring(1));
    const carteCode = `G${String(codeNum).padStart(2, '0')}`;
    const c = CARTES_GEO[carteCode];

    if (!c) {
      setErreur('Carte géopolitique non reconnue (G01-G50)');
      setCarte(null);
      return;
    }

    setCarte({ code: carteCode, ...c });
    setErreur('');
  };

  const jouerCarte = () => {
    if (!carte) {
      setErreur('Cherchez une carte d\'abord');
      return;
    }

    onCarteGeoPlayed(carte);

    setCode('');
    setCarte(null);
    setErreur('');
  };

  return (
    <div className="card">
      <h3 style={{ marginBottom: '1.5rem' }}>Carte Géopolitique</h3>

      <label style={{ display: 'block', marginBottom: '0.5rem' }}>
        Code Géopolitique (G01-G50)
      </label>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <input
          type="text"
          value={code}
          onChange={(e) => {
            setCode(e.target.value.toUpperCase());
            setErreur('');
          }}
          placeholder="G01"
          maxLength="3"
          style={{ flex: 1, fontFamily: 'monospace', fontSize: '1.1rem', textAlign: 'center' }}
        />
        <button className="btn btn-secondary" onClick={chercherCarte}>
          Chercher
        </button>
      </div>

      {carte && (
        <div style={{ backgroundColor: 'rgba(201, 168, 76, 0.1)', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1.5rem' }}>
          <p style={{ marginBottom: '0.5rem' }}>
            <strong>{carte.nom}</strong>
          </p>
          <p style={{ marginBottom: '0.5rem', color: 'var(--text-muted)' }}>
            Secteurs: {carte.secteurs.join(', ')}
          </p>
          <p style={{ color: 'var(--accent) ' }}>
            {carte.effet}
          </p>
        </div>
      )}

      {erreur && (
        <p style={{ color: '#ef4444', marginBottom: '1rem' }}>⚠️ {erreur}</p>
      )}

      <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1rem' }}>
        Tous les joueurs sont affectés par cette carte.
      </p>

      <button
        className="btn btn-danger"
        onClick={jouerCarte}
        disabled={!carte}
        style={{ width: '100%' }}
      >
        Jouer Carte Géopolitique
      </button>
    </div>
  );
}
