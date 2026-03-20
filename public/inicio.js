document.addEventListener("DOMContentLoaded", () => {
  const startBtn = document.getElementById("start-btn");
  // const temaSelect = document.getElementById("tema");
  const addTemaBtn = document.getElementById("add-tema-btn");
  const container = document.getElementById("temas-container");

  let temasDisponibles = [];

  // Cargar temas en el select
  async function cargarTemas() {
    try {
      const res = await fetch('/preguntas/api/temas');
      const temas = await res.json();

      temasDisponibles = temas;

      rellenarSelects();

    } catch (err) {
      console.error("Error cargando temas:", err);
    }
  }
  
  // ---------- Rellenar todos los selects ----------
  function rellenarSelects() {
    const selects = document.querySelectorAll(".tema");

    selects.forEach(select => {
      select.innerHTML = temasDisponibles
        .map(t => `<option value="${t.tema}">${t.tema} (${t.total})</option>`)
        .join('');
    });
  }

  // ---------- Añadir nueva fila ----------
  addTemaBtn.addEventListener("click", () => {

    const row = document.createElement("div");
    row.classList.add("tema-row");

    row.innerHTML = `
      <label>Cantidad de preguntas:</label>
      <input type="number" class="cantidad" min="1" value="5">
      <label>Tema:</label>
      <select class="tema"></select>
      <button class="eliminar">X</button>
    `;

    container.appendChild(row);

    rellenarSelects();

    // botón eliminar fila
    row.querySelector(".eliminar").addEventListener("click", () => {
      row.remove();
    });

  });

  // Generar test
  startBtn.addEventListener("click", async () => {

    const filas = document.querySelectorAll(".tema-row");

    let todasLasPreguntas = [];

    for (const fila of filas) {

      const tema = fila.querySelector(".tema").value;
      const cantidad = parseInt(fila.querySelector(".cantidad").value);

      const res = await fetch(`/preguntas/api/test?tema=${encodeURIComponent(tema)}&cantidad=${cantidad}`);
      const preguntas = await res.json();

      todasLasPreguntas = todasLasPreguntas.concat(preguntas);
    }
    
    // mezclar preguntas
    todasLasPreguntas.sort(() => Math.random() - 0.5);

    localStorage.setItem("testQuestions", JSON.stringify(todasLasPreguntas));

    window.location.href = "/quiz";

  });

  cargarTemas();

});
