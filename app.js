// 1. Importar express
const express = require('express');

// 2. Crear una instancia de la aplicación
const app = express();
const port = 3000; // Puedes elegir otro puerto si lo prefieres
const preguntasRoutes = require('./routes/preguntas');


// Configurar Express para servir archivos estáticos desde la carpeta 'public'
app.use(express.static('public'));

app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

app.use('/preguntas', preguntasRoutes);


// 4. Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});


