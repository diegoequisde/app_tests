const express = require("express");
const bcrypt = require("bcrypt");
const db = require("../db/db");

const router = express.Router();

// Middleware para redirigir si el usuario ya está logueado
function redirectIfLogged(req, res, next) {

  if (req.session.userId) {
    return res.redirect("/");
  }

  next();
}

// Mostrar login
router.get("/login", redirectIfLogged, (req, res) => {
  res.render("login");
});

// Mostrar registro
router.get("/register", redirectIfLogged, (req, res) => {
  res.render("register");
});

// registro de usuario
router.post("/register", async (req, res) => {

  const { username, password } = req.body;

  const hash = await bcrypt.hash(password, 10);

  try {

    const stmt = db.prepare(`
      INSERT INTO users (username, password)
      VALUES (?, ?)
    `);

    stmt.run(username, hash);

    res.redirect("/login");

  } catch (err) {

    res.send("El usuario ya existe");

  }

});

//login de usuario
router.post("/login", async (req, res) => {

  const { username, password } = req.body;

  const user = db.prepare(`
    SELECT * FROM users WHERE username = ?
  `).get(username);

  if (!user) {
    return res.send("Usuario no encontrado");
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    return res.send("Contraseña incorrecta");
  }

  req.session.userId = user.id;

  res.redirect("/");

});

// logout
router.get("/logout", (req, res) => {

  req.session.destroy(err => {

    if (err) {
      return res.send("Error cerrando sesión");
    }

    res.clearCookie("connect.sid");
    res.redirect("/login");

  });

});

module.exports = router;