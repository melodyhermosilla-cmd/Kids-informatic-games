// Elementos del DOM
const timerDisplay = document.getElementById('timer');
const startBtn = document.getElementById('start-btn');
const resetBtn = document.getElementById('reset-btn');
const nextBtn = document.getElementById('next-btn');
const puzzleBoard = document.getElementById('puzzle-board');
const puzzlePieces = document.getElementById('puzzle-pieces');
const winMessage = document.getElementById('win-message');
const winTime = document.getElementById('win-time');
const closeWinBtn = document.getElementById('close-win');
const resultsList = document.getElementById('results-list');
const puzzleTitle = document.getElementById('puzzle-title');
const puzzleSubtitle = document.getElementById('puzzle-subtitle');
const hintText = document.getElementById('hint-text');

// Variables del juego
let timeLeft = 300; // 5 minutos en segundos
let timerInterval;
let gameStarted = false;
let gameCompleted = false;
let placedPieces = 0;
let currentPuzzle = 'ram'; // 'ram' o 'cpu'

// Información de los rompecabezas
const puzzles = {
    ram: {
        title: 'Rompecabezas de Memoria RAM',
        subtitle: 'Arma las piezas para aprender sobre este componente esencial de la computadora',
        hint: 'La Memoria RAM (Random Access Memory) es un tipo de memoria volátil que almacena temporalmente los datos que la CPU necesita para acceder rápidamente. Es esencial para el rendimiento del sistema.',
        images: [
            "img/memoria ram pieza 1.jpg",
            "img/memoria ram pieza 3.jpg",
            "img/memoria ram pieza 2.jpg",
            "img/memoria ram pieza 4.jpg"
        ],
        storageKey: 'ramPuzzleResults'
    },
    cpu: {
        title: 'Rompecabezas del Procesador (CPU)',
        subtitle: 'Arma las piezas para aprender sobre el cerebro de la computadora',
        hint: 'El procesador (CPU) es como el cerebro de la computadora. Se encarga de realizar todos los cálculos y seguir las instrucciones de los programas. Cuanto más rápido sea el procesador, más rápido funcionará tu computadora.',
        images: [
            "img/procesador_pieza_3.jpg",
            "img/procesador_pieza_1.jpg",
            "img/procesador_pieza_4.jpg",
            "img/procesador_pieza_2.jpg"
        ],
        storageKey: 'cpuPuzzleResults'
    }
};

// Almacenar resultados en localStorage
let results = JSON.parse(localStorage.getItem(puzzles[currentPuzzle].storageKey)) || [];

// Inicializar el juego
function initGame() {
    createPuzzleBoard();
    createPuzzlePieces();
    updateResultsList();
    setupDragAndDrop();
    updatePieceCounter();
    updateUI();
    
    startBtn.addEventListener('click', startGame);
    resetBtn.addEventListener('click', resetGame);
    nextBtn.addEventListener('click', nextPuzzle);
    closeWinBtn.addEventListener('click', () => {
        winMessage.classList.remove('active');
    });
}

// Actualizar la interfaz según el rompecabezas actual
function updateUI() {
    const puzzle = puzzles[currentPuzzle];
    puzzleTitle.textContent = puzzle.title;
    puzzleSubtitle.textContent = puzzle.subtitle;
    hintText.textContent = puzzle.hint;
    
    // Actualizar resultados
    results = JSON.parse(localStorage.getItem(puzzle.storageKey)) || [];
    updateResultsList();
}

// Cambiar al siguiente rompecabezas
function nextPuzzle() {
    // Reiniciar el juego actual
    resetGame();
    
    // Cambiar al siguiente rompecabezas
    currentPuzzle = currentPuzzle === 'ram' ? 'cpu' : 'ram';
    
    // Actualizar la interfaz
    updateUI();
    
    // Volver a crear el tablero y las piezas
    createPuzzleBoard();
    createPuzzlePieces();
    updatePieceCounter();
    setupDragAndDrop();
}

