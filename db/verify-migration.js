// db/verify-migration-completo.js
const fs = require('fs');
const path = require('path');
const db = require('./db.js');

// Ruta al JSON original
const preguntasJsonPath = path.join(__dirname, '..', 'ELIMINAR_preguntas.json');
const preguntasOriginales = JSON.parse(fs.readFileSync(preguntasJsonPath, 'utf-8'));

let errores = 0;

preguntasOriginales.forEach(preg => {
    // Buscamos posibles coincidencias por enunciado
    const rows = db.prepare(`
        SELECT p.id, p.enunciado, p.opciones, p.respuesta_correcta, GROUP_CONCAT(t.nombre) AS temas
        FROM preguntas p
        LEFT JOIN pregunta_tema pt ON pt.pregunta_id = p.id
        LEFT JOIN temas t ON t.id = pt.tema_id
        WHERE p.enunciado = ?
        GROUP BY p.id
    `).all(preg.enunciado);

    if (rows.length === 0) {
        console.log(`❌ Pregunta no encontrada en BD: "${preg.enunciado}"`);
        errores++;
        return;
    }

    // Comprobamos todas las coincidencias posibles
    const match = rows.find(r => {
        const opcionesDb = JSON.parse(r.opciones);
        const temasDb = r.temas ? r.temas.split(',') : [];
        return (
            JSON.stringify(opcionesDb) === JSON.stringify(preg.opciones) &&
            r.respuesta_correcta === preg.respuestaCorrecta &&
            JSON.stringify(temasDb.sort()) === JSON.stringify(preg.tema.sort())
        );
    });

    if (!match) {
        console.log(`❌ Coincidencia exacta no encontrada para: "${preg.enunciado}"`);
        rows.forEach(r => {
            const opcionesDb = JSON.parse(r.opciones);
            const temasDb = r.temas ? r.temas.split(',') : [];
            console.log(`   -> ID BD: ${r.id}`);
            console.log(`      Opciones BD: ${JSON.stringify(opcionesDb)}`);
            console.log(`      Opciones JSON: ${JSON.stringify(preg.opciones)}`);
            console.log(`      Respuesta BD: ${r.respuesta_correcta}`);
            console.log(`      Respuesta JSON: ${preg.respuestaCorrecta}`);
            console.log(`      Temas BD: ${JSON.stringify(temasDb)}`);
            console.log(`      Temas JSON: ${JSON.stringify(preg.tema)}`);
        });
        errores++;
    }
});

if (errores === 0) {
    console.log('✅ Todas las preguntas coinciden exactamente con el JSON original.');
} else {
    console.log(`⚠️ Se encontraron ${errores} problemas de coincidencia.`);
}
