const db = require('./db');

function getAllTemas() {
  return db.prepare(`
    SELECT * FROM temas
    ORDER BY nombre
  `).all().map(t => t.nombre);
}

function createTema(nombre) {
  const existing = db.prepare(`
    SELECT id 
    FROM temas 
    WHERE nombre = ?`
  ).get(nombre);
  if (!existing) {
    db.prepare(`
      INSERT INTO temas (nombre)
      VALUES (?)`
    ).run(nombre);
  }
}

/**
 * Obtener tema por nombre (opcional, útil internamente)
 */
function getTemaByName(nombre) {
  return db.prepare(`
    SELECT * FROM temas 
    WHERE nombre = ?
    `).get(nombre);
}

module.exports = {
  getAllTemas,
  createTema,
  getTemaByName
};
