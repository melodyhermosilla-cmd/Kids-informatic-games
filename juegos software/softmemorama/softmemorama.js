document.addEventListener('DOMContentLoaded', () => {
    let cardData = []; // Se llenará con el JSON
    let cards = [];
    let flippedCards = [];
    let score = 0;
    let moves = 0;
    let lockBoard = false;

    const gameBoard = document.getElementById('game-board');
    const scoreElement = document.getElementById('score');
    const movesElement = document.getElementById('moves');
    const resetButton = document.getElementById('reset-btn');
    const winMessage = document.getElementById('win-message');
    const finalMoves = document.getElementById('final-moves');
    const playAgainButton = document.getElementById('play-again');

    // 🔹 Cargar JSON con fetch
    async function loadCards() {
        try {
            const response = await fetch("softmemorama.json");
            const data = await response.json();
            cardData = data;
            initializeGame();
        } catch (error) {
            console.error("Error cargando softmemorama.json:", error);
        }
    }

    // 🔹 Inicializar juego con cartas aleatorias
    function initializeGame() {
        cards = [];
        flippedCards = [];
        score = 0;
        moves = 0;
        lockBoard = false;

        scoreElement.textContent = score;
        movesElement.textContent = moves;

        // Tomar 8 cartas aleatorias del JSON
        let selected = cardData
            .sort(() => Math.random() - 0.5)
            .slice(0, 8);

        // Mezclar
        const gameCards = [...selected];
        gameCards.sort(() => Math.random() - 0.5);

        gameBoard.innerHTML = '';

        gameCards.forEach((card, index) => {
            // --- Carta con imagen ---
            const cardElement = document.createElement('div');
            cardElement.classList.add('cyber-card');
            cardElement.dataset.index = index;
            cardElement.dataset.type = 'image';
            cardElement.dataset.match = index + 8;

            let cardContent;
            if (card.image.endsWith(".png") || card.image.endsWith(".jpg") || card.image.endsWith(".webp")) {
                cardContent = `<img src="${card.image}" alt="${card.text}">`;
            } else {
                cardContent = card.image; // emoji o texto
            }

            cardElement.innerHTML = `
                <div class="card-inner">
                    <div class="card-front"></div>
                    <div class="card-back">${cardContent}</div>
                </div>
            `;

            // --- Carta con texto ---
            const textCardElement = document.createElement('div');
            textCardElement.classList.add('cyber-card');
            textCardElement.dataset.index = index + 8;
            textCardElement.dataset.type = 'text';
            textCardElement.dataset.match = index;

            textCardElement.innerHTML = `
                <div class="card-inner">
                    <div class="card-front"></div>
                    <div class="card-back">${card.text}</div>
                </div>
            `;

            cards.push({ element: cardElement, type: 'image', value: card.image, match: index + 8 });
            cards.push({ element: textCardElement, type: 'text', value: card.text, match: index });

            cardElement.addEventListener('click', () => flipCard(cardElement));
            textCardElement.addEventListener('click', () => flipCard(textCardElement));

            gameBoard.appendChild(cardElement);
            gameBoard.appendChild(textCardElement);
        });

        // Mezclar DOM otra vez
        for (let i = gameBoard.children.length; i >= 0; i--) {
            gameBoard.appendChild(gameBoard.children[Math.random() * i | 0]);
        }
    }

    // 🔹 Función para voltear cartas
    function flipCard(card) {
        if (lockBoard) return;
        if (flippedCards.includes(card)) return;

        card.classList.add('flipped');
        flippedCards.push(card);

        if (flippedCards.length === 2) {
            lockBoard = true;
            moves++;
            movesElement.textContent = moves;

            const firstIndex = parseInt(flippedCards[0].dataset.index);
            const secondIndex = parseInt(flippedCards[1].dataset.index);
            const firstMatch = parseInt(flippedCards[0].dataset.match);
            const secondMatch = parseInt(flippedCards[1].dataset.match);

            if (firstIndex === secondMatch && secondIndex === firstMatch) {
                // ✅ Son pareja
                score += 10;
                scoreElement.textContent = score;

                flippedCards[0].style.boxShadow = "0 0 15px #0f0";
                flippedCards[1].style.boxShadow = "0 0 15px #0f0";

                setTimeout(() => {
                    flippedCards[0].style.visibility = 'hidden';
                    flippedCards[1].style.visibility = 'hidden';
                    flippedCards[0].style.boxShadow = "";
                    flippedCards[1].style.boxShadow = "";
                    flippedCards = [];
                    lockBoard = false;
                    checkGameOver();
                }, 500);
            } else {
                // ❌ No son pareja
                flippedCards[0].style.boxShadow = "0 0 15px #f00";
                flippedCards[1].style.boxShadow = "0 0 15px #f00";

                setTimeout(() => {
                    flippedCards[0].classList.remove('flipped');
                    flippedCards[1].classList.remove('flipped');
                    flippedCards[0].style.boxShadow = "";
                    flippedCards[1].style.boxShadow = "";
                    flippedCards = [];
                    lockBoard = false;
                }, 1000);
            }
        }
    }

    // 🔹 Verificar fin de juego
    function checkGameOver() {
        const allCards = document.querySelectorAll('.cyber-card');
        const hiddenCards = document.querySelectorAll('.cyber-card[style*="visibility: hidden"]');

        if (allCards.length === hiddenCards.length) {
            setTimeout(() => {
                finalMoves.textContent = moves;
                winMessage.style.display = 'flex';
            }, 500);
        }
    }

    resetButton.addEventListener('click', initializeGame);
    playAgainButton.addEventListener('click', () => {
        winMessage.style.display = 'none';
        initializeGame();
    });

    // 🚀 Arrancar cargando JSON
    loadCards();
});
