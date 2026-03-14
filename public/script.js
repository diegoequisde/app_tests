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
const backHomeBtn = document.getElementById('btn-back-home');

// Las preguntas del test se guardan en localStorage como estado temporal del test generado desde BD
function saveState() {
  localStorage.setItem("testState", JSON.stringify(testState));
}

// Restaurar estado del test si existe
const savedState = localStorage.getItem("testState");

if (savedState) {
  const parsed = JSON.parse(savedState);

  // Si el test estaba finalizado, limpiamos todo
  if (parsed.finished) {
    localStorage.removeItem("testState");
    localStorage.removeItem("testQuestions");
  } else {
    Object.assign(testState, parsed);
  }
}

if (testState.questions.length === 0) {
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
    <p>Pregunta ${testState.currentIndex + 1} de ${testState.questions.length}</p>
    <h2>${q.enunciado}</h2>
    `;

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
  updateButtons();
}

// renderizar la navegación de preguntas y el contador de respondidas
function renderQuestionNav() {

  const nav = document.getElementById("question-nav");
  const counter = document.getElementById("question-counter");

  nav.innerHTML = "";

  const total = testState.questions.length;
  const answered = Object.keys(testState.answers).length;

  // contador
  if (!testState.finished) {

    counter.textContent = `Respondidas: ${answered} / ${total}`;

  } else {

    const correct = testState.questions.filter(
      q => testState.answers[q.id] === q.respuestaCorrecta
    ).length;

    counter.textContent = `Resultado: ${correct} / ${total}`;
  }

  testState.questions.forEach((q, index) => {

    const btn = document.createElement("button");
    btn.textContent = index + 1;

    const userAnswer = testState.answers[q.id];

    // pregunta actual
    if (index === testState.currentIndex) {
      btn.classList.add("current");
    }

    // estado durante examen
    if (!testState.finished) {

      if (!userAnswer && index !== testState.currentIndex) {
        btn.classList.add("unanswered");
      }

    }

    // estado tras finalizar
    if (testState.finished) {

      if (userAnswer === undefined) {
        btn.classList.add("not-answered");
      }
      else if (userAnswer === q.respuestaCorrecta) {
        btn.classList.add("correct");
      }
      else {
        btn.classList.add("incorrect");
      }

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
  const currentAnswer = testState.answers[questionId];

  // Si se pulsa la misma opción, se desmarca
  if (currentAnswer === option) {
    delete testState.answers[questionId];
    element.classList.remove('selected');

  } else {
    testState.answers[questionId] = option;
    document.querySelectorAll('.option').forEach(opt =>
      opt.classList.remove('selected')
    );

    element.classList.add('selected');
  }

  renderQuestionNav();
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
  if (!confirm("¿Seguro que quieres finalizar el test?")) return;
  showResults();
});

// --------- Mostrar resultados y revisión --------- 
function showResults() {

  const total = testState.questions.length;

  const correct = testState.questions.filter(
    q => testState.answers[q.id] === q.respuestaCorrecta
  ).length;

  testState.finished = true;

  saveState();

  // preparar respuestas individuales
  const answersData = testState.questions.map(q => {

    const selected = testState.answers[q.id];

    return {
      questionId: q.id,
      selectedAnswer: selected || null,
      correctAnswer: q.respuestaCorrecta,
      isCorrect: selected === q.respuestaCorrecta
    };

  });

  // guardar respuestas
  fetch("/api/test-answers", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      answers: answersData
    })
  });
  
  // enviar resultado al servidor
  fetch("/api/test-result", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      score: correct,
      total: total
    })
  })
  .catch(err => console.error("Error guardando resultado:", err));

  renderQuestionNav();
  loadQuestion();

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
  testState.currentIndex = index;
  

  questionContainer.innerHTML = `
    <p>Pregunta ${index + 1} de ${testState.questions.length}</p>
    <h2>${q.enunciado}</h2>
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


function updateButtons() {

  if (testState.finished) {
    finishBtn.style.display = "none";
    backHomeBtn.style.display = "block";
  } else {
    finishBtn.style.display = "block";
    backHomeBtn.style.display = "none";
  }

}

// --------- Volver al inicio ---------
backHomeBtn.addEventListener('click', () => {

  localStorage.removeItem("testState");
  localStorage.removeItem("testQuestions");

  window.location.href = "/";

});

// --------- Inicializar ---------
loadQuestion();
