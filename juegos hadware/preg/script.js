const questions = [
  {
    title: "Cuando juegas Fortnite, ¿quién es el componente que está más enfocado en que el juego funcione?",
    image: "img/procesador.webp",
    options: [
      "Tarjeta Gráfica",
      "Disco Duro",
      "Procesador",
      "Placa Madre",
      "Memoria RAM"
    ],
    correctIndex: 2
  },
  {
    title: "Si tu computadora fuera un celular, ¿qué componente sería como la memoria que se llena cuando tienes muchas apps abiertas?",
    image: "img/memoria ram.jpg",
    options: [
      "Tarjeta Gráfica",
      "Disco Duro",
      "Procesador",
      "Placa Madre",
      "Memoria RAM"
    ],
    correctIndex: 4
  },
  {
    title: "En el parque de diversiones de la computadora ,¿quien es el que se asegura que todos los juegos esten todos conectados a la electricidad?",
    image: "img/placa madre.jpeg",
    options: [
      "Tarjeta Gráfica",
      "Disco Duro",
      "Procesador",
      "Placa Madre",
      "Memoria RAM"
    ],
    correctIndex: 3
  },
  {
    title: "¿Dónde crees que se guarda realmente todo lo que descargas (juegos, fotos, apps) cuando no los estás usando?",
    image: "img/disco duro ssd.webp",
    options: [
      "Tarjeta Gráfica",
      "Disco Duro",
      "Procesador",
      "Placa Madre",
      "Memoria RAM"
    ],
    correctIndex: 1
  },
  {
    title: "¿Qué componente hace que los gráficos de tus juegos se vean tan realistas y fluidos?",
    image: "img/tarjeta grafica.jpeg",
    options: [
      "Tarjeta Gráfica",
      "Disco Duro",
      "Procesador",
      "Placa Madre",
      "Memoria RAM"
    ],
    correctIndex: 0
  }
];

let currentQuestion = 0;
let correctAnswers = 0;
let incorrectAnswers = 0;

const questionTitle = document.getElementById("question-title");
const imageElement = document.getElementById("component-image");
const optionsContainer = document.getElementById("options-container");
const nextBtn = document.getElementById("next-btn");
const statsContainer = document.getElementById("stats-container");
const correctCount = document.getElementById("correct-count");
const incorrectCount = document.getElementById("incorrect-count");
const accuracyElement = document.getElementById("accuracy");
const restartBtn = document.getElementById("restart-btn");

// Cargar estadísticas guardadas
function loadGameStats() {
  const savedStats = localStorage.getItem('pcComponentsGameStats');
  if (savedStats) {
    const stats = JSON.parse(savedStats);
    correctAnswers = stats.correctAnswers || 0;
    incorrectAnswers = stats.incorrectAnswers || 0;
    updateStatsDisplay();
  }
}

// Guardar estadísticas
function saveGameStats() {
  const stats = {
    correctAnswers: correctAnswers,
    incorrectAnswers: incorrectAnswers,
    lastPlayed: new Date().toISOString()
  };
  localStorage.setItem('pcComponentsGameStats', JSON.stringify(stats));
}

// Actualizar la visualización de estadísticas
function updateStatsDisplay() {
  correctCount.textContent = correctAnswers;
  incorrectCount.textContent = incorrectAnswers;
  
  const total = correctAnswers + incorrectAnswers;
  const accuracy = total > 0 ? Math.round((correctAnswers / total) * 100) : 0;
  accuracyElement.textContent = `${accuracy}%`;
}

function loadQuestion(index) {
  const q = questions[index];
  questionTitle.textContent = q.title;
  imageElement.src = q.image;
  imageElement.alt = "Componente";

  // Vaciar opciones anteriores
  optionsContainer.innerHTML = "";

  // Crear nuevas opciones
  q.options.forEach((text, i) => {
    const btn = document.createElement("button");
    btn.className = "option";
    btn.textContent = text;
    btn.addEventListener("click", () => handleAnswer(i, q.correctIndex));
    optionsContainer.appendChild(btn);
  });

  // Ocultar botón siguiente
  nextBtn.classList.add("hidden");
}

function handleAnswer(selectedIndex, correctIndex) {
  const buttons = document.querySelectorAll(".option");
  buttons.forEach((btn, i) => {
    btn.classList.add("disabled");

    if (i === correctIndex) {
      btn.classList.add("correct", "selected");
    } else if (i === selectedIndex) {
      btn.classList.add("incorrect", "selected");
    }
  });

  // Actualizar estadísticas
  if (selectedIndex === correctIndex) {
    correctAnswers++;
    nextBtn.classList.remove("hidden");
  } else {
    incorrectAnswers++;
  }
  
  updateStatsDisplay();
  saveGameStats();
}

nextBtn.addEventListener("click", () => {
  currentQuestion++;
  if (currentQuestion < questions.length) {
    loadQuestion(currentQuestion);
  } else {
    alert("¡Juego terminado! 🎉");
    // Mostrar estadísticas finales
    statsContainer.style.display = "block";
    nextBtn.classList.add("hidden");
  }
});

restartBtn.addEventListener("click", () => {
  currentQuestion = 0;
  correctAnswers = 0;
  incorrectAnswers = 0;
  updateStatsDisplay();
  saveGameStats();
  loadQuestion(currentQuestion);
});

// Cargar la primera pregunta y estadísticas
loadQuestion(currentQuestion);
loadGameStats();