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
router.post('/crear', (req, res) => {
  const preguntas = loadPreguntas();
  const nueva = {
    id: Date.now(),
    enunciado: req.body.enunciado,
    opciones: req.body.opciones,
    respuestaCorrecta: req.body.respuestaCorrecta
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
router.post('/editar/:id', (req, res) => {
  let preguntas = loadPreguntas();
  const id = Number(req.params.id);

  preguntas = preguntas.map(p =>
    p.id === id
      ? {
          ...p,
          enunciado: req.body.enunciado,
          opciones: req.body.opciones,
          respuestaCorrecta: req.body.respuestaCorrecta
        }
      : p
  );

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
