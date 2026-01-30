document.addEventListener("DOMContentLoaded", () => {
  const startBtn = document.getElementById("start-btn");
  const temaSelect = document.getElementById("tema");

  // Cargar temas en el select
  async function cargarTemas() {
    try {
      const res = await fetch('/preguntas/api/temas');
      const temas = await res.json();
      // temaSelect.innerHTML = temas.map(t => `<option value="${t}">${t}</option>`).join('');
      temaSelect.innerHTML = temas
      .map(t => `<option value="${t.tema}">${t.tema} (${t.total})</option>`)
      .join('');
    } catch (err) {
      console.error("Error cargando temas:", err);
    }
  }

  // Generar test
  startBtn.addEventListener("click", async () => {
    const tema = temaSelect.value;
    const cantidad = parseInt(document.getElementById("cantidad").value);

    const res = await fetch(`/preguntas/api/test?tema=${encodeURIComponent(tema)}&cantidad=${cantidad}`);
    const preguntas = await res.json();

    localStorage.setItem("testQuestions", JSON.stringify(preguntas));
    window.location.href = "/quiz";
  });

  // este bloque va a /public/temas.js
  
  // // Nuevo tema
  // document.getElementById('btn-nuevo-tema').addEventListener('click', async () => {
  //   const nuevo = prompt("Introduce el nombre del nuevo tema:");
  //   if (!nuevo?.trim()) return;

  //   const res = await fetch('/preguntas/api/temas/nuevo', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({ tema: nuevo.trim() })
  //   });

  //   if (res.ok) await cargarTemas();
  // });

  // renombrar tema
//   document.getElementById('btn-renombrar-tema').addEventListener('click', async () => {
//   const antiguo = temaSelect.value;
//   const nuevo = prompt(`Nuevo nombre para "${antiguo}"`);
//   if (!nuevo?.trim()) return;

//   await fetch('/preguntas/api/temas/renombrar', {
//     method: 'PUT',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ antiguo, nuevo: nuevo.trim() })
//   });

//   cargarTemas();
// });

//eliminar tema
// document.getElementById('btn-eliminar-tema').addEventListener('click', async () => {
//   const tema = temaSelect.value;
//   if (!confirm(`Eliminar el tema "${tema}"?\nLas preguntas no se borrarán.`)) return;

//   await fetch('/preguntas/api/temas/eliminar', {
//     method: 'DELETE',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ tema })
//   });

//   cargarTemas();
// });


  // Administración
  document.getElementById("btn-crear").addEventListener("click", () => window.location.href = "/preguntas/crear");
  document.getElementById("btn-editar").addEventListener("click", () => window.location.href = "/preguntas");
  document.getElementById("btn-temas").addEventListener("click", () => window.location.href = "/preguntas/temas");

  cargarTemas();
});
