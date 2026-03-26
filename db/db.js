const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'database.sqlite');

const db = new Database(dbPath, {
  verbose: process.env.NODE_ENV === 'development'
    ? console.log
    : null
});

// Crear tabla de usuarios 
db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  )
`).run();

// Comprobar si la columna role existe
const columns = db.prepare(`PRAGMA table_info(users)`).all();

const hasRole = columns.some(col => col.name === "role");

if (!hasRole) {
  db.prepare(`
    ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'user'
  `).run();
}

// db.prepare(`
// UPDATE users
// SET role = 'admin'
// WHERE username = 'Diego'
// `).run();


// tabla resultados
db.prepare(`
  CREATE TABLE IF NOT EXISTS test_results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    score INTEGER NOT NULL,
    total INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`).run();

// tabla respuestas individuales
db.prepare(`
  CREATE TABLE IF NOT EXISTS test_answers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    question_id INTEGER NOT NULL,
    selected_answer TEXT,
    correct_answer TEXT,
    is_correct INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`).run();

// tabla para preguntas marcadas por el usuario
db.prepare(`
  CREATE TABLE IF NOT EXISTS user_flags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    question_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, question_id)
  )
`).run();

module.exports = db;
