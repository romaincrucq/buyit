import { useState } from 'react';

const CARTES_DECISION = {
  'D-L01': { nom: 'Pub TV', tier: 'Léger', coût: 10, effet: '+2 Image' },
  'D-L02': { nom: 'Réseau Local', tier: 'Léger', coût: 10, effet: '+1 Efficacité' },
  'D-L03': { nom: 'Formation Basique', tier: 'Léger', coût: 10, effet: '+2 Stabilité' },
  'D-C01': { nom: 'Campagne Nationale', tier: 'Standard', coût: 20, effet: '+3 Image' },
  'D-C02': { nom: 'Recherche Mineure', tier: 'Standard', coût: 20, effet: '+2 R&D' },
  'D-C03': { nom: 'Optimisation', tier: 'Standard', coût: 20, effet: '+2 Efficacité' },
  'D-F01': { nom: 'Partenariat Stratégique', tier: 'Fort', coût: 35, effet: '+3 R&D, +2 Efficacité' },
  'D-F02': { nom: 'Restructuration', tier: 'Fort', coût: 35, effet: '+3 Stabilité' },
  'D-F03': { nom: 'Rachat Concurrent', tier: 'Fort', coût: 35, effet: '+4 Efficacité' },
  'D-P01': { nom: 'Fusion Majeure', tier: 'Prestige', coût: 50, effet: '+5 Tous' },
  'D-P02': { nom: 'Entrée Bourse', tier: 'Prestige', coût: 60, effet: '+4 Image, +3 Efficacité' },
  'D-P03': { nom: 'Innovation Révolution', tier: 'Prestige', coût: 50, effet: '+5 R&D, +3 Efficacité' },
  'D-O01': { nom: 'Sabotage Concurrent', tier: 'Offensive', coût: 0, effet: '-2 Efficacité à adversaire' },
  'D-O02': { nom: 'Rumeur Malveillante', tier: 'Offensive', coût: 0, effet: '-2 Image à adversaire' },
  'D-S01': { nom: 'Intervention Gouvernementale', tier: 'Spéciale', coût: 0, effet: 'Annule une faillite' },
  'D-I01': { nom: 'Fraude Comptable', tier: 'Illégale', coût: 0, effet: '+3 Caisse, casier+1' },
};

export default function CarteDecision({ onCartePlayed, entreprisesJoueur, caisseDisponible }) {
  const [code, setCode] = useState('');
  const [entrepriseTarget, setEntrepriseTarget] = useState('');
  const [erreur, setErreur] = useState('');
  const [carte, setCarte] = useState(null);

  const cherchercarte = () => {
    const c = CARTES_DECISION[code.toUpperCase()];
    if (!c) {
      setErreur('Code carte non reconnu');
      setCarte(null);
      return;
    }
    setCarte(c);
    setErreur('');
  };

  const jouerCarte = () => {
    if (!carte || !entrepriseTarget) {
      setErreur('Sélectionnez une entreprise cible');
      return;
    }

    const caisse = caisseDisponible[entrepriseTarget] || 0;
    if (carte.coût > 0 && caisse < carte.coût) {
      setErreur('Caisse insuffisante pour cette carte');
      return;
    }

    onCartePlayed({
      code: code.toUpperCase(),
      carte,
      entrepriseTarget,
    });

    setCode('');
    setEntrepriseTarget('');
    setCarte(null);
    setErreur('');
  };

  return (
    <div className="card">
      <h3 style={{ marginBottom: '1.5rem' }}>Jouer une Carte Décision</h3>

      <label style={{ display: 'block', marginBottom: '0.5rem' }}>
        Code Carte (ex: D-L01)
      </label>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <input
          type="text"
          value={code}
          onChange={(e) => {
            setCode(e.target.value.toUpperCase());
            setErreur('');
          }}
          placeholder="D-L01"
          style={{ flex: 1 }}
        />
        <button className="btn btn-secondary" onClick={cherchercarte}>
          Chercher
        </button>
      </div>

      {carte && (
        <div style={{ backgroundColor: 'rgba(201, 168, 76, 0.1)', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1.5rem' }}>
          <p style={{ marginBottom: '0.5rem' }}>
            <strong>{carte.nom}</strong> ({carte.tier})
          </p>
          <p style={{ marginBottom: '0.5rem' }}>
            Coût: <strong>{carte.coût}</strong> 💰
          </p>
          <p style={{ color: 'var(--text-muted)' }}>
            {carte.effet}
          </p>
        </div>
      )}

      {carte && carte.coût > 0 && (
        <>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            Entreprise à débiter
          </label>
          <select
            value={entrepriseTarget}
            onChange={(e) => setEntrepriseTarget(e.target.value)}
            style={{ width: '100%', marginBottom: '1.5rem' }}
          >
            <option value="">-- Sélectionner --</option>
            {entreprisesJoueur.map((e) => (
              <option key={e.id} value={e.id}>
                {e.nom} (Caisse: {caisseDisponible[e.id] || 0})
              </option>
            ))}
          </select>
        </>
      )}

      {erreur && (
        <p style={{ color: '#ef4444', marginBottom: '1rem' }}>⚠️ {erreur}</p>
      )}

      <button
        className="btn btn-success"
        onClick={jouerCarte}
        disabled={!carte || (carte.coût > 0 && !entrepriseTarget)}
        style={{ width: '100%' }}
      >
        Confirmer
      </button>
    </div>
  );
}
