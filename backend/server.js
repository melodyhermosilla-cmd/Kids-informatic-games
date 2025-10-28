// 🧙‍♀️ server.js
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const app = express();

// protección 
app.use(cors());
app.use(express.json());

// ⭐ BIENVENIDA ⭐
app.get('/', (req, res) => {
  res.json({ 
    mensaje: '¡Bienvenida a Kids Games! ✨',
    magia: 'El servidor está funcionando',
    creadoPor: 'Melody🧙‍♀️',
    fecha: new Date().toLocaleString()
  });
});

// 🌟 REGISTRO DE USUARIOS 🌟
app.post('/registro', (req, res) => {
  const { nombre, email, password } = req.body;
  
  console.log('📝 Nuevo aprendiz:', { nombre, email });
  
  res.json({
    mensaje: `¡Bienvenida ${nombre}! Tu varita mágica está lista ✨`,
    usuario: {
      id: Math.random().toString(36).substr(2, 9),
      nombre: nombre,
      email: email,
      magia: 'Nivel 1 - Aprendiz',
      puntos: 0
    }
  });
});

// 🔑 ENTRADA 🔑
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  console.log('🔐 Aprendiz entrando:', email);
  
  res.json({
    mensaje: '¡entrada exitoso! 🎪',
    usuario: {
      id: 1,
      nombre: 'Aprendiz',
      email: email,
      puntos: 100,
      nivel: 'Explorador'
    }
  });
});

// 🤖 HECHIZO DEL DUENDECITO AYUDÓN 🤖
app.post('/chatbot', (req, res) => {
  const { mensaje } = req.body;
  
  const respuestasMagicas = {
    'hola': '¡Hola, aprendiz! Soy tu duende mágico 🤖',
    'hardware': '🖥️ Hardware: Partes físicas como teclado, mouse, pantalla, CPU',
    'software': '💾 Software: Programas como juegos, Word, Windows',
    'jugar': '🎮 Ve a la sección JUEGOS y elige tu aventura favorita',
    'registro': '📝 Usa el hechizo de registro para crear tu cuenta',
    'login': '🔐 Usa el hechizo de entrada para acceder',
    'ayuda': '❓ Puedo explicarte: hardware, software, jugar, registro, login'
  };
  
  const respuesta = respuestasMagicas[mensaje.toLowerCase()] || 
                   '¡No entiendo ese hechizo! Pregunta: hola, hardware, software, jugar, ayuda';
  
  res.json({ respuesta: respuesta });
});

// 🏆 GUARDAR PUNTAJES 🏆
app.post('/guardar-puntaje', (req, res) => {
  const { usuario, juego, puntaje } = req.body;
  
  res.json({
    mensaje: `¡Ganaste ${puntaje} puntos mágicos! ⭐`,
    felicitacion: 'Eres una estrella brillante 🌟',
    nuevoPuntaje: puntaje,
    nivel: puntaje > 800 ? 'Mago Maestro' : 'Aprendiz Avanzado'
  });
});

// 📊 HECHIZO DE TABLA DE MEJORES MAGOS 📊
app.get('/puntuaciones', (req, res) => {
  const mejoresMagos = [
    { posicion: 1, nombre: 'Ana', juego: 'Sopa de Letras', puntaje: 950 },
    { posicion: 2, nombre: 'Carlos', juego: 'Rompecabezas', puntaje: 890 },
    { posicion: 3, nombre: 'Melody', juego: 'Quiz Mágico', puntaje: 920 },
    { posicion: 4, nombre: 'Luis', juego: 'Memoria', puntaje: 870 },
    { posicion: 5, nombre: 'Sofía', juego: 'Ahorcado', puntaje: 840 }
  ];
  
  res.json({ magos: mejoresMagos });
});

// 🎮 HECHIZO DE LISTA DE JUEGOS 🎮
app.get('/juegos', (req, res) => {
  const juegosMagicos = {
    hardware: [
      { id: 1, nombre: 'Sopa de Letras - Componentes', tipo: 'sopa-letras', icono: '🔍' },
      { id: 2, nombre: 'Rompecabezas - Placa Base', tipo: 'rompecabezas', icono: '🧩' },
      { id: 3, nombre: 'Quiz - Hardware Básico', tipo: 'quiz', icono: '❓' }
    ],
    software: [
      { id: 4, nombre: 'Memoria - Iconos', tipo: 'memoria', icono: '🎮' },
      { id: 5, nombre: 'Ahorcado - Programas', tipo: 'ahorcado', icono: '🎯' },
      { id: 6, nombre: 'Crucigrama - Sistemas', tipo: 'crucigrama', icono: '🧩' }
    ]
  };
  
  res.json({ juegos: juegosMagicos });
});

// 🎪 HECHIZO PARA ACTIVAR EL SERVIDOR 🎪
const PORT = 5000;
app.listen(PORT, () => {
  console.log('=========================================');
  console.log('🧙‍♀️  SERVIDOR ACTIVADO');
  console.log('📍  Escuchando en: http://localhost:' + PORT);
  console.log('✨  Por: Melody ');
  console.log('=========================================');
});
