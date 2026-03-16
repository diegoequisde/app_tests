const express = require('express');
const app = express();
const port = 3000;
const preguntasRoutes = require('./routes/preguntas');
const authRoutes = require("./routes/auth");
const db = require("./db/db");
const requireAuth = require("./middleware/requireAuth");
const loadUser = require("./middleware/loadUser");
const testRoutes = require("./routes/tests");
const adminRoutes = require("./routes/admin");


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

// app.use((req, res, next) => {
//   res.locals.userId = req.session.userId;
//   next();
// });
app.use(loadUser);


app.use("/", authRoutes);

app.use("/", testRoutes);

app.use('/preguntas', preguntasRoutes);

app.use("/admin", adminRoutes);

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index', { title: 'Generador de Temas (inicio)' });
});

app.get('/quiz', (req, res) => {
  res.render('quiz', { /* variables que quieras pasar */ });
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
