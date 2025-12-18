const express = require('express');
const router = express.Router();
const { loadPreguntas, savePreguntas, loadTemas, saveTemas } = require('../utils/storage');

// LISTADO
router.get('/', (req, res) => {
  const preguntas = loadPreguntas();
  res.render('admin', { preguntas });
});

// FORM NUEVA PREGUNTA
router.get('/crear', (req, res) => {
  const temas = loadTemas(); 
  res.render('crear', { temas });
});

// CREAR
router.post('/crear', (req, res) => {
    let { enunciado, opciones, respuestaCorrecta, tema } = req.body;

    if (!Array.isArray(tema)) {
      tema = [tema];
    }
  
  const preguntas = loadPreguntas();

    const nueva = {
        id: Date.now(),
        enunciado,
        opciones,
        respuestaCorrecta,
        tema
    };

    preguntas.push(nueva);
    savePreguntas(preguntas);

    res.redirect('/preguntas');
});

// FORM EDITAR
router.get('/editar/:id', (req, res) => {
    const preguntas = loadPreguntas();
    const pregunta = preguntas.find(p => p.id == req.params.id);
    const temas = loadTemas();
    res.render('editar', { pregunta, temas });
});


// EDITAR
router.post('/editar/:id', (req, res) => {
    const id = Number(req.params.id);
    let { enunciado, opciones, respuestaCorrecta, tema } = req.body;
    
    if (!Array.isArray(tema)) {
      tema = [tema];
    }

    const preguntas = loadPreguntas();
    const index = preguntas.findIndex(p => p.id === id);

    preguntas[index] = {
        id,
        tema,
        enunciado,
        opciones,
        respuestaCorrecta
    };

    savePreguntas(preguntas);
    res.redirect('/preguntas');
});

// ELIMINAR
router.post('/eliminar/:id', (req, res) => {
  let preguntas = loadPreguntas();
  const id = Number(req.params.id);

  preguntas = preguntas.filter(p => p.id !== id);
  savePreguntas(preguntas);

  res.redirect('/preguntas');
});

// API: crear tema nuevo
router.post('/api/temas/nuevo', (req, res) => {
  const { tema } = req.body;
  const temas = loadTemas();
  if (!temas.includes(tema)) temas.push(tema);
  saveTemas(temas);
  
  if (req.headers.accept?.includes('application/json')) {
    res.json({ ok: true });
  } else {
    res.redirect('/preguntas'); // redirige si viene de form HTML
  }
});
 
// API: devolver todos los temas
router.get('/api/temas', (req, res) => {
    const temas = loadTemas();
    res.json(temas);
});


// API: listado completo
router.get('/api/listado', (req, res) => {
  const preguntas = loadPreguntas();
  res.json(preguntas);
});

// API: generar test por tema/s
router.get('/api/test', (req, res) => {
  const { tema, cantidad } = req.query;

  let preguntas = loadPreguntas().filter(
  p => Array.isArray(p.tema) && p.tema.includes(tema)
);
 
  // mezclar
  preguntas = preguntas.sort(() => Math.random() - 0.5);

  // limitar
  preguntas = preguntas.slice(0, Number(cantidad));

  res.json(preguntas);
});


module.exports = router;
