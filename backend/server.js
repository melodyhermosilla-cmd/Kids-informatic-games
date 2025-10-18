// server.js - NUESTRO SERVIDOR 
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Hechizo de bienvenida
app.get('/', (req, res) => {
  res.json({ 
    mensaje: '¡Bienvenida a Kids Games Magic! ✨',
    magia: 'El servidor está funcionando',
    creadoPor: 'Melody la Mágica 🧙‍♀️'
  });
});

// Hechizo para escuchar en el puerto 5000
app.listen(5000, () => {
  console.log('🎪 Servidor funcionando en puerto 5000');
});