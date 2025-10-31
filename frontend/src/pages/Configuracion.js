import React from 'react';
import './Configuracion.css';

function Configuracion({ onBack }) {
  return (
    <div className="configuracion-container">
      <button className="back-button" onClick={onBack}>
        ← Volver al Inicio
      </button>
      
      <div className="configuracion-header">
        <h2>⚙️ Configuración</h2>
        <p>Personaliza tu experiencia de juego</p>
      </div>

      <div className="coming-soon">
        <div className="coming-soon-icon">🔧</div>
        <h3>En Desarrollo</h3>
        <p>Opciones de configuración disponibles pronto</p>
        <p>Podrás ajustar sonido, tema y preferencias</p>
      </div>
    </div>
  );
}

export default Configuracion;