const db = require('./db');

/**
 * Devuelve todas las preguntas con:
 * - opciones[]
 * - tema[]
 */
function getAllPreguntas() {
  const rows = db.prepare(`
    SELECT
      p.id,
      p.enunciado,
      p.opciones,
      p.respuesta_correcta,
      GROUP_CONCAT(t.nombre) AS temas
    FROM preguntas p
    LEFT JOIN pregunta_tema pt ON pt.pregunta_id = p.id
    LEFT JOIN temas t ON t.id = pt.tema_id
    GROUP BY p.id
    ORDER BY p.id DESC
  `).all();

  return rows.map(r => ({
    id: r.id,
    enunciado: r.enunciado,
    opciones: JSON.parse(r.opciones),
    respuestaCorrecta: r.respuesta_correcta,
    tema: r.temas ? r.temas.split(',') : []
  }));
}

/**
 * Obtener una pregunta por id
 */
function getPreguntaById(id) {
  const row = db.prepare(`
    SELECT
      p.id,
      p.enunciado,
      p.opciones,
      p.respuesta_correcta,
      GROUP_CONCAT(t.nombre) AS temas
    FROM preguntas p
    LEFT JOIN pregunta_tema pt ON pt.pregunta_id = p.id
    LEFT JOIN temas t ON t.id = pt.tema_id
    WHERE p.id = ?
    GROUP BY p.id
  `).get(id);

  if (!row) return null;

  return {
    id: row.id,
    enunciado: row.enunciado,
    opciones: JSON.parse(row.opciones),
    respuestaCorrecta: row.respuesta_correcta,
    tema: row.temas ? row.temas.split(',') : []
  };
}

/**
 * Preguntas por tema + límite
 */
function getPreguntasByTema(tema, limit) {
  const rows = db.prepare(`
    SELECT
      p.id,
      p.enunciado,
      p.opciones,
      p.respuesta_correcta,
      GROUP_CONCAT(t.nombre) AS temas
    FROM preguntas p
    JOIN pregunta_tema pt ON pt.pregunta_id = p.id
    JOIN temas t ON t.id = pt.tema_id
    WHERE t.nombre = ?
    GROUP BY p.id
    ORDER BY RANDOM()
    LIMIT ?
  `).all(tema, limit);

  return rows.map(r => ({
    id: r.id,
    enunciado: r.enunciado,
    opciones: JSON.parse(r.opciones),
    respuestaCorrecta: r.respuesta_correcta,
    tema: r.temas ? r.temas.split(',') : []
  }));
}

/**
 * Crear pregunta
 */
function createPregunta({ enunciado, opciones, respuestaCorrecta, temas }) {
  const insertPregunta = db.prepare(`
    INSERT INTO preguntas (enunciado, opciones, respuesta_correcta)
    VALUES (?, ?, ?)
  `);

  const insertRelacion = db.prepare(`
    INSERT INTO pregunta_tema (pregunta_id, tema_id)
    VALUES (?, ?)
  `);

  const getTemaId = db.prepare(`SELECT id FROM temas WHERE nombre = ?`);

  const tx = db.transaction(() => {
    const result = insertPregunta.run(
      enunciado,
      JSON.stringify(opciones),
      respuestaCorrecta
    );

    const preguntaId = result.lastInsertRowid;

    temas.forEach(t => {
      const temaRow = getTemaId.get(t);
      if (temaRow) {
        insertRelacion.run(preguntaId, temaRow.id);
      }
    });
  });

  tx();
}

/**
 * Actualizar pregunta existente
 */
function updatePregunta({ id, enunciado, opciones, respuestaCorrecta, temas }) {
  const updatePregunta = db.prepare(`
    UPDATE preguntas
    SET enunciado = ?, opciones = ?, respuesta_correcta = ?
    WHERE id = ?
  `);

  const deleteRelacion = db.prepare(`DELETE FROM pregunta_tema WHERE pregunta_id = ?`);
  const insertRelacion = db.prepare(`INSERT INTO pregunta_tema (pregunta_id, tema_id) VALUES (?, ?)`);
  const getTemaId = db.prepare(`SELECT id FROM temas WHERE nombre = ?`);

  const tx = db.transaction(() => {
    updatePregunta.run(enunciado, JSON.stringify(opciones), respuestaCorrecta, id);
    deleteRelacion.run(id);

    temas.forEach(t => {
      const temaRow = getTemaId.get(t);
      if (temaRow) {
        insertRelacion.run(id, temaRow.id);
      }
    });
  });

  tx();
}

/**
 * Eliminar pregunta
 */
function deletePregunta(id) {
  const tx = db.transaction(() => {
    db.prepare(`DELETE FROM pregunta_tema WHERE pregunta_id = ?`).run(id);
    db.prepare(`DELETE FROM preguntas WHERE id = ?`).run(id);
  });

  tx();
}

module.exports = {
  getAllPreguntas,
  getPreguntaById,
  getPreguntasByTema,
  createPregunta,
  updatePregunta,
  deletePregunta
};
