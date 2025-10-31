import React, { useState, useEffect } from 'react';
import './Perfil.css';

function Perfil({ onBack }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('kig-user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  if (!user) {
    return (
      <div className="perfil-container">
        <button className="back-button" onClick={onBack}>
          ← Volver al Inicio
        </button>
        <div className="no-user">
          <h2>🔐 Inicia sesión para ver tu perfil</h2>
          <p>Necesitas tener una cuenta para acceder a esta sección</p>
        </div>
      </div>
    );
  }

  return (
    <div className="perfil-container">
      <button className="back-button" onClick={onBack}>
        ← Volver al Inicio
      </button>
      
      <div className="perfil-header">
        <h2>👤 Mi Perfil</h2>
        <p>Gestiona tu cuenta y revisa tu progreso</p>
      </div>

      <div className="perfil-content">
        <div className="profile-info">
          <div className="profile-avatar">
            {user.nombre.charAt(0).toUpperCase()}
          </div>
          <h3>{user.nombre}</h3>
          <p>{user.email}</p>
        </div>

        <div className="profile-stats">
          <div className="stat-card">
            <span className="stat-value">{user.juegosJugados || 0}</span>
            <span className="stat-label">Juegos Jugados</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{user.logros || 0}</span>
            <span className="stat-label">Logros</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{user.puntos || 0}</span>
            <span className="stat-label">Puntos Totales</span>
          </div>
        </div>

        <div className="profile-actions">
          <button className="action-btn primary">
            ✏️ Editar Perfil
          </button>
          <button className="action-btn secondary">
            🏆 Ver Logros
          </button>
          <button className="action-btn secondary">
            📊 Historial de Juegos
          </button>
        </div>
      </div>
    </div>
  );
}

export default Perfil;