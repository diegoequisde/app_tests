const db = require('./db.js'); // dentro de db/repl.js
console.log('Columnas de preguntas:');
console.table(db.prepare("PRAGMA table_info(preguntas)").all());
console.log('Columnas de temas:');
console.table(db.prepare("PRAGMA table_info(temas)").all());
console.log('Columnas de pregunta_tema:');
console.table(db.prepare("PRAGMA table_info(pregunta_tema)").all());