const db = require('./db');

db.prepare(`
  ALTER TABLE preguntas
  ADD COLUMN opciones TEXT
`).run();

console.log('Columna "opciones" agregada correctamente');
