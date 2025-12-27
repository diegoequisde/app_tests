// db/migrate-from-json.js
const fs = require('fs');
const path = require('path');
const db = require('./db.js');

const preguntasPath = path.join(__dirname, '..', 'ELIMINAR_preguntas.json');
const temasPath = path.join(__dirname, '..', 'ELIMINAR_temas.json');

const preguntasJson = JSON.parse(fs.readFileSync(preguntasPath, 'utf-8'));
const temasJson = JSON.parse(fs.readFileSync(temasPath, 'utf-8'));

// Limpiar tablas antes de migrar
db.transaction(() => {
    db.prepare('DELETE FROM pregunta_tema').run();
    db.prepare('DELETE FROM preguntas').run();
    db.prepare('DELETE FROM temas').run();
})();

// Insertar temas primero
const insertTema = db.prepare('INSERT INTO temas (nombre) VALUES (?)');
const getTemaId = db.prepare('SELECT id FROM temas WHERE nombre = ?');

db.transaction(() => {
    temasJson.forEach(t => {
        insertTema.run(t);
    });
})();

// Insertar preguntas
const insertPregunta = db.prepare(`
    INSERT INTO preguntas (enunciado, opciones, respuesta_correcta)
    VALUES (?, ?, ?)
`);

const insertRelacion = db.prepare(`
    INSERT INTO pregunta_tema (pregunta_id, tema_id)
    VALUES (?, ?)
`);

db.transaction(() => {
    preguntasJson.forEach(p => {
        const result = insertPregunta.run(
            p.enunciado,
            JSON.stringify(p.opciones),
            p.respuestaCorrecta
        );
        const preguntaId = result.lastInsertRowid;

        p.tema.forEach(t => {
            const temaRow = getTemaId.get(t);
            if (temaRow) {
                insertRelacion.run(preguntaId, temaRow.id);
            } else {
                console.warn(`⚠️ Tema no encontrado en BD: ${t}`);
            }
        });
    });
})();

console.log('✅ Migración completada con coincidencia exacta de datos.');
