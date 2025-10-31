import React from 'react';
import './Home.css';

function Home() {
  const iniciarAventura = () => {
    // Esto hace clic automáticamente en el link de JUEGOS del menú
    const juegosLink = document.querySelector('a[href="#juegos"]');
    if (juegosLink) {
      juegosLink.click();
    }
  };

  return (
    <section id="inicio" className="section active">
      <div className="hero">
        <div className="hero-content">
          <h2>KIDS INFORMATIC GAMES</h2>
          <p>¡Bienvenidos, la aventura está por comenzar!</p>
          <button className="cta-button" onClick={iniciarAventura}>
            EMPIEZA A JUGAR
          </button>
        </div>
      </div>

      <div className="caracteristicas">
        <div className="container">
          <div className="caracteristicas-grid">
            <div className="caracteristica-card">
              <div className="caracteristica-icon">💻</div>
              <h3>Aprende Hardware</h3>
              <p>Conoce las partes de la computadora con juegos interactivos</p>
            </div>
            
            <div className="caracteristica-card">
              <div className="caracteristica-icon">📱</div>
              <h3>Descubre Software</h3>
              <p>Juega con programas y aplicaciones de forma educativa</p>
            </div>
            
            <div className="caracteristica-card">
              <div className="caracteristica-icon">🏆</div>
              <h3>Gana Puntos</h3>
              <p>Consigue logros y sube en la tabla de posiciones</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Home;