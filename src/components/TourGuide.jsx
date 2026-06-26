import { useState } from 'react';

export default function TourGuide({ etape, onEtapeChange, contenu }) {
  const etapes = [
    { numero: 1, nom: 'Pioche' },
    { numero: 2, nom: 'Lancer dés' },
    { numero: 3, nom: 'Effet case' },
    { numero: 4, nom: 'Calculs' },
    { numero: 5, nom: 'Actions' },
    { numero: 6, nom: 'Récapitulatif' },
  ];

  return (
    <div className="card" style={{ marginBottom: '2rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div className="flex justify-between items-center" style={{ marginBottom: '1rem' }}>
          <h3>Tour - Étape {etape}</h3>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            {etapes.find(e => e.numero === etape)?.nom}
          </span>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          {etapes.map((e) => (
            <button
              key={e.numero}
              onClick={() => onEtapeChange(e.numero)}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: etape === e.numero ? 'var(--accent)' : 'rgba(201, 168, 76, 0.2)',
                color: etape === e.numero ? '#000' : 'var(--text-main)',
                fontWeight: 'bold',
                transition: 'all 0.3s ease',
              }}
              disabled={etape !== e.numero}
            >
              {e.numero}
            </button>
          ))}
        </div>
      </div>

      <div style={{ borderTop: '1px solid rgba(201, 168, 76, 0.2)', paddingTop: '1.5rem' }}>
        {contenu}
      </div>
    </div>
  );
}
