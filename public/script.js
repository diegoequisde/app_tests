const testState = {
  questions: [],
  currentIndex: 0,
  answers: {},
  finished: false
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

// Las preguntas del test se guardan en localStorage como estado temporal del test generado desde BD
function saveState() {
  localStorage.setItem("testState", JSON.stringify(testState));
}

// Restaurar estado del test si existe
const savedState = localStorage.getItem("testState");
if (savedState) {
  Object.assign(testState, JSON.parse(savedState));
} else {
  const questions = JSON.parse(localStorage.getItem("testQuestions")) || [];
  testState.questions = questions;
}

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

    // Para revisión, resaltamos correcto/incorrecto SOLO si está finalziado el test
    if (testState.finished) {

      if (opt === q.respuestaCorrecta) {
        div.classList.add('correct');
      }

      if (userAnswer && opt === userAnswer && opt !== q.respuestaCorrecta) {
        div.classList.add('incorrect');
      }
  }

    div.addEventListener('click', () => selectOption(q.id, opt, div));
    optionsContainer.appendChild(div);
  });

  prevBtn.disabled = testState.currentIndex === 0;
  nextBtn.disabled = false;
  renderQuestionNav();
}

// renderizar la navegación de preguntas y el contador de respondidas
function renderQuestionNav() {
  const nav = document.getElementById("question-nav");
  const counter = document.getElementById("question-counter");
  nav.innerHTML = "";
  let answered = Object.keys(testState.answers).length;
  let total = testState.questions.length;

  counter.textContent = `Respondidas: ${answered} / ${total}`;
  testState.questions.forEach((q, index) => {

    const btn = document.createElement("button");
    btn.textContent = index + 1;

    if (index === testState.currentIndex) {
      btn.classList.add("current");
    }
    if (!testState.answers[q.id]) {
      btn.classList.add("unanswered");
    }

    btn.addEventListener("click", () => {
      testState.currentIndex = index;
      loadQuestion();
      saveState();
    });
    nav.appendChild(btn);
  });

}

// --------- Selección de opción ---------
function selectOption(questionId, option, element) {
   if (testState.finished) return;
  testState.answers[questionId] = option;
  
  document.querySelectorAll('.option').forEach(opt =>
    opt.classList.remove('selected')
  );
  element.classList.add('selected');
  
  saveState();
}

// --------- Navegación ---------
prevBtn.addEventListener('click', () => {
  if (testState.currentIndex > 0) {
      testState.currentIndex--;
      loadQuestion();
    }
    saveState();
  });

nextBtn.addEventListener('click', () => {
  if (testState.currentIndex < testState.questions.length - 1) {
    testState.currentIndex++;
    loadQuestion();
    return;
  }
  // Si estamos en la última vamos a la primera sin responder
  const nextUnanswered = getFirstUnansweredIndex();
  if (nextUnanswered !== -1) {
    testState.currentIndex = nextUnanswered;
    loadQuestion();
  }
  saveState();
});

// Obtener el índice de la primera pregunta sin responder.
function getFirstUnansweredIndex() {
  for (let i = 0; i < testState.questions.length; i++) {
    const q = testState.questions[i];
    if (testState.answers[q.id] === undefined) {
      return i;
    }
  }
  return -1;
}

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
    li.textContent = index + 1;

    li.classList.add("question-number");

    if (userAnswer === undefined) {
      li.classList.add("unanswered");
    } else if (isCorrect) {
      li.classList.add("correct");
    } else {
      li.classList.add("incorrect");
    }

    li.addEventListener("click", () => {
      testState.currentIndex = index;
      loadQuestion();
    });

    resultList.appendChild(li);

  });

  scoreEl.textContent = `Resultado: ${correctCount} / ${total}`;

  testState.finished = true;
  saveState();

  loadQuestion(); // recargar pregunta para mostrar colores
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
