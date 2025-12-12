let questions = JSON.parse(localStorage.getItem("testQuestions")) || [];
let currentQuestionIndex = 0;
let score = 0;

const questionContainer = document.getElementById('question-container');
const optionsContainer = document.getElementById('options-container');
const submitBtn = document.getElementById('submit-btn');
const resultContainer = document.getElementById('result-container');

function loadQuestion() {
    if (currentQuestionIndex < questions.length) {
        const q = questions[currentQuestionIndex];
        questionContainer.innerHTML = `<h2>${q.enunciado}</h2>`;
        optionsContainer.innerHTML = '';

        q.opciones.forEach(opt => {
            const div = document.createElement('div');
            div.classList.add('option');
            div.textContent = opt;
            div.addEventListener('click', () => selectOption(div, opt));
            optionsContainer.appendChild(div);
        });
    } else {
        showResults();
    }
}

function selectOption(element, option) {
    document.querySelectorAll('.option').forEach(opt => opt.classList.remove('selected'));
    element.classList.add('selected');
    submitBtn.dataset.selectedAnswer = option;
}

submitBtn.addEventListener('click', () => {
    const selected = submitBtn.dataset.selectedAnswer;
    if (!selected) return alert("Selecciona una opción");
    if (selected === questions[currentQuestionIndex].respuestaCorrecta) score++;
    currentQuestionIndex++;
    submitBtn.dataset.selectedAnswer = '';
    loadQuestion();
});

function showResults() {
    questionContainer.style.display = 'none';
    optionsContainer.style.display = 'none';
    submitBtn.style.display = 'none';

    resultContainer.innerHTML = `<h2>Test completado</h2><p>Puntuación: ${score} de ${questions.length}</p>`;
}

loadQuestion();
