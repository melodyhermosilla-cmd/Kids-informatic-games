const GRID_SIZE = 13;
let grid = [];
let placements = [];
let wordsData = [];
let timerInterval = null;
let seconds = 0;
let foundWords = 0;

async function loadWords() {
    try {
        const response = await fetch('softcrucigrama.json');
        wordsData = await response.json();
    } catch (error) {
        console.error('Error cargando palabras:', error);
        // Usar datos por defecto si hay error
        wordsData = [
            {
                "key": "1",
                "word": "HTML",
                "clue": "Lenguaje de marcado para la estructura web"
            },
            {
                "key": "2",
                "word": "CSS",
                "clue": "Lenguaje para estilos en la web"
            },
            {
                "key": "3",
                "word": "JAVASCRIPT",
                "clue": "Lenguaje de programación para la web (client-side)"
            },
            {
                "key": "4",
                "word": "PUZZLE",
                "clue": "Rompecabezas en inglés"
            },
            {
                "key": "5",
                "word": "ROBOT",
                "clue": "Asistente animado que guía a niños"
            },
            {
                "key": "6",
                "word": "ARRAY",
                "clue": "Estructura para almacenar elementos ordenados"
            },
            {
                "key": "7",
                "word": "FUNCION",
                "clue": "Bloque de código reutilizable (sin tilde)"
            },
            {
                "key": "8",
                "word": "VARIABLE",
                "clue": "Nombre que almacena un valor"
            },
            {
                "key": "9",
                "word": "ALGORITMO",
                "clue": "Conjunto de instrucciones para resolver un problema"
            }
        ];
    }
}

function buildEmptyGrid() {
    grid = Array.from({length: GRID_SIZE}, () => Array(GRID_SIZE).fill(null));
}

function canPlaceWord(word, row, col, direction) {
    if (direction === 'across' && col + word.length > GRID_SIZE) return false;
    if (direction === 'down' && row + word.length > GRID_SIZE) return false;
    
    for (let i = 0; i < word.length; i++) {
        const r = direction === 'across' ? row : row + i;
        const c = direction === 'across' ? col + i : col;
        
        // Verificar límites
        if (r < 0 || r >= GRID_SIZE || c < 0 || c >= GRID_SIZE) return false;
        
        // Verificar si la celda está ocupada por una letra diferente
        if (grid[r][c] !== null && grid[r][c].char !== word[i]) {
            return false;
        }
    }
    return true;
}

function placeWord(wordObj) {
    const word = wordObj.word.toUpperCase();
    const maxAttempts = 100;
    
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        const direction = Math.random() < 0.5 ? 'across' : 'down';
        let row, col;
        
        if (direction === 'across') {
            row = Math.floor(Math.random() * GRID_SIZE);
            col = Math.floor(Math.random() * (GRID_SIZE - word.length));
        } else {
            row = Math.floor(Math.random() * (GRID_SIZE - word.length));
            col = Math.floor(Math.random() * GRID_SIZE);
        }
        
        if (canPlaceWord(word, row, col, direction)) {
            // Colocar la palabra en el grid
            for (let i = 0; i < word.length; i++) {
                const r = direction === 'across' ? row : row + i;
                const c = direction === 'across' ? col + i : col;
                
                grid[r][c] = { 
                    char: word[i], 
                    letterIndex: i, 
                    key: wordObj.key,
                    word: wordObj.word,
                    direction: direction
                };
            }
            
            placements.push({
                key: wordObj.key,
                word: word,
                clue: wordObj.clue,
                row: row,
                col: col,
                dir: direction,
                length: word.length
            });
            
            return true;
        }
    }
    return false;
}

function fillEmptyCells() {
    for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
            if (grid[r][c] === null) {
                // Dejar celdas vacías para el diseño
                grid[r][c] = { char: '', isBlack: true };
            }
        }
    }
}

function renderBoard() {
    const board = document.getElementById('board');
    board.innerHTML = '';
    board.style.gridTemplateColumns = `repeat(${GRID_SIZE}, auto)`;
    
    for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
            const cellData = grid[r][c];
            const cell = document.createElement('div');
            cell.className = 'cell';
            
            if (cellData && cellData.isBlack) {
                cell.classList.add('black');
            } else if (cellData && cellData.char) {
                const input = document.createElement('input');
                input.maxLength = 1;
                input.className = 'cell-input';
                input.dataset.r = r;
                input.dataset.c = c;
                input.dataset.key = cellData.key;
                input.addEventListener('input', onInput);
                input.addEventListener('keydown', onKeyDown);
                input.addEventListener('focus', onCellFocus);
                cell.appendChild(input);

                // Añadir número si es el inicio de una palabra
                const number = getNumberForCell(r, c);
                if (number) {
                    const label = document.createElement('div');
                    label.className = 'cell-label';
                    label.textContent = number;
                    cell.appendChild(label);
                }
            }
            
            board.appendChild(cell);
        }
    }
}

function getNumberForCell(r, c) {
    for (let i = 0; i < placements.length; i++) {
        const p = placements[i];
        if (p.row === r && p.col === c) {
            return i + 1;
        }
    }
    return '';
}

