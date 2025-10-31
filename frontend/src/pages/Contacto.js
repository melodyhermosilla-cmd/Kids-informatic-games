import React from 'react';
import './Contacto.css';

function Contacto() {
  const equipo = [
  {
    nombre: 'Anyelen Carvajal',
    correo: 'anyelencarvajal@gmail.com',
    celular: '+54 9 1141802243',
    instagram: 'https://www.instagram.com/_anyelen_18',
    imagen: '/images/anyelen.foto.jpg'  // ← RUTA CORREGIDA
  },
  {
    nombre: 'Sheila Maydana',
    correo: 'sheilamaydana80@gmail.com',
    celular: '+54 9 1161526287',
    instagram: 'https://www.instagram.com/_maydanaa_227',
    imagen: '/images/sheila.foto.jpg'   // ← RUTA CORREGIDA
  },
  {
    nombre: 'Aracely Dias',
    correo: 'aracelidias102@gmail.com',
    celular: '+54 9 1148889102',
    instagram: 'https://www.instagram.com/ara._077',
    imagen: '/images/araceli.jpg'       // ← RUTA CORREGIDA
  },
  {
    nombre: 'Melody Hermosilla',
    correo: 'melodyhermosillabeltran3@gmail.com',
    celular: '+54 9 1150594006',
    instagram: 'https://www.instagram.com/melo19_0706',
    imagen: '/images/melody.jpg'        // ← RUTA CORREGIDA
  }
];

  return (
    <section id="contacto" className="section active">
      <div className="contacto-container">
        <div className="contacto-header">
          <h2>📞 CONTACTO</h2>
          <p>Conoce al equipo detrás de Kids Informatic Games</p>
        </div>
        
        <div className="contacto">
          {equipo.map((persona, index) => (
            <div key={index} className="persona">
              
<div className="member-avatar">
  {persona.imagen ? (
    <img src={persona.imagen} alt={persona.nombre} />
  ) : (
    <div className="avatar-fallback">
      {persona.nombre.charAt(0)}
    </div>
  )}
</div>
              <div className="info">
                <h3>{persona.nombre}</h3>
                <p><strong>Correo:</strong> {persona.correo}</p>
                <p><strong>Celular:</strong> {persona.celular}</p>
                <a 
                  href={persona.instagram} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="instagram"
                >
                  Instagram
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="contacto-mensaje">
          <h4>💌 ¿Tienes preguntas o sugerencias?</h4>
          <p>No dudes en contactarnos. Estamos aquí para hacer de Kids Informatic Games la mejor experiencia educativa.</p>
        </div>
      </div>
    </section>
  );
}

export default Contacto;