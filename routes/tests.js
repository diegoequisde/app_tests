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

module.exports = router;