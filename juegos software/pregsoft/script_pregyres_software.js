const questions = [
  {
    title: "¿Qué navegador web es desarrollado por Google?",
    image: "img/chrome.jpeg",
    options: [
      "Firefox",
      "Safari",
      "Chrome",
      "Edge"
    ],
    correctIndex: 2
  },
  {
    title: "¿Qué plataforma permite ver y subir videos?",
    image: "img/youtube.png",
    options: [
      "Instagram",
      "TikTok",
      "YouTube",
      "Facebook"
    ],
    correctIndex: 2
  },
  {
    title: "¿En qué programa puedes escribir tu tarea y que te marque los errores de ortografia en tu archivo?",
    image: "img/word.jpeg",
    options: [
      "canva",
      "word",
      "adobe acrobat",
      "docs"
    ],
    correctIndex: 1
  },
  {
    title: "Si anotaras tus gastos de la semana, ¿qué app te haría una gráfica para ver en qué gastaste más?",
    image: "img/excel.jpeg",
    options: [
      "canva",
      "excel",
      "word",
      "sheet"
    ],
    correctIndex: 1
  },
  {
    title: "¿Qué usas en la compu para ver TikTok o buscar info para tu proyecto?",
    image: "img/egde.jpeg",
    options: [
      "microsoft egde",
      "google chrome",
      "firefox",
      "safari"
    ],
    correctIndex: 0
  },
  {
    title: "¿Dónde puedes meter a toda tu clase en un chat grupal desde la laptop?",
    image: "img/whatapp.png",
    options: [
      "discord",
      "whatsapp",
      "instagram",
      "telegram"
    ],
    correctIndex: 1
  },
  {
    title: "¿Qué lugar guarda miles de datos como un superarchivero?",
    image: "img/access.png",
    options: [
      "excel",
      "sheet",
      "access",
      "canva"
    ],
    correctIndex: 2
  },
  {
    title: "¿En qué app puedes crear presentaciones, pósters e historias para Instagram como un profesional, sin ser un experto en diseño?",
    image: "img/canva.jpeg",
    options: [
      "adobe acrobat",
      "canva",
      "word",
      "docs"
    ],
    correctIndex: 1
  }
];

let currentQuestion = 0;
let correctAnswers = 0;
let incorrectAnswers = 0;

const questionTitle = document.getElementById("question-title");
const imageElement = document.getElementById("component-image");
const optionsContainer = document.getElementById("options-container");
const nextBtn = document.getElementById("next-btn");
const continueBtn = document.getElementById("continue-btn");
const statsContainer = document.getElementById("stats-container");
const correctCount = document.getElementById("correct-count");
const incorrectCount = document.getElementById("incorrect-count");
const accuracyElement = document.getElementById("accuracy");
const restartBtn = document.getElementById("restart-btn");

// Cargar estadísticas guardadas y partida actual
function loadGameStats() {
  const savedStats = localStorage.getItem('chromeYoutubeGameStats');
  if (savedStats) {
    const stats = JSON.parse(savedStats);
    correctAnswers = stats.correctAnswers || 0;
    incorrectAnswers = stats.incorrectAnswers || 0;
    currentQuestion = stats.currentQuestion || 0;
    
    // Si hay una partida en progreso, mostrar botón continuar
    if (currentQuestion > 0 && currentQuestion < questions.length) {
      continueBtn.classList.remove("hidden");
    }
    
    updateStatsDisplay();
  }
}

// Guardar estadísticas y progreso actual
function saveGameStats() {
  const stats = {
    correctAnswers: correctAnswers,
    incorrectAnswers: incorrectAnswers,
    currentQuestion: currentQuestion,
    lastPlayed: new Date().toISOString()
  };
  localStorage.setItem('chromeYoutubeGameStats', JSON.stringify(stats));
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
  imageElement.alt = "Imagen relacionada con la pregunta";

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

  // Ocultar botones
  nextBtn.classList.add("hidden");
  continueBtn.classList.add("hidden");
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
    alert("¡Juego terminado! 🎉 Has completado todas las preguntas sobre Chrome y YouTube.");
    // Mostrar estadísticas finales
    statsContainer.style.display = "block";
    nextBtn.classList.add("hidden");
    // Reiniciar progreso
    currentQuestion = 0;
    saveGameStats();
  }
});

continueBtn.addEventListener("click", () => {
  loadQuestion(currentQuestion);
  continueBtn.classList.add("hidden");
});

restartBtn.addEventListener("click", () => {
  currentQuestion = 0;
  correctAnswers = 0;
  incorrectAnswers = 0;
  updateStatsDisplay();
  saveGameStats();
  loadQuestion(currentQuestion);
  continueBtn.classList.add("hidden");
});

// Cargar la primera pregunta y estadísticas
loadQuestion(currentQuestion);
loadGameStats();