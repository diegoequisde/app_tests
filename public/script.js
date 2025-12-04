// 1. Define las preguntas en un array de objetos
const questions = [
    {
        question: "¿Cuál es la capital de España?",
        options: ["Sevilla", "Madrid", "Barcelona", "Valencia"],
        answer: "Madrid"
    },
    {
        question: "¿Qué lenguaje se usa para dar estilos a las páginas web?",
        options: ["JavaScript", "Python", "HTML", "CSS"],
        answer: "CSS"
    },
    {
        question: "¿Qué etiqueta se usa para enlazar JavaScript en HTML?",
        options: ["<js>", "<script>", "<javascript>", "<link>"],
        answer: "<script>"
    }
];

let currentQuestionIndex = 0;
let score = 0;

const questionContainer = document.getElementById('question-container');
const optionsContainer = document.getElementById('options-container');
const submitBtn = document.getElementById('submit-btn');
const resultContainer = document.getElementById('result-container');

// Función para cargar la pregunta actual
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

// Función para manejar la selección de opciones
function selectOption(element, option) {
    // Deselecciona opciones anteriores
    document.querySelectorAll('.option').forEach(opt => {
        opt.classList.remove('selected');
    });
    element.classList.add('selected');
    // Almacena la opción seleccionada temporalmente
    submitBtn.dataset.selectedAnswer = option; 
}

// Función para comprobar la respuesta
submitBtn.addEventListener('click', () => {
    const selectedAnswer = submitBtn.dataset.selectedAnswer;
    if (selectedAnswer) {
        if (selectedAnswer === questions[currentQuestionIndex].answer) {
            score++;
        }
        currentQuestionIndex++;
        submitBtn.dataset.selectedAnswer = ''; // Limpiar selección
        loadQuestion();
    } else {
        alert("Por favor, selecciona una opción.");
    }
});

// Función para mostrar los resultados finales
function showResults() {
    questionContainer.style.display = 'none';
    optionsContainer.style.display = 'none';
    submitBtn.style.display = 'none';
    resultContainer.innerHTML = `<h2>Quiz Completado</h2><p>Tu puntuación es: ${score} de ${questions.length}</p>`;
}

// Cargar la primera pregunta al iniciar
loadQuestion();
