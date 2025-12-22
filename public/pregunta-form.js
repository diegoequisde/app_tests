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

  // Añadir nuevo selector de tema
  document.getElementById('add-tema').addEventListener('click', function() {
    const container = document.getElementById('temas-container');
    // const select = container.querySelector('.tema-select select');
    const selects = container.querySelectorAll('select');
    if (selects.length === 0) return; // seguridad
    // Clonamos el último select del contenedor
    const nuevoSelect = selects[selects.length - 1].cloneNode(true);
    nuevoSelect.selectedIndex = 0;
    // Añadirlo envuelto en div con botón de eliminar
    const wrapper = document.createElement('div');
    wrapper.className = 'tema-select-wrapper';
    wrapper.appendChild(nuevoSelect);
    // Crear botón "X" para eliminar
    const btnEliminar = document.createElement('button');
    btnEliminar.type = 'button';
    btnEliminar.textContent = 'X';
    btnEliminar.className = 'btn-eliminar-tema';
    btnEliminar.addEventListener('click', () => {
        container.removeChild(wrapper);
    });
    wrapper.appendChild(btnEliminar);
    container.appendChild(wrapper);
  });