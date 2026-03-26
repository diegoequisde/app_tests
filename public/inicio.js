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

    let opciones = `
      <option value="">-- Selecciona --</option>
      <option value="__frecuentes__">🔥 Preguntas frecuentes</option>
      <option value="__flagged__">🚩 Preguntas marcadas</option>
    `;

    opciones += temasDisponibles
      .map(t => `<option value="${t.tema}">${t.tema} (${t.total})</option>`)
      .join('');

    select.innerHTML = opciones;
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

  const savedState = localStorage.getItem("testState");

  if (savedState) {
      const parsed = JSON.parse(savedState);

      if (!parsed.finished) {
        const continuar = confirm("Tienes un test sin terminar. ¿Quieres empezar uno nuevo?");
        if (!continuar) return;
      }
    }

    // limpiar después de confirmar
    localStorage.removeItem("testState");
    localStorage.removeItem("testQuestions");

    const filas = document.querySelectorAll(".tema-row");

    let todasLasPreguntas = [];

   for (const fila of filas) {

    const tema = fila.querySelector(".tema").value;
    const cantidad = parseInt(fila.querySelector(".cantidad").value);

    let url;

    if (tema === "__frecuentes__") {
      url = `/preguntas/api/test?frecuentes=true&cantidad=${cantidad}`;
    }
    else if (tema === "__flagged__") {
      url = `/preguntas/api/test?flagged=true&cantidad=${cantidad}`;
    }
    else {
      url = `/preguntas/api/test?tema=${encodeURIComponent(tema)}&cantidad=${cantidad}`;
    }

    const res = await fetch(url);
    const preguntas = await res.json();

    todasLasPreguntas = todasLasPreguntas.concat(preguntas);
  }
    
    // mezclar preguntas
    todasLasPreguntas.sort(() => Math.random() - 0.5);

    localStorage.setItem("testQuestions", JSON.stringify(todasLasPreguntas));

    window.location.href = "/quiz";

  });

  const resumeBtn = document.getElementById("resume-btn");

  resumeBtn.addEventListener("click", () => {
  const savedState = localStorage.getItem("testState");

  if (!savedState) return;

  const parsed = JSON.parse(savedState);

  if (!parsed.questions || parsed.questions.length === 0) {
    alert("El test no es válido");
    return;
  }

  window.location.href = "/quiz";
});

// comprobar si hay test en curso
    function checkResumeTest() {
  const savedState = localStorage.getItem("testState");

  if (!savedState) return;

  const parsed = JSON.parse(savedState);

  if (!parsed.finished && parsed.questions && parsed.questions.length > 0) {
    resumeBtn.style.display = "block";
    resumeBtn.style.backgroundColor = "red";
    resumeBtn.textContent = `Continuar test (${parsed.currentIndex + 1}/${parsed.questions.length})`;
  }
}
  
  cargarTemas();
  
  checkResumeTest();

});
