import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { attributerEntrepriseAuJoueur, obtenirJoueur, obtenirSession } from '../lib/sessionService';
import { obtenirEntreprise } from '../data/entreprises';

export default function Attribution() {
  const { code, nom } = useParams();
  const navigate = useNavigate();
  const [entrepriseAttribuee, setEntrepriseAttribuee] = useState(null);
  const [pret, setPret] = useState(false);
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState(null);

  useEffect(() => {
    const attribuer = async () => {
      let tentatives = 0;
      const maxTentatives = 15;
      const delaiBase = 500;

      const essayer = async () => {
        try {
          let joueur = await obtenirJoueur(code, nom);
          let nomJoueur = nom;

          if (!joueur) {
            const session = await obtenirSession(code);
            if (!session || !session.joueurs) {
              if (tentatives < maxTentatives) {
                tentatives++;
                const delai = delaiBase * (1 + tentatives * 0.2);
                console.log(
                  `Tentative ${tentatives}/${maxTentatives}: Session non trouvée, nouvelle tentative dans ${delai}ms`
                );
                setTimeout(essayer, delai);
                return;
              }
              setErreur('Session non trouvée');
              setLoading(false);
              return;
            }

            const joueurs = Object.keys(session.joueurs);
            const nomTrouve = joueurs.find(n => n.toLowerCase() === nom.toLowerCase());

            if (!nomTrouve) {
              if (tentatives < maxTentatives) {
                tentatives++;
                const delai = delaiBase * (1 + tentatives * 0.2);
                console.log(
                  `Tentative ${tentatives}/${maxTentatives}: Joueur "${nom}" non trouvé dans [${joueurs.join(
                    ', '
                  )}], nouvelle tentative dans ${delai}ms`
                );
                setTimeout(essayer, delai);
                return;
              }
              setErreur('Joueur non trouvé dans la session');
              setLoading(false);
              return;
            }

            nomJoueur = nomTrouve;
            joueur = await obtenirJoueur(code, nomJoueur);
          }

          if (!joueur) {
            if (tentatives < maxTentatives) {
              tentatives++;
              const delai = delaiBase * (1 + tentatives * 0.2);
              console.log(
                `Tentative ${tentatives}/${maxTentatives}: Données joueur vides, nouvelle tentative dans ${delai}ms`
              );
              setTimeout(essayer, delai);
              return;
            }
            setErreur('Impossible de récupérer les infos du joueur');
            setLoading(false);
            return;
          }

          let entrepriseId = null;

          if (joueur.entreprises && joueur.entreprises.length > 0) {
            entrepriseId = joueur.entreprises[0].id;
          } else {
            entrepriseId = await attributerEntrepriseAuJoueur(code, nomJoueur);
          }

          if (!entrepriseId) {
            setErreur('Pas d\'entreprise disponible');
            setLoading(false);
            return;
          }

          const entreprise = obtenirEntreprise(entrepriseId);
          setEntrepriseAttribuee({
            joueur: nomJoueur,
            entrepriseId,
            entreprise,
          });

          setLoading(false);
          setPret(true);
        } catch (error) {
          console.error('Erreur attribution (tentative ' + tentatives + '):', error);
          if (tentatives < maxTentatives) {
            tentatives++;
            const delai = delaiBase * (1 + tentatives * 0.2);
            console.log(`Tentative ${tentatives}/${maxTentatives}: Erreur, nouvelle tentative dans ${delai}ms`);
            setTimeout(essayer, delai);
            return;
          }
          setErreur(error.message || 'Erreur lors de l\'attribution');
          setLoading(false);
        }
      };

      essayer();
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

  if (erreur || !entrepriseAttribuee) {
    return (
      <div className="container-sm" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <p style={{ color: '#ef4444' }}>
          {erreur || 'Erreur lors de l\'attribution'}
        </p>
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
