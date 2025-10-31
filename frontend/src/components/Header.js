import React, { useState, useEffect } from 'react';
import './Header.css';

const Header = ({ currentSection, onSectionChange }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);

  // Cargar usuario al iniciar
  useEffect(() => {
    const savedUser = localStorage.getItem('kig-user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleSectionChange = (section) => {
    onSectionChange(section);
    setDropdownOpen(false);
  };

  const handleLogin = (email, password) => {
    // Simulación de login (en una app real esto iría al backend)
    const userData = {
      nombre: email.split('@')[0],
      email: email,
      juegosJugados: 0,
      logros: 0,
      puntos: 0
    };
    
    setUser(userData);
    localStorage.setItem('kig-user', JSON.stringify(userData));
    setLoginModalOpen(false);
    setDropdownOpen(false);
  };

  const handleRegister = (nombre, email, password) => {
    const userData = {
      nombre: nombre,
      email: email,
      juegosJugados: 0,
      logros: 0,
      puntos: 0
    };
    
    setUser(userData);
    localStorage.setItem('kig-user', JSON.stringify(userData));
    setRegisterModalOpen(false);
    setDropdownOpen(false);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('kig-user');
    setDropdownOpen(false);
  };

  return (
    <header>
      <div className="header-container">
        <div className="logo">
          <div className="logo-icon">🤖</div>
          <h1>Kids Informatic Games</h1>
        </div>
        
        <nav>
          <ul>
            <li>
              <a 
                href="#inicio" 
                className={`nav-link ${currentSection === 'inicio' ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleSectionChange('inicio');
                }}
              >
                INICIO
              </a>
            </li>
            <li>
              <a 
                href="#introduccion" 
                className={`nav-link ${currentSection === 'introduccion' ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleSectionChange('introduccion');
                }}
              >
                INTRODUCCIÓN
              </a>
            </li>
            <li>
              <a 
                href="#juegos" 
                className={`nav-link ${currentSection === 'juegos' ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleSectionChange('juegos');
                }}
              >
                JUEGOS
              </a>
            </li>
            <li>
              <a 
                href="#contacto" 
                className={`nav-link ${currentSection === 'contacto' ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleSectionChange('contacto');
                }}
              >
                CONTACTO
              </a>
            </li>
          </ul>
        </nav>
        
        {/* MENÚ DESPLEGABLE DEL USUARIO */}
        <div className="user-menu">
          <button 
            className="user-btn"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <span>{user ? user.nombre : 'Usuario'}</span>
            <span>▼</span>
          </button>
          
          {dropdownOpen && (
            <div className="dropdown-menu show">
              {!user ? (
                <>
                  <a href="#login" onClick={(e) => { 
                    e.preventDefault(); 
                    setLoginModalOpen(true);
                    setDropdownOpen(false);
                  }}>
                    🔐 Iniciar Sesión
                  </a>
                  <a href="#register" onClick={(e) => { 
                    e.preventDefault(); 
                    setRegisterModalOpen(true);
                    setDropdownOpen(false);
                  }}>
                    📝 Registrarse
                  </a>
                </>
              ) : (
                <>
                  <a href="#profile" onClick={(e) => { 
                    e.preventDefault(); 
                    handleSectionChange('perfil');
                  }}>
                    👤 Mi Perfil
                  </a>
                  <a href="#my-games" onClick={(e) => { 
                    e.preventDefault(); 
                    handleSectionChange('mis-juegos');
                  }}>
                    🎮 Mis Juegos
                  </a>
                  <a href="#scores" onClick={(e) => { 
                    e.preventDefault(); 
                    handleSectionChange('puntuaciones');
                  }}>
                    🏆 Puntuaciones
                  </a>
                  <a href="#settings" onClick={(e) => { 
                    e.preventDefault(); 
                    handleSectionChange('configuracion');
                  }}>
                    ⚙️ Configuración
                  </a>
                  <a href="#logout" onClick={(e) => { 
                    e.preventDefault(); 
                    handleLogout();
                  }}>
                    🚪 Cerrar Sesión
                  </a>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* MODAL DE LOGIN */}
      {loginModalOpen && (
        <div className="modal-overlay" onClick={() => setLoginModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>🔐 Iniciar Sesión</h2>
            <LoginForm onLogin={handleLogin} onClose={() => setLoginModalOpen(false)} />
          </div>
        </div>
      )}

      {/* MODAL DE REGISTRO */}
      {registerModalOpen && (
        <div className="modal-overlay" onClick={() => setRegisterModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>📝 Registrarse</h2>
            <RegisterForm onRegister={handleRegister} onClose={() => setRegisterModalOpen(false)} />
          </div>
        </div>
      )}
    </header>
  );
};

// Componente para el formulario de Login
const LoginForm = ({ onLogin, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && password) {
      onLogin(email, password);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Correo Electrónico</label>
        <input 
          type="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required 
        />
      </div>
      <div className="form-group">
        <label>Contraseña</label>
        <input 
          type="password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required 
        />
      </div>
      <div className="modal-actions">
        <button type="submit" className="modal-btn primary">
          Iniciar Sesión
        </button>
        <button type="button" className="modal-btn secondary" onClick={onClose}>
          Cancelar
        </button>
      </div>
    </form>
  );
};

// Componente para el formulario de Registro
const RegisterForm = ({ onRegister, onClose }) => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword && nombre && email) {
      onRegister(nombre, email, password);
    } else {
      alert('Las contraseñas no coinciden');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Nombre Completo</label>
        <input 
          type="text" 
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required 
        />
      </div>
      <div className="form-group">
        <label>Correo Electrónico</label>
        <input 
          type="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required 
        />
      </div>
      <div className="form-group">
        <label>Contraseña</label>
        <input 
          type="password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required 
        />
      </div>
      <div className="form-group">
        <label>Confirmar Contraseña</label>
        <input 
          type="password" 
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required 
        />
      </div>
      <div className="modal-actions">
        <button type="submit" className="modal-btn primary">
          Registrarse
        </button>
        <button type="button" className="modal-btn secondary" onClick={onClose}>
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default Header;