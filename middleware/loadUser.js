const db = require("../db/db");

function loadUser(req, res, next) {

  res.locals.userId = req.session.userId;

  if (!req.session.userId) {
    res.locals.user = null;
    return next();
  }

  const user = db.prepare(`
    SELECT id, username, role
    FROM users
    WHERE id = ?
  `).get(req.session.userId);

  req.user = user;
  res.locals.user = user;

  next();
}

module.exports = loadUser;