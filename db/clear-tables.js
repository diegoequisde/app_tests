// db/clear-tables.js
const db = require('./db');

db.prepare('DELETE FROM pregunta_tema').run();
db.prepare('DELETE FROM preguntas').run();
db.prepare('DELETE FROM temas').run();

console.log('Tablas limpiadas correctamente');
