const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../preguntas.json');
const temasPath = path.join(__dirname, '../data/temas.json');

// Leer JSON
function loadPreguntas() {
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data);
}

// Guardar JSON
function savePreguntas(preguntas) {
  fs.writeFileSync(filePath, JSON.stringify(preguntas, null, 2));
}

function loadTemas() {
    if (!fs.existsSync(temasPath)) return [];
    return JSON.parse(fs.readFileSync(temasPath, 'utf-8'));
}

function saveTemas(temas) {
    fs.writeFileSync(temasPath, JSON.stringify(temas, null, 2));
}

module.exports = { loadPreguntas, savePreguntas, loadTemas, saveTemas };
