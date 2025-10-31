let wordsData = [];
const gridSize = 15;
let selectedWords = [];
let grid = [];
let placedWords = [];
let selectedCells = [];
let score = 0;
let isSelecting = false;
let gameTime = 0;
let timerInterval;
let foundWordsCount = 0;

const directions = [
  { x: 1, y: 0, name: 'horizontal' },
  { x: 0, y: 1, name: 'vertical' },
  { x: 1, y: 1, name: 'diagonal' }
];

async function loadWords() {
  try {
    const response = await fetch('softsopa.json');
    wordsData = await response.json();
    initGame();
  } catch (error) {
    console.error('Error cargando palabras:', error);
    // Datos de respaldo en caso de error
    wordsData = [
     [
   { "word": "ANDROID", "image": "img/android.jpg" },
   { "word": "BASEDEDATOS", "image": "img/base de datos.webp" },
   { "word": "LINUX", "image": "img/linux.webp" },
   { "word": "FIREWALLS", "image": "img/firewalls.webp" },
   { "word": "MYSQL", "image": "img/mysql.webp" },
   { "word": "SKETCH", "image": "img/sketch.webp" },
   { "word": "VISUALSTUDIO", "image": "img/visual studio.webp" },
   { "word": "VPN", "image": "img/vpn.webp" },
   { "word": "WEB", "image": "img/web.webp" },
   { "word": "WINDOWS", "image": "img/windows.webp" }
]

    ];
    initGame();
  }
}

function initGame() {
  clearInterval(timerInterval);
  gameTime = 0;
  score = 0;
  foundWordsCount = 0;
  
  const gridElement = document.getElementById('grid');
  const wordList = document.getElementById('word-list');
  const scoreValue = document.getElementById('score-value');
  const timeValue = document.getElementById('time-value');
  const foundCount = document.getElementById('found-count');
  const totalWords = document.getElementById('total-words');
  
  gridElement.innerHTML = "";
  wordList.innerHTML = "";
  scoreValue.textContent = score;
  timeValue.textContent = "00:00";
  foundCount.textContent = "0";
  document.getElementById("found-image").style.display = "none";
  document.getElementById("image-caption").textContent = "";
  
  selectedWords = [];
  grid = [];
  placedWords = [];
  selectedCells = [];
  
  // Seleccionar 8 palabras aleatorias
  selectedWords = [...wordsData]
    .sort(() => Math.random() - 0.5)
    .slice(0, 8);
  
  totalWords.textContent = selectedWords.length;
  
  createEmptyGrid();
  placeAllWords();
  fillEmptyCells();
  renderGrid();
  renderWordList();
  
  // Iniciar temporizador
  timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
  gameTime++;
  const minutes = Math.floor(gameTime / 60).toString().padStart(2, '0');
  const seconds = (gameTime % 60).toString().padStart(2, '0');
  document.getElementById('time-value').textContent = `${minutes}:${seconds}`;
}

function createEmptyGrid() {
  grid = Array(gridSize).fill().map(() => Array(gridSize).fill(''));
}

function placeAllWords() {
  placedWords = [];
  
  selectedWords.forEach(wordObj => {
    let placed = false;
    let attempts = 0;
    const word = wordObj.word.toUpperCase();
    
    while (!placed && attempts < 200) {
      attempts++;
      const direction = directions[Math.floor(Math.random() * directions.length)];
      
      let maxX = gridSize;
      let maxY = gridSize;
      
      if (direction.x === 1) maxX = gridSize - word.length;
      if (direction.y === 1) maxY = gridSize - word.length;
      
      const startX = Math.floor(Math.random() * maxX);
      const startY = Math.floor(Math.random() * maxY);
      
      if (canPlaceWord(word, startX, startY, direction)) {
        placeWordInGrid(word, startX, startY, direction, wordObj);
        placed = true;
      }
    }
    
    if (!placed) {
      console.warn(`No se pudo colocar: ${word}`);
    }
  });
}

function canPlaceWord(word, x, y, direction) {
  for (let i = 0; i < word.length; i++) {
    const newX = x + i * direction.x;
    const newY = y + i * direction.y;
    
    if (newX < 0 || newX >= gridSize || newY < 0 || newY >= gridSize) {
      return false;
    }
    
    if (grid[newY][newX] !== '' && grid[newY][newX] !== word[i]) {
      return false;
    }
  }
  return true;
}

function placeWordInGrid(word, x, y, direction, wordObj) {
  const wordPositions = [];
  
  for (let i = 0; i < word.length; i++) {
    const newX = x + i * direction.x;
    const newY = y + i * direction.y;
    grid[newY][newX] = word[i];
    wordPositions.push({ x: newX, y: newY });
  }
  
  placedWords.push({
    word: word,
    positions: wordPositions,
    direction: direction.name,
    image: wordObj.image,
    found: false
  });
}

function fillEmptyCells() {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      if (grid[y][x] === '') {
        grid[y][x] = letters[Math.floor(Math.random() * letters.length)];
      }
    }
  }
}

