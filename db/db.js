const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'database.sqlite');

const db = new Database(dbPath, {
  verbose: process.env.NODE_ENV === 'development'
    ? console.log
    : null
});

// Crear tabla de usuarios si no existe
db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  )
`).run();

module.exports = db;
