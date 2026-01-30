const express = require('express');
const router = express.Router();
const preguntasRepo = require('../db/preguntas.repo');
const temasRepo = require('../db/temas.repo');

// LISTADO
router.get('/', (req, res) => { 
  const preguntas = preguntasRepo.getAllPreguntas();
  res.render('admin', { preguntas });
});

// FORM NUEVA PREGUNTA
router.get('/crear', (req, res) => {
  const temas = temasRepo.getAllTemas();
  res.render('crear', { temas });
});

// CREAR
router.post('/crear', (req, res) => {
  let { enunciado, opciones, respuestaCorrecta, tema } = req.body;

  if (!Array.isArray(tema)) {
    tema = [tema];
  }

  preguntasRepo.createPregunta({
    enunciado,
    opciones,
    respuestaCorrecta,
    temas: tema
  });

  res.redirect('/preguntas');
});

// FORM EDITAR
router.get('/editar/:id', (req, res) => {
  const pregunta = preguntasRepo.getPreguntaById(Number(req.params.id));
  const temas = temasRepo.getAllTemas();
  res.render('editar', { pregunta, temas });
});

// EDITAR
router.post('/editar/:id', (req, res) => {
  const id = Number(req.params.id);
  let { enunciado, opciones, respuestaCorrecta, tema } = req.body;

  if (!Array.isArray(tema)) {
    tema = [tema];
  }

  preguntasRepo.updatePregunta({
    id,
    enunciado,
    opciones,
    respuestaCorrecta,
    temas: tema
  });

  res.redirect('/preguntas');
});

// ELIMINAR 
router.post('/eliminar/:id', (req, res) => {
  preguntasRepo.deletePregunta(Number(req.params.id));
  res.redirect('/preguntas');
});

// API: devolver todos los temas con contador de preguntas
router.get('/api/temas', (req, res) => {
  const temas = temasRepo.getAllTemas();
  const preguntas = preguntasRepo.getAllPreguntas();

  const temasConCount = temas.map(nombreTema => {
    const total = preguntas.filter(p => {
      if (!Array.isArray(p.tema)) return false;
      return p.tema.includes(nombreTema);
    }).length;

    return {
      tema: nombreTema,
      total
    };
  });

  res.json(temasConCount);
});


// API: crear tema nuevo 
router.post('/api/temas/nuevo', (req, res) => {
  const { tema } = req.body;
  temasRepo.createTema(tema);
  res.json({ ok: true });
});

// editar tema
router.put('/api/temas/renombrar', (req, res) => {
  const { antiguo, nuevo } = req.body;
  temasRepo.renameTema(antiguo, nuevo);
  res.json({ ok: true });
});


// eliminar tema
router.delete('/api/temas/eliminar', (req, res) => {
  const { tema } = req.body;
  temasRepo.deleteTema(tema);
  res.json({ ok: true });
});


// API: listado completo de preguntas
router.get('/api/listado', (req, res) => {
  const preguntas = preguntasRepo.getAllPreguntas();
  res.json(preguntas);
});

// API: generar test por tema y cantidad
router.get('/api/test', (req, res) => {
  const { tema, cantidad } = req.query;
  const preguntas = preguntasRepo.getPreguntasByTema(tema, Number(cantidad));
  res.json(preguntas);
});

router.get('/temas', (req, res) => {
  res.render('preguntas/temas');
});


module.exports = router;