function renderGrid() {
  const gridElement = document.getElementById('grid');
  gridElement.innerHTML = "";
  
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      const cell = document.createElement('div');
      cell.classList.add('grid-cell');
      cell.textContent = grid[y][x];
      cell.dataset.x = x;
      cell.dataset.y = y;
      
      cell.addEventListener('mousedown', (e) => startSelect(e, cell));
      cell.addEventListener('mouseenter', (e) => selecting(e, cell));
      cell.addEventListener('mouseup', endSelect);
      
      // Soporte para dispositivos táctiles
      cell.addEventListener('touchstart', (e) => {
        e.preventDefault();
        startSelect(e, cell);
      });
      cell.addEventListener('touchmove', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        const element = document.elementFromPoint(touch.clientX, touch.clientY);
        if (element && element.classList.contains('grid-cell')) {
          selecting(e, element);
        }
      });
      cell.addEventListener('touchend', (e) => {
        e.preventDefault();
        endSelect();
      });
      
      gridElement.appendChild(cell);
    }
  }
}

function renderWordList() {
  const wordList = document.getElementById('word-list');
  selectedWords.forEach(wordObj => {
    const li = document.createElement('li');
    li.textContent = wordObj.word;
    li.dataset.word = wordObj.word.toUpperCase();
    wordList.appendChild(li);
  });
}

function startSelect(e, cell) {
  e.preventDefault();
  isSelecting = true;
  selectedCells = [cell];
  cell.classList.add('selected');
}

function selecting(e, cell) {
  e.preventDefault();
  if (isSelecting && !selectedCells.includes(cell)) {
    const lastCell = selectedCells[selectedCells.length - 1];
    const lastX = parseInt(lastCell.dataset.x);
    const lastY = parseInt(lastCell.dataset.y);
    const currentX = parseInt(cell.dataset.x);
    const currentY = parseInt(cell.dataset.y);
    
    const deltaX = currentX - lastX;
    const deltaY = currentY - lastY;
    
    if (selectedCells.length === 1 || 
        (Math.abs(deltaX) <= 1 && Math.abs(deltaY) <= 1 && 
         (deltaX === selectedCells[1].dataset.x - selectedCells[0].dataset.x || 
          deltaY === selectedCells[1].dataset.y - selectedCells[0].dataset.y))) {
      selectedCells.push(cell);
      cell.classList.add('selected');
    }
  }
}

function endSelect() {
  if (!isSelecting) return;
  
  isSelecting = false;
  
  if (selectedCells.length < 2) {
    clearSelection();
    return;
  }
  
  const selectedWord = selectedCells.map(cell => cell.textContent).join('');
  checkWord(selectedWord, selectedCells);
}

function checkWord(word, cells) {
  let foundWord = null;
  
  for (const placedWord of placedWords) {
    if (placedWord.word === word && !placedWord.found) {
      const positionsMatch = cells.every(cell => {
        const x = parseInt(cell.dataset.x);
        const y = parseInt(cell.dataset.y);
        return placedWord.positions.some(pos => pos.x === x && pos.y === y);
      });
      
      if (positionsMatch && cells.length === placedWord.positions.length) {
        foundWord = placedWord;
        break;
      }
    }
  }
  
  if (foundWord) {
    foundWord.found = true;
    foundWordsCount++;
    
    const wordItems = document.querySelectorAll('#word-list li');
    wordItems.forEach(item => {
      if (item.dataset.word === foundWord.word) {
        item.classList.add('found');
      }
    });
    
    score += 10;
    document.getElementById('score-value').textContent = score;
    document.getElementById('found-count').textContent = foundWordsCount;
    
    const img = document.getElementById("found-image");
    img.src = foundWord.image;
    img.alt = `Imagen de ${foundWord.word}`;
    img.style.display = "block";
    
    document.getElementById("image-caption").textContent = `¡Encontraste: ${foundWord.word}!`;
    
    cells.forEach(cell => {
      cell.classList.remove('selected');
      cell.classList.add('found');
    });
    
    // Efecto de sonido (simulado)
    playFoundSound();
    
    checkGameComplete();
  } else {
    // Efecto visual para palabra incorrecta
    selectedCells.forEach(cell => {
      cell.classList.add('incorrect');
      setTimeout(() => {
        cell.classList.remove('incorrect');
      }, 500);
    });
    setTimeout(clearSelection, 500);
  }
}

function playFoundSound() {
  // Simular un sonido con el audio API (compatible con todos los navegadores)
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  } catch (e) {
    console.log("El audio no está soportado en este navegador");
  }
}

function clearSelection() {
  selectedCells.forEach(cell => {
    cell.classList.remove('selected');
    cell.classList.remove('incorrect');
  });
  selectedCells = [];
}

function checkGameComplete() {
  const allFound = placedWords.every(word => word.found);
  if (allFound) {
    clearInterval(timerInterval);
    
    // Calcular puntuación final basada en el tiempo
    const timeBonus = Math.max(0, 100 - gameTime);
    score += timeBonus;
    document.getElementById('score-value').textContent = score;
    
    setTimeout(() => {
      const minutes = Math.floor(gameTime / 60);
      const seconds = gameTime % 60;
      
      alert(`¡Felicidades! Completaste la sopa de letras.\n
Tiempo: ${minutes}:${seconds.toString().padStart(2, '0')}
Puntuación final: ${score}
Bonus por tiempo: ${timeBonus}`);
    }, 1000);
  }
}

// Event listeners
document.getElementById("reset-btn").addEventListener("click", initGame);
window.addEventListener("load", loadWords);

// Prevenir selección de texto
document.addEventListener('selectstart', e => e.preventDefault());

// Agregar estilos para selección incorrecta
const style = document.createElement('style');
style.textContent = `
  .grid-cell.incorrect {
    background-color: #ff6b6b !important;
    color: #0d0f1a !important;
    animation: shake 0.5s;
  }
  
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
  }
`;
document.head.appendChild(style);