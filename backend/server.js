// backend/server.js
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const db = require('./database');

const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000', // Tu frontend React
  credentials: true // Necesario para cookies/sesiones
}));
app.use(session({
  secret: 'kig-secret-2025',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // true solo si usas HTTPS
    maxAge: 24 * 60 * 60 * 1000 // 24 horas
  }
}));

// RUTA: Registro
app.post('/api/auth/register', async (req, res) => {
  const { nombre, email, password } = req.body;

  if (!nombre || !email || !password) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    db.run(
      'INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)',
      [nombre, email, hashedPassword],
      function(err) {
        if (err) {
          if (err.message.includes('UNIQUE constraint failed')) {
            return res.status(400).json({ error: 'El email ya está registrado' });
          }
          console.error('❌ Error en registro:', err);
          return res.status(500).json({ error: 'Error interno del servidor' });
        }
        console.log('🆕 Usuario registrado:', email);
        res.status(201).json({ message: 'Usuario registrado exitosamente' });
      }
    );
  } catch (err) {
    console.error('❌ Error al hashear contraseña:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// RUTA: Login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña son obligatorios' });
  }

  db.get('SELECT * FROM usuarios WHERE email = ?', [email], async (err, user) => {
    if (err || !user) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    req.session.userId = user.id;
    const { password: _, ...safeUser } = user;
    console.log('✅ Login exitoso:', email);
    res.json(safeUser);
  });
});

// RUTA: Verificar sesión actual
app.get('/api/auth/me', (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'No autenticado' });
  }

  db.get(
    'SELECT id, nombre, email, juegosJugados, logros, puntos FROM usuarios WHERE id = ?',
    [req.session.userId],
    (err, user) => {
      if (err || !user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      res.json(user);
    }
  );
});

// RUTA: Logout
app.post('/api/auth/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error al cerrar sesión:', err);
      return res.status(500).json({ error: 'Error al cerrar sesión' });
    }
    console.log('🚪 Sesión cerrada');
    res.json({ message: 'Sesión cerrada correctamente' });
  });
});

// RUTA de prueba (opcional)
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend funcionando ✅' });
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Backend corriendo en http://localhost:${PORT}`);
  console.log(`🔗 Prueba: http://localhost:${PORT}/api/test`);
});