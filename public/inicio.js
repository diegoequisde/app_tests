document.addEventListener("DOMContentLoaded", () => {
    const startBtn = document.getElementById("start-btn");
    startBtn.addEventListener("click", async () => {
        const tema = document.getElementById("tema").value;
        const cantidad = parseInt(document.getElementById("cantidad").value);

        // Cargar preguntas desde la API
        const res = await fetch('/preguntas/api/listado');
        const data = await res.json();

        // Filtrar por tema
        let filtered = data.filter(p => p.tema === tema);

        // Limitar a la cantidad seleccionada
        filtered = filtered.slice(0, cantidad);

        // Guardar en localStorage para quiz.html
        localStorage.setItem("testQuestions", JSON.stringify(filtered));

        // Redirigir al quiz
        window.location.href = "quiz.html";
    });

    // Botones administración
    document.getElementById("btn-crear").addEventListener("click", () => {
        window.location.href = "/preguntas/crear";
    });
    document.getElementById("btn-editar").addEventListener("click", () => {
        window.location.href = "/preguntas";
    });

    // Cargar temas desde la API de preguntas
async function cargarTemas() {
    try {
        const res = await fetch('/preguntas/api/temas');
        const data = await res.json();

        const select = document.getElementById('tema');
        select.innerHTML = '';
        data.forEach(t => {
            const option = document.createElement('option');
            option.value = t;
            option.textContent = t;
            select.appendChild(option);
        });
    } catch (error) {
        console.error("Error cargando temas:", error);
    }
}

// Botón para crear nuevo tema
document.getElementById('btn-nuevo-tema').addEventListener('click', async () => {
    const nuevo = prompt("Introduce el nombre del nuevo tema:");
    if (nuevo && nuevo.trim() !== "") {
        const res = await fetch('/preguntas/api/temas/nuevo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tema: nuevo.trim() })
        });

        if (res.ok) {
            await cargarTemas(); // recargar select
            const select = document.getElementById('tema');
            select.value = nuevo.trim(); // seleccionar el nuevo tema
        } else {
            alert("Error al crear tema");
        }
    }
});

// Llamamos al iniciar
cargarTemas();
});