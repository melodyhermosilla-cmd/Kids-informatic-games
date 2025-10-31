import React from 'react';
import './Introduccion.css';

function Introduccion() {
  return (
    <section id="introduccion" className="section active">
      <div className="intro-container">
        <div className="intro-header">
          <h2>📚 INTRODUCCIÓN</h2>
          <p>Conoce más sobre nuestra plataforma educativa</p>
        </div>
        
        <div className="intro-content">
          <div className="intro-text">
            <h3>KIDS INFORMATIC GAMES</h3>
            <p>
              ES UNA PLATAFORMA EDUCATIVA PARA NIÑOS DE 9 A 12 AÑOS, DONDE APRENDER 
              INFORMÁTICA SE CONVIERTE EN UN JUEGO CON ACTIVIDADES COMO SOPAS DE LETRAS, 
              CRUCIGRAMAS, PREGUNTAS Y ROMPECABEZAS, LOS NIÑOS DESCUBREN EL MUNDO DE LA 
              TECNOLOGÍA DE FORMA DIVERTIDA, SEGURA Y FUTURISTA.
            </p>
          </div>

          <div className="objetivos">
            <h4>🎯 Nuestros Objetivos</h4>
            <div className="objetivos-grid">
              <div className="objetivo-card">
                <div className="objetivo-icon">🎮</div>
                <h5>Aprendizaje Divertido</h5>
                <p>Transformar conceptos complejos en juegos entretenidos</p>
              </div>
              <div className="objetivo-card">
                <div className="objetivo-icon">💡</div>
                <h5>Desarrollo Digital</h5>
                <p>Preparar a los niños para el mundo tecnológico actual</p>
              </div>
              <div className="objetivo-card">
                <div className="objetivo-icon">🛡️</div>
                <h5>Seguridad</h5>
                <p>Entorno seguro y controlado para el aprendizaje</p>
              </div>
              <div className="objetivo-card">
                <div className="objetivo-icon">🚀</div>
                <h5>Innovación</h5>
                <p>Utilizar las últimas tecnologías para la educación</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Introduccion;