function renderClues() {
    const acrossList = document.getElementById('acrossList');
    const downList = document.getElementById('downList');
    acrossList.innerHTML = '';
    downList.innerHTML = '';
    
    placements.forEach((p, idx) => {
        const li = document.createElement('li');
        li.id = `clue-${p.key}`;
        li.innerHTML = `<strong>${idx + 1}.</strong> ${p.clue} <span class="hint">(${p.length})</span>`;
        
        if (p.dir === 'across') {
            acrossList.appendChild(li);
        } else {
            downList.appendChild(li);
        }
    });
    
    document.getElementById('totalCount').textContent = placements.length;
}

function onInput(e) {
    const input = e.target;
    input.value = input.value.toUpperCase().replace(/[^A-ZÑÁÉÍÓÚÜ]/g, '').slice(0, 1);
    
    // Mover al siguiente input automáticamente
    if (input.value) {
        const r = parseInt(input.dataset.r);
        const c = parseInt(input.dataset.c);
        const next = findNextInput(r, c);
        if (next) next.focus();
    }
    
    checkWordProgress();
}

function onKeyDown(e) {
    const input = e.target;
    const r = parseInt(input.dataset.r);
    const c = parseInt(input.dataset.c);
    
    if (e.key === 'Backspace') {
        if (!input.value) {
            // Si ya está vacío, ir al anterior
            const prev = findPrevInput(r, c);
            if (prev) {
                prev.focus();
                prev.value = '';
            }
        } else {
            input.value = '';
        }
        e.preventDefault();
    } else if (e.key === 'ArrowRight') {
        const next = findNextInput(r, c);
        if (next) next.focus();
        e.preventDefault();
    } else if (e.key === 'ArrowLeft') {
        const prev = findPrevInput(r, c);
        if (prev) prev.focus();
        e.preventDefault();
    } else if (e.key === 'ArrowDown') {
        const down = findNextInputVert(r, c);
        if (down) down.focus();
        e.preventDefault();
    } else if (e.key === 'ArrowUp') {
        const up = findPrevInputVert(r, c);
        if (up) up.focus();
        e.preventDefault();
    }
}

function onCellFocus(e) {
    // Resaltar la palabra completa cuando se enfoca una celda
    const input = e.target;
    const r = parseInt(input.dataset.r);
    const c = parseInt(input.dataset.c);
    
    // Limpiar resaltado anterior
    document.querySelectorAll('.cell').forEach(cell => {
        cell.classList.remove('highlighted');
    });
    
    // Encontrar la palabra a la que pertenece esta celda
    for (const p of placements) {
        for (let i = 0; i < p.length; i++) {
            const wordR = p.dir === 'across' ? p.row : p.row + i;
            const wordC = p.dir === 'across' ? p.col + i : p.col;
            
            if (wordR === r && wordC === c) {
                // Resaltar todas las celdas de esta palabra
                for (let j = 0; j < p.length; j++) {
                    const highlightR = p.dir === 'across' ? p.row : p.row + j;
                    const highlightC = p.dir === 'across' ? p.col + j : p.col;
                    const cell = document.querySelector(`.cell input[data-r="${highlightR}"][data-c="${highlightC}"]`).parentElement;
                    cell.classList.add('highlighted');
                }
                return;
            }
        }
    }
}

function findNextInput(r, c) {
    for (let cc = c + 1; cc < GRID_SIZE; cc++) {
        const el = document.querySelector(`input[data-r="${r}"][data-c="${cc}"]`);
        if (el) return el;
    }
    for (let rr = r + 1; rr < GRID_SIZE; rr++) {
        for (let cc = 0; cc < GRID_SIZE; cc++) {
            const el = document.querySelector(`input[data-r="${rr}"][data-c="${cc}"]`);
            if (el) return el;
        }
    }
    return null;
}

function findPrevInput(r, c) {
    for (let cc = c - 1; cc >= 0; cc--) {
        const el = document.querySelector(`input[data-r="${r}"][data-c="${cc}"]`);
        if (el) return el;
    }
    for (let rr = r - 1; rr >= 0; rr--) {
        for (let cc = GRID_SIZE - 1; cc >= 0; cc--) {
            const el = document.querySelector(`input[data-r="${rr}"][data-c="${cc}"]`);
            if (el) return el;
        }
    }
    return null;
}

function findNextInputVert(r, c) {
    for (let rr = r + 1; rr < GRID_SIZE; rr++) {
        const el = document.querySelector(`input[data-r="${rr}"][data-c="${c}"]`);
        if (el) return el;
    }
    return null;
}

function findPrevInputVert(r, c) {
    for (let rr = r - 1; rr >= 0; rr--) {
        const el = document.querySelector(`input[data-r="${rr}"][data-c="${c}"]`);
        if (el) return el;
    }
    return null;
}

function startTimer() {
    stopTimer();
    seconds = 0;
    updateTimerDisplay();
    timerInterval = setInterval(() => {
        seconds++;
        updateTimerDisplay();
    }, 1000);
}

