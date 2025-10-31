// script.js - Ahorcado temática hardware

// Variables globales
let WORDS = []; // Se cargará desde el JSON
const MAX_LIVES = 6;

// --- DOM ---
const wordDisplay = document.getElementById('wordDisplay');
const hintEl = document.getElementById('hint');
const keyboardEl = document.getElementById('keyboard');
const livesEl = document.getElementById('lives');
const messageEl = document.getElementById('message');
const btnRestart = document.getElementById('btn-restart');
const btnNueva = document.getElementById('btn-nueva');
const gamesEl = document.getElementById('games');
const winsEl = document.getElementById('wins');
const hangmanCanvas = document.getElementById('hangmanCanvas');

// Elementos del cartel de finalización
const endGameOverlay = document.getElementById('endGameOverlay');
const endGameIcon = document.getElementById('endGameIcon');
const endGameTitle = document.getElementById('endGameTitle');
const endGameMessage = document.getElementById('endGameMessage');
const endGameWord = document.getElementById('endGameWord');
const endGameWins = document.getElementById('endGameWins');
const endGameGames = document.getElementById('endGameGames');
const endGameAccuracy = document.getElementById('endGameAccuracy');
const endGameRestart = document.getElementById('endGameRestart');
const endGameNewWord = document.getElementById('endGameNewWord');

// --- Estado ---
let current = null; // {word, hint}
let guessed = new Set();
let wrong = 0;
let games = 0, wins = 0;

// --- Utilidades ---
const normalize = str => str
  .toLowerCase()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '') // quitar acentos
  .replace(/[^a-z0-9\s]/g, ''); // mantener letras, números y espacios

const letters = "abcdefghijklmnñopqrstuvwxyz0123456789".split('');

// Cargar palabras desde el JSON
async function loadWords() {
  try {
    const response = await fetch('words.json');
    WORDS = await response.json();
    console.log('Palabras cargadas:', WORDS.length);
    return true;
  } catch (error) {
    console.error('Error cargando palabras:', error);
    // Si hay error, usar palabras por defecto
    WORDS = [
      {word: "procesador", hint: "Unidad central de procesamiento (CPU)"},
      {word: "memoria ram", hint: "Memoria volátil usada por programas en ejecución"},
      {word: "disco duro", hint: "Almacenamiento magnético tradicional"}
    ];
    return false;
  }
}

// Selección aleatoria
function pickWord(){
  if (WORDS.length === 0) {
    console.error('No hay palabras disponibles');
    return {word: "computadora", hint: "Máquina electrónica que procesa datos"};
  }
  const idx = Math.floor(Math.random() * WORDS.length);
  return {...WORDS[idx]};
}

// Dibujo del ahorcado con SVG según wrong
function renderHangman(){
  const parts = [
    `<line x1="10" y1="240" x2="190" y2="240" stroke="rgba(255,255,255,0.08)" stroke-width="6" stroke-linecap="round"/>`, // base
    `<line x1="50" y1="240" x2="50" y2="20" stroke="rgba(255,255,255,0.06)" stroke-width="6" stroke-linecap="round"/>`, // palo vertical
    `<line x1="50" y1="20" x2="140" y2="20" stroke="rgba(255,255,255,0.06)" stroke-width="6" stroke-linecap="round"/>`, // brazo
    `<line x1="140" y1="20" x2="140" y2="50" stroke="rgba(255,255,255,0.06)" stroke-width="6" stroke-linecap="round"/>`, // cuerda
    `<circle cx="140" cy="72" r="22" stroke="url(#g)" stroke-width="4" fill="rgba(255,255,255,0.03)"/>`, // cabeza idx4
    `<line x1="140" y1="94" x2="140" y2="150" stroke="url(#g)" stroke-width="4" stroke-linecap="round"/>`, // torso idx5
    `<line x1="140" y1="110" x2="113" y2="140" stroke="url(#g)" stroke-width="4" stroke-linecap="round"/>`, // brazo izq idx6
    `<line x1="140" y1="110" x2="167" y2="140" stroke="url(#g)" stroke-width="4" stroke-linecap="round"/>`, // brazo der idx7
    `<line x1="140" y1="150" x2="113" y2="190" stroke="url(#g)" stroke-width="4" stroke-linecap="round"/>`, // pierna izq idx8
    `<line x1="140" y1="150" x2="167" y2="190" stroke="url(#g)" stroke-width="4" stroke-linecap="round"/>`  // pierna der idx9
  ];
  const shown = parts.slice(0, 4 + wrong); // primeras partes fijas + según wrong
  const svg = `
    <svg viewBox="0 0 220 260" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="g" x1="0" x2="1">
          <stop offset="0" stop-color="#00f0ff"/>
          <stop offset="1" stop-color="#ff4dff"/>
        </linearGradient>
      </defs>
      ${shown.join('')}
    </svg>
  `;
  hangmanCanvas.innerHTML = svg;
}

// Renderizar huecos de la palabra
function renderWord(){
  wordDisplay.innerHTML = ''; // limpiar
  const normalized = normalize(current.word);
  for(const ch of current.word){
    const slot = document.createElement('div');
    slot.className = 'letter-slot';
    // Si es espacio -> mostrar espacio visual y no subrayado
    if(ch === ' '){
      slot.style.borderBottom = 'none';
      slot.style.width = '24px';
      slot.innerHTML = '&nbsp;';
    } else {
      const n = normalize(ch);
      if(guessed.has(n)){
        slot.classList.add('revealed');
        slot.textContent = ch.toUpperCase();
      } else {
        slot.textContent = '';
      }
    }
    wordDisplay.appendChild(slot);
  }
}

