import React from 'react';
import './Juegos.css';

function Juegos({ onTematicaSelect }) {
  const tematicas = [
    {
      id: 'hardware',
      nombre: 'HARDWARE',
      icono: '💻',
      descripcion: 'Juegos sobre componentes físicos de computadoras',
      color: '#0f3460'
    },
    {
      id: 'software', 
      nombre: 'SOFTWARE',
      icono: '📱',
      descripcion: 'Juegos sobre programas y sistemas operativos',
      color: '#533483'
    }
  ];

  return (
    <section id="juegos" className="section active">
      <div className="juegos-container">
        <div className="juegos-header">
          <h2>🎮 JUEGOS</h2>
          <p>Selecciona una temática para empezar a jugar</p>
        </div>
        
        <div className="tematicas-grid">
          {tematicas.map(tematica => (
            <div 
              key={tematica.id}
              className="tematica-card"
              onClick={() => onTematicaSelect(tematica.id)}
              style={{ '--card-color': tematica.color }}
            >
              <div className="tematica-icon">{tematica.icono}</div>
              <h3>{tematica.nombre}</h3>
              <p>{tematica.descripcion}</p>
              <div className="tematica-arrow">→</div>
            </div>
          ))}
        </div>

        <div className="juegos-info">
          <div className="info-card">
            <h4>🚀 ¿Cómo jugar?</h4>
            <p>Selecciona una temática, elige un juego y diviértete aprendiendo informática</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Juegos;