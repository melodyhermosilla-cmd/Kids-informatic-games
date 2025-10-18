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
let currentPuzzleIndex = 0;

// Información de los rompecabezas
const puzzles = [
    {
        id: 'windows',
        title: 'Rompecabezas de Windows',
        subtitle: 'Arma las piezas para descubrir el sistema operativo más popular del mundo',
        hint: 'Windows es un sistema operativo creado por Microsoft. Es como el "jefe" de la computadora que organiza todo lo que haces: jugar, estudiar, ver videos y más. ¡Es muy colorido y fácil de usar!',
        images: [
            "img/windows_pieza3.png",
            "img/windows_pieza2.png",
            "img/windows_pieza4.png",
            "img/windows_pieza1.png"
        ],
        storageKey: 'windowsPuzzleResults'
    },
    {
        id: 'linux',
        title: 'Rompecabezas de Linux',
        subtitle: 'Arma las piezas para conocer el sistema operativo de código abierto',
        hint: 'Linux es un sistema operativo especial porque es de "código abierto", ¡eso significa que es gratis y cualquiera puede mejorarlo! Es muy seguro y lo usan muchos programadores y servidores en internet.',
        images: [
            "img/linux_pieza4.jpeg",
            "img/linux_pieza2.jpeg",
            "img/linux_pieza3.jpeg",
            "img/linux_pieza1.jpeg"
        ],
        storageKey: 'linuxPuzzleResults'
    },
    {
        id: 'word',
        title: 'Rompecabezas de Microsoft Word',
        subtitle: 'Arma las piezas para aprender sobre el programa para escribir',
        hint: 'Microsoft Word es como un cuaderno mágico en la computadora. Te ayuda a escribir tareas, cartas, cuentos y hasta puedes cambiar el color de las letras y agregar dibujos. ¡Es perfecto para hacer tus trabajos escolares!',
        images: [
            "img/word_pieza3.png",
            "img/word_pieza2.png",
            "img/word_pieza4.png",
            "img/word_pieza1.png"
        ],
        storageKey: 'wordPuzzleResults'
    },
    {
        id: 'excel',
        title: 'Rompecabezas de Microsoft Excel',
        subtitle: 'Arma las piezas para descubrir el programa de tablas y números',
        hint: 'Excel es como un cuaderno con muchas cuadrículas donde puedes organizar números, hacer listas y hasta crear gráficos de colores. ¡Es genial para hacer tablas de tus videojuegos favoritos o calcular tus ahorros!',
        images: [
            "img/excel_pieza3.png",
            "img/excel_pieza1.png",
            "img/excel_pieza4.png",
            "img/excel_pieza2.png"
        ],
        storageKey: 'excelPuzzleResults'
    }
];

// Almacenar resultados en localStorage
let results = JSON.parse(localStorage.getItem(puzzles[currentPuzzleIndex].storageKey)) || [];

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
    const puzzle = puzzles[currentPuzzleIndex];
    puzzleTitle.textContent = puzzle.title;
    puzzleSubtitle.textContent = puzzle.subtitle;
    hintText.textContent = puzzle.hint;
    
    // Actualizar resultados
    results = JSON.parse(localStorage.getItem(puzzle.storageKey)) || [];
    updateResultsList();
    
    // Actualizar texto del botón siguiente
    if (currentPuzzleIndex === puzzles.length - 1) {
        nextBtn.textContent = 'Volver al Inicio';
    } else {
        nextBtn.textContent = 'Siguiente Rompecabezas';
    }
}

// Cambiar al siguiente rompecabezas
function nextPuzzle() {
    // Reiniciar el juego actual
    resetGame();
    
    // Cambiar al siguiente rompecabezas (o volver al inicio)
    currentPuzzleIndex = (currentPuzzleIndex + 1) % puzzles.length;
    
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
        img.src = puzzles[currentPuzzleIndex].images[i];
        img.alt = `Pieza ${i + 1} de ${puzzles[currentPuzzleIndex].title}`;
        
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
    localStorage.setItem(puzzles[currentPuzzleIndex].storageKey, JSON.stringify(results));
    
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