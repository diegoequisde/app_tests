const express = require('express');
const router = express.Router();
const { loadPreguntas, savePreguntas } = require('../utils/storage');

// LISTADO
router.get('/', (req, res) => {
  const preguntas = loadPreguntas();
  res.render('admin', { preguntas });
});

// FORM NUEVA PREGUNTA
router.get('/crear', (req, res) => {
  res.render('crear');
});

// CREAR
router.post('/preguntas/crear', (req, res) => {
    let { enunciado, opciones, respuestaCorrecta } = req.body;

    const preguntas = loadPreguntas();

       const nueva = {
        id: Date.now(),
        enunciado,
        opciones,
        respuestaCorrecta
    };
  preguntas.push(nueva);
  savePreguntas(preguntas);
  res.redirect('/preguntas');
});

// FORM EDITAR
router.get('/editar/:id', (req, res) => {
  const preguntas = loadPreguntas();
  const pregunta = preguntas.find(p => p.id == req.params.id);
  res.render('editar', { pregunta });
});

// EDITAR
router.post('/preguntas/editar/:id', (req, res) => {
    const id = Number(req.params.id);
    let { enunciado, opciones, respuestaCorrecta } = req.body;

    const preguntas = loadPreguntas();
    const index = preguntas.findIndex(p => p.id === id);

    preguntas[index] = {
        id,
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


// API: devolver preguntas como JSON para el frontend del quiz
router.get('/api/listado', (req, res) => {
  const preguntas = loadPreguntas();
  res.json(preguntas);
});


module.exports = router;