// Crear tablero del rompecabezas con slots ordenados
function createPuzzleBoard() {
    puzzleBoard.innerHTML = '';
    
    // Crear 4 slots ordenados
    for (let i = 0; i < 4; i++) {
        const slot = document.createElement('div');
        slot.className = `puzzle-slot slot-${i + 1}`;
        slot.dataset.slot = i + 1;
        
        // Añadir número del slot
        const slotNumber = document.createElement('div');
        slotNumber.className = 'slot-number';
        slotNumber.textContent = `Slot ${i + 1}`;
        slot.appendChild(slotNumber);
        
        puzzleBoard.appendChild(slot);
    }
}

// Crear piezas del rompecabezas revueltas
function createPuzzlePieces() {
    puzzlePieces.innerHTML = '';
    
    // Crear contador de piezas
    const counter = document.createElement('div');
    counter.className = 'piece-counter';
    counter.id = 'piece-counter';
    puzzlePieces.appendChild(counter);
    
    // Crear 4 piezas
    for (let i = 0; i < 4; i++) {
        const piece = document.createElement('div');
        piece.className = `puzzle-piece piece-${i + 1}`;
        piece.dataset.piece = i + 1;
        piece.draggable = true;
        
        const img = document.createElement('img');
        img.src = puzzles[currentPuzzle].images[i];
        img.alt = `Pieza ${i + 1} de ${currentPuzzle === 'ram' ? 'memoria RAM' : 'procesador'}`;
        
        piece.appendChild(img);
        puzzlePieces.appendChild(piece);
    }
    
    // Mezclar las piezas
    shufflePieces();
}

// Mezclar las piezas
function shufflePieces() {
    const pieces = Array.from(puzzlePieces.querySelectorAll('.puzzle-piece'));
    
    // Mezclar el array
    for (let i = pieces.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        puzzlePieces.appendChild(pieces[j]);
    }
}

// Actualizar contador de piezas
function updatePieceCounter() {
    const counter = document.getElementById('piece-counter');
    counter.textContent = `Piezas colocadas: ${placedPieces}/4`;
}

// Configurar arrastrar y soltar
function setupDragAndDrop() {
    const pieces = document.querySelectorAll('.puzzle-piece');
    const slots = document.querySelectorAll('.puzzle-slot');
    
    pieces.forEach(piece => {
        piece.addEventListener('dragstart', dragStart);
        piece.addEventListener('dragend', dragEnd);
    });
    
    slots.forEach(slot => {
        slot.addEventListener('dragover', dragOver);
        slot.addEventListener('dragenter', dragEnter);
        slot.addEventListener('dragleave', dragLeave);
        slot.addEventListener('drop', dragDrop);
    });
}

// Funciones de arrastrar y soltar
function dragStart(e) {
    if (!gameStarted || gameCompleted) return;
    e.dataTransfer.setData('text/plain', this.dataset.piece);
    this.classList.add('dragging');
    setTimeout(() => this.style.opacity = '0.6', 0);
}

function dragEnd(e) {
    this.classList.remove('dragging');
    this.style.opacity = '1';
}

function dragOver(e) {
    e.preventDefault();
}

function dragEnter(e) {
    e.preventDefault();
    this.classList.add('hover');
}

function dragLeave() {
    this.classList.remove('hover');
}

