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

module.exports = router;