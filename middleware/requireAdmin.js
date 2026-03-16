function requireAdmin(req, res, next) {

  if (!req.session.userId) {
    return res.redirect("/login");
  }

  if (!req.user || req.user.role !== "admin") {
    return res.status(403).send("Acceso restringido");
  }

  next();
}

module.exports = requireAdmin;