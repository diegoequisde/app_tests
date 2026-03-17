const express = require("express");
const router = express.Router();
const db = require("../db/db");
const requireAdmin = require("../middleware/requireAdmin");


// panel principal
router.get("/", requireAdmin, (req, res) => {

  res.render("admin/index");

});


// lista de usuarios
router.get("/users", requireAdmin, (req, res) => {

  const users = db.prepare(`
    SELECT id, username, role
    FROM users
    ORDER BY username
  `).all();

  res.render("admin/users", { users });

});


// estadísticas globales
router.get("/stats", requireAdmin, (req, res) => {

  const totalTests = db.prepare(`
    SELECT COUNT(*) as total
    FROM test_results
  `).get();

  const avgScore = db.prepare(`
    SELECT AVG(score*1.0/total) as avg
    FROM test_results
  `).get();

  res.render("admin/stats", {
    totalTests,
    avgScore
  });

});

// cambiar rol de usuario
router.post("/users/:id/role", requireAdmin, (req, res) => {

  const userId = req.params.id;
  const { role } = req.body;

  if (!["user", "admin"].includes(role)) {
    return res.send("Rol inválido");
  }

  // evitar que un admin se quite el rol de admin (MUY IMPORTANTE)
  if (parseInt(userId) === req.session.userId && role !== "admin") {
    return res.send("No puedes quitarte el rol de admin");
  }

  db.prepare(`
    UPDATE users
    SET role = ?
    WHERE id = ?
  `).run(role, userId);

  res.redirect("/admin/users");

});

// eliminar usuario
router.post("/users/:id/delete", requireAdmin, (req, res) => {

  const userId = req.params.id;

  // evitar que te borres a ti mismo (MUY IMPORTANTE)
  if (parseInt(userId) === req.session.userId) {
    return res.send("No puedes eliminar tu propio usuario");
  }

  db.prepare(`
    DELETE FROM users
    WHERE id = ?
  `).run(userId);

  res.redirect("/admin/users");

});

module.exports = router;