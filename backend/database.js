// backend/database.js
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./kig-usuarios.db');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      juegosJugados INTEGER DEFAULT 0,
      logros INTEGER DEFAULT 0,
      puntos INTEGER DEFAULT 0
    )
  `);
});

module.exports = db;