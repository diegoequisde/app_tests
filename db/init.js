// db/init.js
const Database = require('better-sqlite3');
const db = new Database('db/database.sqlite');

// Tabla preguntas
db.prepare(`
  CREATE TABLE IF NOT EXISTS preguntas (
    id INTEGER PRIMARY KEY,
    enunciado TEXT NOT NULL,
    opciones TEXT NOT NULL,
    respuesta_correcta TEXT NOT NULL
  )
`).run();

// Tabla temas
db.prepare(`
  CREATE TABLE IF NOT EXISTS temas (
    id INTEGER PRIMARY KEY,
    nombre TEXT NOT NULL
  )
`).run();

// Tabla relación preguntas-temas
db.prepare(`
  CREATE TABLE IF NOT EXISTS pregunta_tema (
    pregunta_id INTEGER NOT NULL,
    tema_id INTEGER NOT NULL,
    PRIMARY KEY (pregunta_id, tema_id),
    FOREIGN KEY (pregunta_id) REFERENCES preguntas(id),
    FOREIGN KEY (tema_id) REFERENCES temas(id)
  )
`).run();

console.log("Tablas creadas correctamente");
db.close();
