const express = require('express');
const app = express();
const port = 3000;
const preguntasRoutes = require('./routes/preguntas');
const authRoutes = require("./routes/auth");
const db = require("./db/db");

// Servir archivos estáticos
app.use(express.static('public'));

// Middleware para parsear formularios HTML
app.use(express.urlencoded({ extended: true }));

// Middleware para parsear JSON
app.use(express.json());

// inicio de sesión
const session = require("express-session");

app.use(session({
  secret: "tu_secreto_super_seguro",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    maxAge: 1000 * 60 * 60 * 2
  }
}));

app.use((req, res, next) => {
  res.locals.userId = req.session.userId;
  next();
});

app.use("/", authRoutes);

app.set('view engine', 'ejs');

// Rutas
app.use('/preguntas', preguntasRoutes);


app.get('/', (req, res) => {
  res.render('index', { title: 'Generador de Temas (inicio)' });
});

app.get('/quiz', (req, res) => {
  res.render('quiz', { /* variables que quieras pasar */ });
});

function requireAuth(req, res, next) {

  if (!req.session.userId) {
    return res.redirect("/login");
  }

  next();
}

// Historial de resultados
app.get("/historial", requireAuth, (req, res) => {
  const userId = req.session.userId;

  const results = db.prepare(`
    SELECT score, total, created_at
    FROM test_results
    WHERE user_id = ?
    ORDER BY created_at DESC
  `).all(userId);

  res.render("historial", { results });

});


app.post("/api/test-result", requireAuth, (req, res) => {

  const { score, total } = req.body;
  const userId = req.session.userId;

  const stmt = db.prepare(`
    INSERT INTO test_results (user_id, score, total)
    VALUES (?, ?, ?)
  `);

  stmt.run(userId, score, total);

  res.json({ success: true });

});

app.post("/api/test-answers", requireAuth, (req, res) => {

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


// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
