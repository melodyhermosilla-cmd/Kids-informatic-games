// 🔮 database.js - COFRE DEL TESORO MÁGICO
const mysql = require('mysql2');

// Hechizo de conexión mágica
const conexionMagica = mysql.createConnection({
  host: 'localhost',          // Donde vive el cofre
  user: 'root',               // Llave maestra
  password: '',               // Contraseña mágica (vacía por ahora)
  database: 'juegos_magicos'  // Nombre del cofre
});

// Intentar abrir el cofre
conexionMagica.connect((error) => {
  if (error) {
    console.log('🔮 El cofre mágico no está disponible, pero podemos jugar igual');
    console.log('💡 No te preocupes, el servidor funciona sin base de datos por ahora');
  } else {
    console.log('✅ ¡Cofre mágico de datos abierto!');
    console.log('💰 Todos los tesoros están disponibles');
  }
});

// Compartir el cofre con otros hechizos
module.exports = conexionMagica;