function dragDrop(e) {
    e.preventDefault();
    this.classList.remove('hover');
    
    const pieceId = e.dataTransfer.getData('text/plain');
    const piece = document.querySelector(`[data-piece="${pieceId}"]`);
    
    // Verificar si el slot está vacío
    if (this.children.length > 1) { // Ya tiene una pieza (slot-number + pieza)
        this.style.animation = 'shake 0.5s';
        setTimeout(() => {
            this.style.animation = '';
        }, 500);
        return;
    }
    
    // Verificar si la pieza coincide con el slot
    if (this.dataset.slot === pieceId) {
        this.appendChild(piece);
        piece.style.cursor = 'default';
        piece.draggable = false;
        this.classList.add('correct');
        
        // Animación de correcto
        piece.style.animation = 'correct 0.5s';
        
        // Actualizar contador
        placedPieces++;
        updatePieceCounter();
        
        // Verificar si el juego está completo
        checkGameCompletion();
    } else {
        // Efecto de error
        this.style.animation = 'shake 0.5s';
        setTimeout(() => {
            this.style.animation = '';
        }, 500);
    }
}

// Iniciar el juego
function startGame() {
    if (gameStarted) return;
    
    gameStarted = true;
    startBtn.disabled = true;
    startBtn.textContent = 'Juego en curso';
    
    // Iniciar temporizador
    timerInterval = setInterval(updateTimer, 1000);
}

// Actualizar temporizador
function updateTimer() {
    if (timeLeft <= 0) {
        clearInterval(timerInterval);
        timerDisplay.textContent = '00:00';
        alert('¡Se acabó el tiempo! Reinicia el juego para intentarlo de nuevo.');
        return;
    }
    
    timeLeft--;
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    // Cambiar color cuando quede poco tiempo
    if (timeLeft <= 60) {
        timerDisplay.style.color = '#F83AA7';
        timerDisplay.style.animation = 'pulse 1s infinite';
    }
}

// Verificar si el juego está completo
function checkGameCompletion() {
    if (placedPieces === 4) {
        gameCompleted = true;
        clearInterval(timerInterval);
        
        // Calcular tiempo utilizado
        const timeUsed = 300 - timeLeft;
        const minutes = Math.floor(timeUsed / 60);
        const seconds = timeUsed % 60;
        const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // Mostrar mensaje de victoria
        winTime.textContent = `Tiempo: ${timeString}`;
        winMessage.classList.add('active');
        
        // Guardar resultado
        saveResult(timeString, timeUsed);
    }
}

// Guardar resultado
function saveResult(timeString, timeSeconds) {
    const result = {
        time: timeString,
        seconds: timeSeconds,
        date: new Date().toLocaleDateString('es-ES')
    };
    
    results.push(result);
    
    // Ordenar por tiempo (menor a mayor)
    results.sort((a, b) => a.seconds - b.seconds);
    
    // Mantener solo los 5 mejores resultados
    if (results.length > 5) {
        results = results.slice(0, 5);
    }
    
    // Guardar en localStorage
    localStorage.setItem(puzzles[currentPuzzle].storageKey, JSON.stringify(results));
    
    // Actualizar lista de resultados
    updateResultsList();
}

// Actualizar lista de resultados
function updateResultsList() {
    resultsList.innerHTML = '';
    
    if (results.length === 0) {
        resultsList.innerHTML = '<p>No hay resultados guardados aún.</p>';
        return;
    }
    
    results.forEach((result, index) => {
        const resultItem = document.createElement('div');
        resultItem.className = 'result-item';
        resultItem.innerHTML = `
            <span>${index + 1}. ${result.time}</span>
            <span>${result.date}</span>
        `;
        resultsList.appendChild(resultItem);
    });
}

// Reiniciar el juego
function resetGame() {
    clearInterval(timerInterval);
    timeLeft = 300;
    timerDisplay.textContent = '05:00';
    timerDisplay.style.color = '#23C7F1';
    timerDisplay.style.animation = '';
    gameStarted = false;
    gameCompleted = false;
    placedPieces = 0;
    startBtn.disabled = false;
    startBtn.textContent = 'Iniciar Juego';
    
    // Volver a crear tablero y piezas
    createPuzzleBoard();
    createPuzzlePieces();
    updatePieceCounter();
    
    winMessage.classList.remove('active');
}

// Inicializar el juego cuando se carga la página
window.addEventListener('DOMContentLoaded', initGame);