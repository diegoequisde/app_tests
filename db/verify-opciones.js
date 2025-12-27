const db = require('./db');
const path = require('path');
const preguntasJson = require(path.join(__dirname, '../ELIMINAR_preguntas.json'));

// Obtener todas las preguntas desde la base de datos
const preguntasDB = db.prepare('SELECT id, opciones FROM preguntas').all();

// Convertir opciones de DB de JSON string a array
const preguntasDBMap = preguntasDB.reduce((acc, p) => {
  try {
    acc[p.id] = JSON.parse(p.opciones);
  } catch (e) {
    acc[p.id] = [];
  }
  return acc;
}, {});

let errores = 0;

preguntasJson.forEach(p => {
  const opcionesDB = preguntasDBMap[p.id];
  if (!opcionesDB) {
    console.log(`❌ Pregunta ID ${p.id} no encontrada en la base de datos`);
    errores++;
    return;
  }

  // Comparar arrays estrictamente
  const iguales = JSON.stringify(opcionesDB) === JSON.stringify(p.opciones);

  if (!iguales) {
    console.log(`❌ Discrepancia en opciones de pregunta ID ${p.id}`);
    console.log('JSON antiguo: ', p.opciones);
    console.log('DB actual:   ', opcionesDB);
    errores++;
  }
});

if (errores === 0) {
  console.log('✅ Todas las preguntas coinciden correctamente con las opciones del JSON antiguo.');
} else {
  console.log(`⚠️ Se encontraron ${errores} discrepancias. Revisa los detalles arriba.`);
}