function stopTimer() {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = null;
}

function updateTimerDisplay() {
    const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
    const ss = String(seconds % 60).padStart(2, '0');
    document.getElementById('timer').textContent = `${mm}:${ss}`;
    document.getElementById('timerDisplay').textContent = `${mm}:${ss}`;
}

function checkWordProgress() {
    let found = 0;
    const total = placements.length;
    
    placements.forEach(p => {
        let correct = true;
        for (let i = 0; i < p.length; i++) {
            const r = p.dir === 'across' ? p.row : p.row + i;
            const c = p.dir === 'across' ? p.col + i : p.col;
            const input = document.querySelector(`input[data-r="${r}"][data-c="${c}"]`);
            
            if (!input || input.value !== p.word[i]) {
                correct = false;
                break;
            }
        }
        
        if (correct) {
            found++;
            // Marcar la pista como encontrada
            const clueElement = document.getElementById(`clue-${p.key}`);
            if (clueElement && !clueElement.classList.contains('found')) {
                clueElement.classList.add('found');
            }
        }
    });
    
    foundWords = found;
    document.getElementById('foundCount').textContent = found;
    const progress = (found / total) * 100;
    document.getElementById('progressFill').style.width = `${progress}%`;
    
    if (found === total) {
        completeGame();
    }
}

function completeGame() {
    stopTimer();
    document.getElementById('finalTime').textContent = document.getElementById('timer').textContent;
    document.getElementById('finalWords').textContent = foundWords;
    document.getElementById('overlay').style.display = 'block';
    document.getElementById('completionMessage').style.display = 'block';
}

function clearBoardInputs() {
    document.querySelectorAll('.cell-input').forEach(input => {
        input.value = '';
        input.parentElement.classList.remove('correct', 'incorrect', 'highlighted');
    });
    document.querySelectorAll('.clues li').forEach(li => {
        li.classList.remove('found');
    });
    foundWords = 0;
    document.getElementById('foundCount').textContent = '0';
    document.getElementById('progressFill').style.width = '0%';
}

function generatePuzzle() {
    buildEmptyGrid();
    placements = [];
    
    // Orden aleatorio de palabras
    const shuffledWords = [...wordsData].sort(() => Math.random() - 0.5);
    
    // Intentar colocar cada palabra
    shuffledWords.forEach(word => {
        placeWord(word);
    });
    
    fillEmptyCells();
    renderBoard();
    renderClues();
    clearBoardInputs();
    startTimer();
}

function checkAnswers() {
    let allCorrect = true;
    
    document.querySelectorAll('.cell-input').forEach(input => {
        const r = parseInt(input.dataset.r);
        const c = parseInt(input.dataset.c);
        const cellData = grid[r][c];
        
        if (cellData && cellData.char) {
            if (input.value === cellData.char) {
                input.parentElement.classList.add('correct');
                input.parentElement.classList.remove('incorrect');
            } else if (input.value) {
                input.parentElement.classList.add('incorrect');
                input.parentElement.classList.remove('correct');
                allCorrect = false;
            } else {
                input.parentElement.classList.remove('correct', 'incorrect');
                allCorrect = false;
            }
        }
    });
    
    checkWordProgress();
    
    if (allCorrect) {
        completeGame();
    }
}

function provideHint() {
    // Encontrar una palabra no completada y revelar una letra
    const incompleteWords = placements.filter(p => {
        for (let i = 0; i < p.length; i++) {
            const r = p.dir === 'across' ? p.row : p.row + i;
            const c = p.dir === 'across' ? p.col + i : p.col;
            const input = document.querySelector(`input[data-r="${r}"][data-c="${c}"]`);
            if (!input || !input.value) return true;
        }
        return false;
    });
    
    if (incompleteWords.length > 0) {
        const randomWord = incompleteWords[Math.floor(Math.random() * incompleteWords.length)];
        const emptyCells = [];
        
        for (let i = 0; i < randomWord.length; i++) {
            const r = randomWord.dir === 'across' ? randomWord.row : randomWord.row + i;
            const c = randomWord.dir === 'across' ? randomWord.col + i : randomWord.col;
            const input = document.querySelector(`input[data-r="${r}"][data-c="${c}"]`);
            if (!input.value) {
                emptyCells.push({input: input, letter: randomWord.word[i]});
            }
        }
        
        if (emptyCells.length > 0) {
            const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            randomCell.input.value = randomCell.letter;
            randomCell.input.focus();
            checkWordProgress();
        }
    }
}

// Inicialización
document.addEventListener('DOMContentLoaded', async function() {
    await loadWords();
    
    document.getElementById('shuffleBtn').addEventListener('click', generatePuzzle);
    document.getElementById('checkBtn').addEventListener('click', checkAnswers);
    document.getElementById('hintBtn').addEventListener('click', provideHint);
    document.getElementById('playAgainBtn').addEventListener('click', function() {
        document.getElementById('overlay').style.display = 'none';
        document.getElementById('completionMessage').style.display = 'none';
        generatePuzzle();
    });

    // Iniciar el juego
    generatePuzzle();
});