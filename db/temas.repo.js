const db = require('./db');

function getAllTemas() {
  return db.prepare(`
    SELECT nombre FROM temas
    ORDER BY nombre
  `).all().map(t => t.nombre);
}

function createTema(nombre) {
  const existing = db.prepare(`
    SELECT id FROM temas WHERE nombre = ?
  `).get(nombre);

  if (!existing) {
    db.prepare(`
      INSERT INTO temas (nombre)
      VALUES (?)
    `).run(nombre);
  }
}

function renameTema(antiguo, nuevo) {
  db.prepare(`
    UPDATE temas
    SET nombre = ?
    WHERE nombre = ?
  `).run(nuevo, antiguo);
}

function deleteTema(nombre) {
  const tema = db.prepare(`
    SELECT id FROM temas WHERE nombre = ?
  `).get(nombre);

  if (!tema) return;

  const tx = db.transaction(() => {
    db.prepare(`
      DELETE FROM pregunta_tema
      WHERE tema_id = ?
    `).run(tema.id);

    db.prepare(`
      DELETE FROM temas
      WHERE id = ?
    `).run(tema.id);
  });

  tx();
}

function getTemaByName(nombre) {
  return db.prepare(`
    SELECT * FROM temas WHERE nombre = ?
  `).get(nombre);
}

module.exports = {
  getAllTemas,
  createTema,
  renameTema,
  deleteTema,
  getTemaByName
};