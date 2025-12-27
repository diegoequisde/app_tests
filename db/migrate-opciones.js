const db = require('./db');
const path = require('path');
const preguntasJson = require(path.join(__dirname, '../ELIMINAR_preguntas.json'));

// 1️⃣ Verificar si la columna 'opciones' existe
const pragma = db.prepare(`PRAGMA table_info(preguntas)`).all();
const existeOpciones = pragma.some(col => col.name === 'opciones');

if (!existeOpciones) {
  console.log('Agregando columna "opciones" a la tabla preguntas...');
  db.prepare(`
    ALTER TABLE preguntas
    ADD COLUMN opciones TEXT
  `).run();
  console.log('Columna "opciones" creada correctamente.');
} else {
  console.log('La columna "opciones" ya existe. Continuando con actualización...');
}

// 2️⃣ Actualizar cada pregunta con sus opciones del JSON antiguo
const updatePregunta = db.prepare(`
  UPDATE preguntas
  SET opciones = ?
  WHERE id = ?
`);

// Usamos transacción para seguridad y rendimiento
const tx = db.transaction(() => {
  preguntasJson.forEach(p => {
    updatePregunta.run(JSON.stringify(p.opciones), p.id);
  });
});

tx();

console.log('Opciones migradas correctamente para todas las preguntas existentes.');
