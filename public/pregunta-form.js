// Añadir nueva opción
document.getElementById("add-option").addEventListener("click", () => {
  const cont = document.getElementById("opciones-container");
  const div = document.createElement("div");
  div.classList.add("opcion");
  div.innerHTML = `
    <input type="text" name="opciones[]" placeholder="Nueva opción" required>
    <button type="button" class="remove-option">X</button>
  `;
  cont.appendChild(div);
  div.querySelector(".remove-option").addEventListener("click", () => div.remove());
});

// Activar eliminar opciones existentes
document.querySelectorAll(".remove-option").forEach(btn => {
  btn.addEventListener("click", () => btn.parentElement.remove());
});

// Función común para eliminar temas
function activarEliminarTemas() {
  document.querySelectorAll('.btn-eliminar-tema').forEach(btn => {
    btn.onclick = () => btn.parentElement.remove();
  });
}

// Añadir nuevo selector de tema
document.getElementById('add-tema').addEventListener('click', function() {
  const container = document.getElementById('temas-container');
  const selects = container.querySelectorAll('select');

  if (selects.length === 0) return; // seguridad

  const nuevoSelect = selects[selects.length - 1].cloneNode(true);
  nuevoSelect.selectedIndex = 0;

  const wrapper = document.createElement('div');
  wrapper.className = 'tema-select-wrapper';
  wrapper.innerHTML = `
    ${nuevoSelect.outerHTML}
    <button type="button" class="btn-eliminar-tema">X</button>
  `;

  container.appendChild(wrapper);
  activarEliminarTemas();
});

// Activar eliminación para los temas ya existentes al cargar la página
activarEliminarTemas();
