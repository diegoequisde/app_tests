const express = require("express");
const router = express.Router();
const db = require("../db/db");
const requireAuth = require("../middleware/requireAuth");

// historial
router.get("/historial", requireAuth, (req, res) => {

  const userId = req.session.userId;

  const results = db.prepare(`
    SELECT score, total, created_at
    FROM test_results
    WHERE user_id = ?
    ORDER BY created_at DESC
  `).all(userId);

  res.render("historial", { results });
});

// guardar resultado
router.post("/api/test-result", requireAuth, (req, res) => {

  const { score, total } = req.body;
  const userId = req.session.userId;

  db.prepare(`
    INSERT INTO test_results (user_id, score, total)
    VALUES (?, ?, ?)
  `).run(userId, score, total);

  res.json({ success: true });
});

router.post("/api/test-answers", requireAuth, (req, res) => {

  const userId = req.session.userId;
  const answers = req.body.answers;

  const stmt = db.prepare(`
    INSERT INTO test_answers 
    (user_id, question_id, selected_answer, correct_answer, is_correct)
    VALUES (?, ?, ?, ?, ?)
  `);

  const insertMany = db.transaction((answers) => {

    for (const a of answers) {
      stmt.run(
        userId,
        a.questionId,
        a.selectedAnswer,
        a.correctAnswer,
        a.isCorrect ? 1 : 0
      );
    }
  });

  insertMany(answers);

  res.json({ success: true });

});

// preguntas marcadas por el usuario
router.post("/api/flag-question", requireAuth, (req, res) => {

  const userId = req.session.userId;
  const { questionId } = req.body;

  const existing = db.prepare(`
    SELECT id FROM user_flags
    WHERE user_id = ? AND question_id = ?
  `).get(userId, questionId);

  if (existing) {
    // quitar flag
    db.prepare(`
      DELETE FROM user_flags
      WHERE user_id = ? AND question_id = ?
    `).run(userId, questionId);

    return res.json({ flagged: false });
  }

  // añadir flag
  db.prepare(`
    INSERT INTO user_flags (user_id, question_id)
    VALUES (?, ?)
  `).run(userId, questionId);

  res.json({ flagged: true });

});

// obtener preguntas marcadas
router.get("/api/flagged-questions", requireAuth, (req, res) => {

  const userId = req.session.userId;

  const rows = db.prepare(`
    SELECT question_id FROM user_flags
    WHERE user_id = ?
  `).all(userId);

  const ids = rows.map(r => r.question_id);

  res.json(ids);

});

module.exports = router;