document.addEventListener('DOMContentLoaded', () => {
  const tbody = document.getElementById('tabla-temas');

  async function cargarTemas() {
    const res = await fetch('/preguntas/api/temas');
    const temas = await res.json();

    tbody.innerHTML = temas.map(t => `
      <tr>
        <td>${t.tema}</td>
        <td style="text-align:center">${t.total}</td>
        <td>
          <button onclick="renombrarTema('${t.tema}')">✏️</button>
          <button onclick="eliminarTema('${t.tema}', ${t.total})">🗑️</button>
        </td>
      </tr>
    `).join('');
  }

  window.renombrarTema = async (temaActual) => {
    const nuevo = prompt('Nuevo nombre del tema:', temaActual);
    if (!nuevo || nuevo.trim() === temaActual) return;

    await fetch('/preguntas/api/temas/renombrar', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ antiguo: temaActual, nuevo: nuevo.trim() })
    });

    cargarTemas();
  };

  window.eliminarTema = async (tema, total) => {
    const msg = total > 0
      ? `Este tema está asignado a ${total} preguntas.\nSe eliminará solo el vínculo.\n\n¿Continuar?`
      : '¿Eliminar este tema?';

    if (!confirm(msg)) return;

    await fetch('/preguntas/api/temas/eliminar', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tema })
    });

    cargarTemas();
  };

  document.getElementById('btn-nuevo-tema').addEventListener('click', async () => {
    const nombre = prompt('Nombre del nuevo tema:');
    if (!nombre?.trim()) return;

    await fetch('/preguntas/api/temas/nuevo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tema: nombre.trim() })
    });

    cargarTemas();
  });

  cargarTemas();
});
