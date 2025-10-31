import React from 'react';
import './Puntuaciones.css';

function Puntuaciones() {
  const puntuaciones = [
    { posicion: 1, nombre: 'Ana', juego: 'Sopa de Letras - Hardware', puntaje: 950, fecha: '10/05/2023' },
    { posicion: 2, nombre: 'Carlos', juego: 'Rompecabezas - Software', puntaje: 890, fecha: '09/05/2023' },
    { posicion: 3, nombre: 'María', juego: 'Crucigrama - Hardware', puntaje: 870, fecha: '08/05/2023' },
    { posicion: 4, nombre: 'Luis', juego: 'Quiz - Software', puntaje: 820, fecha: '07/05/2023' },
    { posicion: 5, nombre: 'Sofía', juego: 'Sopa de Letras - Software', puntaje: 800, fecha: '06/05/2023' }
  ];

  return (
    <section id="puntuaciones" className="section active">
      <div className="puntuaciones-container">
        <div className="puntuaciones-header">
          <h2>🏆 PUNTUACIONES</h2>
          <p>Los mejores jugadores de la plataforma</p>
        </div>
        
        <table className="scores-table">
          <thead>
            <tr>
              <th>Posición</th>
              <th>Jugador</th>
              <th>Juego</th>
              <th>Puntuación</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {puntuaciones.map(puntuacion => (
              <tr key={puntuacion.posicion} className={puntuacion.posicion === 1 ? 'rank-1' : ''}>
                <td>{puntuacion.posicion}</td>
                <td>{puntuacion.nombre}</td>
                <td>{puntuacion.juego}</td>
                <td>{puntuacion.puntaje}</td>
                <td>{puntuacion.fecha}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="puntuaciones-info">
          <div className="info-card">
            <h4>🎯 ¿Cómo subir en la tabla?</h4>
            <p>Juega más partidas, completa niveles difíciles y consigue puntajes altos para aparecer en la tabla de los mejores.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Puntuaciones;