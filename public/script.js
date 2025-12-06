let questions = []; // antes estaba hardcoded
let currentQuestionIndex = 0;
let score = 0;

const questionContainer = document.getElementById('question-container');
const optionsContainer = document.getElementById('options-container');
const submitBtn = document.getElementById('submit-btn');
const resultContainer = document.getElementById('result-container');

// 🔥 1. Cargar preguntas desde tu API
async function loadQuestionsFromServer() {
    try {
        const res = await fetch('/preguntas/api/listado');
        const data = await res.json();

        // Adaptar el formato a tu estructura actual
        questions = data.map(p => ({
            question: p.enunciado,
            options: p.opciones.split(',').map(o => o.trim()),
            answer: p.respuestaCorrecta
        }));

        loadQuestion();
    } catch (error) {
        console.error("Error cargando preguntas:", error);
        questionContainer.innerHTML = "<p>Error cargando preguntas.</p>";
    }
}

// 🔥 2. Cargar una pregunta
function loadQuestion() {
    if (currentQuestionIndex < questions.length) {
        const currentQuestion = questions[currentQuestionIndex];
        questionContainer.innerHTML = `<h2>${currentQuestion.question}</h2>`;
        optionsContainer.innerHTML = '';

        currentQuestion.options.forEach(option => {
            const optionElement = document.createElement('div');
            optionElement.classList.add('option');
            optionElement.textContent = option;
            optionElement.addEventListener('click', () => selectOption(optionElement, option));
            optionsContainer.appendChild(optionElement);
        });

    } else {
        showResults();
    }
}

// 🔥 3. Selección de opción (mantiene tus clases CSS)
function selectOption(element, option) {
    document.querySelectorAll('.option').forEach(opt => opt.classList.remove('selected'));
    element.classList.add('selected');

    submitBtn.dataset.selectedAnswer = option;
}

// 🔥 4. Comprobar la respuesta
submitBtn.addEventListener('click', () => {
    const selectedAnswer = submitBtn.dataset.selectedAnswer;

    if (selectedAnswer) {
        if (selectedAnswer === questions[currentQuestionIndex].answer) {
            score++;
        }
        currentQuestionIndex++;
        submitBtn.dataset.selectedAnswer = '';
        loadQuestion();
    } else {
        alert("Por favor, selecciona una opción.");
    }
});

// 🔥 5. Mostrar resultados finales
function showResults() {
    questionContainer.style.display = 'none';
    optionsContainer.style.display = 'none';
    submitBtn.style.display = 'none';

    resultContainer.innerHTML = `
        <h2>Quiz Completado</h2>
        <p>Tu puntuación es: ${score} de ${questions.length}</p>
    `;
}

// 🔥 6. Iniciar → cargar desde el servidor
loadQuestionsFromServer();
