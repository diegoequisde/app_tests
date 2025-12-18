const express = require('express');
const app = express();
const port = 3000;
const preguntasRoutes = require('./routes/preguntas');

// Servir archivos estáticos
app.use(express.static('public'));

// Middleware para parsear formularios HTML
app.use(express.urlencoded({ extended: true }));

// Middleware para parsear JSON
app.use(express.json());

app.set('view engine', 'ejs');

// Rutas
app.use('/preguntas', preguntasRoutes);

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
