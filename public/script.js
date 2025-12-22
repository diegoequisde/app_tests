const testState = {
  questions: [],        // preguntas del test
  currentIndex: 0,      // pregunta actual
  answers: {}           // respuestas del usuario por id
};

const questionContainer = document.getElementById('question-container');
const optionsContainer = document.getElementById('options-container');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const finishBtn = document.getElementById('finish-btn');
const resultContainer = document.getElementById('result-container');
const resultList = document.getElementById('result-list');
const scoreEl = document.getElementById('score');
const backHomeBtn = document.getElementById('btn-back-home');

// Cargar preguntas desde localStorage
testState.questions = JSON.parse(localStorage.getItem("testQuestions")) || [];

// --------- Función para mostrar pregunta actual ---------
function loadQuestion() {
  const q = testState.questions[testState.currentIndex];
  if (!q) return;

  // panel izquierdo
  const temasHTML = q.tema
  ? `<div class="question-themes">
       ${q.tema.map(t => `<span class="theme-tag">${t}</span>`).join('')}
     </div>`
  : '';

  questionContainer.innerHTML = `
    ${temasHTML}
    <h2>${q.enunciado}</h2>
    <p>Pregunta ${testState.currentIndex + 1} de ${testState.questions.length}</p>`;

  optionsContainer.innerHTML = '';
  q.opciones.forEach(opt => {
    const div = document.createElement('div');
    div.classList.add('option');
    div.textContent = opt;

    const userAnswer = testState.answers[q.id];
    if (userAnswer === opt) div.classList.add('selected');

    // Para revisión, resaltamos correcto/incorrecto
    if (userAnswer) {
      if (opt === q.respuestaCorrecta) div.classList.add('correct');
      else if (opt === userAnswer) div.classList.add('incorrect');
    }

    div.addEventListener('click', () => selectOption(q.id, opt, div));
    optionsContainer.appendChild(div);
  });

  prevBtn.disabled = testState.currentIndex === 0;
  nextBtn.disabled = testState.currentIndex === testState.questions.length - 1;
}

// --------- Selección de opción ---------
function selectOption(questionId, option, element) {
  testState.answers[questionId] = option;

  document.querySelectorAll('.option').forEach(opt =>
    opt.classList.remove('selected')
  );
  element.classList.add('selected');
}

// --------- Navegación ---------
prevBtn.addEventListener('click', () => {
  if (testState.currentIndex > 0) {
    testState.currentIndex--;
    loadQuestion();
  }
});

nextBtn.addEventListener('click', () => {
  if (testState.currentIndex < testState.questions.length - 1) {
    testState.currentIndex++;
    loadQuestion();
  }
});

// --------- Finalizar test ---------
finishBtn.addEventListener('click', () => {
  showResults();
});

// --------- Mostrar resultados y revisión --------- 
function showResults() {
  const total = testState.questions.length;
  let correctCount = 0;

  resultList.innerHTML = '';
  testState.questions.forEach((q, index) => {
    const userAnswer = testState.answers[q.id];
    const isCorrect = userAnswer === q.respuestaCorrecta;
    if (isCorrect) correctCount++;

    const li = document.createElement('li');
    li.textContent = `Pregunta ${index + 1}: ${isCorrect ? '✅' : '❌'}`;
    li.addEventListener('click', () => {
      testState.currentIndex = index;
      loadQuestion();
    });
    resultList.appendChild(li);
  });

  scoreEl.textContent = `Puntuación: ${correctCount} de ${total}`;
}

// --------- Revisar pregunta individual ---------
function reviewQuestion(index) {
  const q = testState.questions[index];
  if (!q) return;

  questionContainer.style.display = 'block';
  optionsContainer.style.display = 'block';
  prevBtn.style.display = 'inline-block';
  nextBtn.style.display = 'inline-block';
  finishBtn.style.display = 'inline-block';
  resultContainer.style.display = 'none';

  testState.currentIndex = index;

  questionContainer.innerHTML = `
    <h2>${q.enunciado}</h2>
    <p>Pregunta ${index + 1} de ${testState.questions.length}</p>
  `;

  optionsContainer.innerHTML = '';
  q.opciones.forEach(opt => {
    const div = document.createElement('div');
    div.classList.add('option');
    div.textContent = opt;

    const userAnswer = testState.answers[q.id];

    if (opt === q.respuestaCorrecta) {
      div.classList.add('correct');
    }
    if (userAnswer === opt && userAnswer !== q.respuestaCorrecta) {
      div.classList.add('incorrect');
    }

    optionsContainer.appendChild(div);
  });

  // Actualizar botones de navegación
  prevBtn.disabled = index === 0;
  nextBtn.disabled = index === testState.questions.length - 1;
}

// --------- Volver al inicio ---------
backHomeBtn.addEventListener('click', () => {
  window.location.href = "/";
});

// --------- Inicializar ---------
loadQuestion();
