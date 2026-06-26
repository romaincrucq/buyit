import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { attributerEntreprise, obtenirSession } from '../lib/sessionService';
import { obtenirEntreprise } from '../data/entreprises';

export default function Attribution() {
  const { code, nom } = useParams();
  const navigate = useNavigate();
  const [entreprises, setEntreprises] = useState([]);
  const [entrepriseAttribuee, setEntrepriseAttribuee] = useState(null);
  const [animationIndex, setAnimationIndex] = useState(-1);
  const [pret, setPret] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const attribuer = async () => {
      try {
        const session = await obtenirSession(code);
        if (!session) return;

        const joueurs = Object.keys(session.joueurs || {});
        const disponibles = session.entreprisesDisponibles || [];

        const entreprisesAttribuees = [];
        for (const joueur of joueurs) {
          if (joueur === nom && disponibles.length > 0) {
            const randomIndex = Math.floor(Math.random() * disponibles.length);
            const entrepriseId = disponibles[randomIndex];
            const entreprise = obtenirEntreprise(entrepriseId);

            entreprisesAttribuees.push({
              joueur,
              entrepriseId,
              entreprise,
            });

            await attributerEntreprise(code, joueur, entrepriseId, entreprise.valeurInitiale);
            setEntrepriseAttribuee({
              joueur,
              entrepriseId,
              entreprise,
            });
          }
        }

        setLoading(false);
        setPret(true);
      } catch (error) {
        console.error('Erreur attribution:', error);
        setLoading(false);
      }
    };

    attribuer();
  }, [code, nom]);

  const commencer = async () => {
    navigate(`/jeu/${code}/${nom}`);
  };

  if (loading) {
    return (
      <div className="container-sm" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🎲</div>
        <p>Attribution des entreprises...</p>
      </div>
    );
  }

  if (!entrepriseAttribuee) {
    return (
      <div className="container-sm" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <p style={{ color: '#ef4444' }}>Erreur lors de l'attribution</p>
      </div>
    );
  }

  const { entreprise } = entrepriseAttribuee;
  const couleurSecteur = {
    'Énergie': 'var(--sector-energie)',
    'Agroalimentaire': 'var(--sector-agro)',
    'Grande Distribution': 'var(--sector-distrib)',
    'Industrie': 'var(--sector-industrie)',
    'Tech': 'var(--sector-tech)',
    'Pharma/Médical': 'var(--sector-pharma)',
  }[entreprise.secteur] || 'var(--accent)';

  return (
    <div className="container-sm" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      {pret && (
        <div className="card" style={{ textAlign: 'center', animation: 'slideUp 0.5s ease-out' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>🎯</div>
          <h2 style={{ marginBottom: '2rem' }}>Tu as reçu</h2>

          <div style={{ backgroundColor: 'rgba(201, 168, 76, 0.1)', padding: '2rem', borderRadius: '0.75rem', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '2rem', color: couleurSecteur, marginBottom: '1rem' }}>
              {entreprise.nom}
            </h3>
            <p style={{ marginBottom: '0.5rem' }}>
              <strong>Secteur:</strong> {entreprise.secteur}
            </p>
            <p style={{ marginBottom: '0.5rem' }}>
              <strong>Valeur:</strong> {entreprise.valeurInitiale} 💰
            </p>
            <p style={{ color: 'var(--text-muted)', marginBottom: '0' }}>
              <strong>Taux de charges:</strong> {(entreprise.tauxCharges * 100).toFixed(1)}%
            </p>
          </div>

          <p style={{ marginBottom: '2rem', color: 'var(--text-muted)' }}>
            Déduit de tes 175 💰 initiaux
          </p>

          <button
            className="btn btn-success"
            onClick={commencer}
            style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}
          >
            Commencer à jouer 🚀
          </button>
        </div>
      )}
    </div>
  );
}
