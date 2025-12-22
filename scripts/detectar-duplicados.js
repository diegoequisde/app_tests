const fs = require('fs');

const preguntas = JSON.parse(fs.readFileSync('preguntas.json', 'utf8'));

const mapa = new Map();

preguntas.forEach(p => {
  const key = JSON.stringify({
    enunciado: p.enunciado.trim(),
    opciones: p.opciones.map(o => o.trim()),
    respuestaCorrecta: p.respuestaCorrecta.trim()
  });

  if (!mapa.has(key)) {
    mapa.set(key, []);
  }

  mapa.get(key).push({
    id: p.id,
    tema: p.tema
  });
});

// Mostrar solo duplicados
let hayDuplicados = false;

mapa.forEach((lista, key) => {
  if (lista.length > 1) {
    hayDuplicados = true;
    const { enunciado } = JSON.parse(key);

    console.log('---------------------------------------');
    console.log('ENUNCIADO:');
    console.log(enunciado);
    console.log('IDs duplicados:');
    lista.forEach(p =>
      console.log(`- ID: ${p.id} | Tema(s): ${p.tema.join(', ')}`)
    );
  }
});

if (!hayDuplicados) {
  console.log('✅ No se han detectado preguntas duplicadas');
}
