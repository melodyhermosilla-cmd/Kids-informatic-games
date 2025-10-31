import React from 'react';
import './MisJuegos.css';

function MisJuegos({ onBack }) {
  return (
    <div className="mis-juegos-container">
      <button className="back-button" onClick={onBack}>
        ← Volver al Inicio
      </button>
      
      <div className="mis-juegos-header">
        <h2>🎮 Mis Juegos</h2>
        <p>Próximamente: Tus juegos favoritos y progreso</p>
      </div>

      <div className="coming-soon">
        <div className="coming-soon-icon">🚧</div>
        <h3>En Desarrollo</h3>
        <p>Esta funcionalidad estará disponible pronto</p>
        <p>Podrás ver tu historial de juegos y favoritos</p>
      </div>
    </div>
  );
}

export default MisJuegos;