// Crear teclado en pantalla
function createKeyboard(){
  keyboardEl.innerHTML = '';
  letters.forEach(l => {
    const key = document.createElement('button');
    key.className = 'key';
    key.textContent = l.toUpperCase();
    key.dataset.letter = l;
    key.addEventListener('click', ()=> handleGuess(l));
    keyboardEl.appendChild(key);
  });
}

// Actualizar estados visibles
function updateUI(){
  livesEl.textContent = MAX_LIVES - wrong;
  hintEl.textContent = current.hint;
  renderWord();
  renderHangman();
  // deshabilitar teclas usadas
  document.querySelectorAll('.key').forEach(k => {
    const l = k.dataset.letter;
    k.classList.toggle('disabled', guessed.has(l));
    k.disabled = guessed.has(l);
  });
}

// Revisar si ganó
function checkWin(){
  for(const ch of current.word){
    if(ch === ' ') continue;
    if(!guessed.has(normalize(ch))) return false;
  }
  return true;
}

// Mostrar cartel de finalización
function showEndGame(isWin){
  if(isWin){
    endGameIcon.textContent = '🎉';
    endGameTitle.textContent = '¡Felicidades!';
    endGameMessage.textContent = 'Has adivinado la palabra correctamente';
  } else {
    endGameIcon.textContent = '💀';
    endGameTitle.textContent = '¡Game Over!';
    endGameMessage.textContent = 'Se te acabaron los intentos';
  }
  
  endGameWord.textContent = `Palabra: ${current.word.toUpperCase()}`;
  endGameWins.textContent = wins;
  endGameGames.textContent = games;
  endGameAccuracy.textContent = games > 0 ? `${Math.round((wins/games)*100)}%` : '0%';
  
  endGameOverlay.classList.add('active');
}

// Ocultar cartel de finalización
function hideEndGame(){
  endGameOverlay.classList.remove('active');
}

// Manejar intento
function handleGuess(letter){
  // letter ya en minúscula sin acentos (teclas son sin ñ/acentos normalizadas)
  // marcar como usado
  if(guessed.has(letter)) return;
  guessed.add(letter);

  const normalizedWord = normalize(current.word);

  if(normalizedWord.includes(letter)){
    // acierto: revelaciones
    renderWord();
    // animación / sonido posible (omitido)
    if(checkWin()){
      wins++;
      games++;
      gamesEl.textContent = games;
      winsEl.textContent = wins;
      disableAllKeys();
      wordDisplay.classList.add('pulse');
      setTimeout(() => wordDisplay.classList.remove('pulse'), 1000);
      setTimeout(() => showEndGame(true), 800);
    }
  } else {
    // error
    wrong++;
    // efecto shake
    wordDisplay.classList.add('shake');
    setTimeout(()=> wordDisplay.classList.remove('shake'), 600);
    renderHangman();
    if(wrong >= MAX_LIVES){
      // perdió
      games++;
      gamesEl.textContent = games;
      revealAll();
      disableAllKeys();
      setTimeout(() => showEndGame(false), 800);
    }
  }
  updateUI();
}

function revealAll(){
  // revelar todas las letras
  current.word.split('').forEach(ch => {
    if(ch !== ' ') guessed.add(normalize(ch));
  });
  renderWord();
}

function disableAllKeys(){
  document.querySelectorAll('.key').forEach(k=>{
    k.disabled = true;
    k.classList.add('disabled');
  });
}

// Reiniciar partida con la misma palabra
function restartSame(){
  guessed.clear();
  wrong = 0;
  messageEl.textContent = '';
  createKeyboard();
  updateUI();
  hideEndGame();
}

// Nueva palabra
function newGame(){
  current = pickWord();
  guessed.clear();
  wrong = 0;
  messageEl.textContent = '';
  createKeyboard();
  updateUI();
  hideEndGame();
}

// Inicialización
async function init(){
  // Mostrar mensaje de carga
  messageEl.textContent = 'Cargando palabras...';
  
  // Cargar palabras desde JSON
  await loadWords();
  
  // Inicializar juego
  createKeyboard();
  newGame();
  gamesEl.textContent = games;
  winsEl.textContent = wins;
  // render inicial
  renderHangman();
  
  // Limpiar mensaje de carga
  messageEl.textContent = '';
}

// Eventos botones
btnRestart.addEventListener('click', ()=> {
  restartSame();
});
btnNueva.addEventListener('click', ()=> {
  newGame();
});

// Eventos del cartel de finalización
endGameRestart.addEventListener('click', () => {
  restartSame();
});

endGameNewWord.addEventListener('click', () => {
  newGame();
});

// Teclado físico
window.addEventListener('keydown', (e)=>{
  if(e.key === 'Enter') return;
  const k = e.key.toLowerCase();
  // normalizar tecla (quitar acento si viene)
  const n = normalize(k);
  if(n.length === 1 && letters.includes(n)){
    handleGuess(n);
  }
});

// Iniciar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', init);

// Exponer funciones útiles a consola (opcional)
window.hangman = {
  newGame, restartSame, revealAll, getState: ()=> ({current, guessed, wrong})
};