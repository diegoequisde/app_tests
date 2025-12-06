const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../preguntas.json');

// Leer JSON
function loadPreguntas() {
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data);
}

// Guardar JSON
function savePreguntas(preguntas) {
  fs.writeFileSync(filePath, JSON.stringify(preguntas, null, 2));
}

module.exports = { loadPreguntas, savePreguntas };
