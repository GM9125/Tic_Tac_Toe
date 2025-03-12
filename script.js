document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('board');
    const resultDisplay = document.getElementById('result');
    const themeSelector = document.getElementById('theme');
    const colorPicker = document.getElementById('color-picker');
    const popup = document.getElementById('game-result-popup');

    let currentPlayer = 'X';
    let gameBoard = ['', '', '', '', '', '', '', '', ''];
    let gameActive = true;
    let currentTheme = 'default';

    themeSelector.addEventListener('change', (e) => {
        currentTheme = e.target.value;
        document.body.className = `theme-${currentTheme}`;
        colorPicker.style.display = currentTheme === 'custom' ? 'block' : 'none';
        updatePopupStyle(currentTheme);
    });

    colorPicker.addEventListener('input', (e) => {
        const color = e.target.value;
        applyCustomTheme(color);
    });

    function applyCustomTheme(color) {
        board.style.backgroundColor = color;
        if (currentTheme !== 'dark') {
            popup.style.backgroundColor = color;
        }
    }

    function updatePopupStyle(theme) {
        const themeColors = {
            default: '#fff',
            dark: '#333',
            light: '#f0f0f0',
            neon: '#0f0'
        };
        popup.style.backgroundColor = themeColors[theme] || themeColors.default;
    
        // Fix text visibility in dark mode
        popup.style.color = theme === 'dark' ? '#fff' : '#333'; 
        document.getElementById('winner-message').style.color = theme === 'dark' ? '#fff' : '#333';
    }
    
    

    board.addEventListener('click', (e) => {
        const cell = e.target;
        const index = cell.dataset.index;

        if (gameBoard[index] === '' && gameActive && currentPlayer === 'X') {
            gameBoard[index] = 'X';
            updateBoard();
            checkResult();
            if (gameActive) {
                setTimeout(botMove, 500);
            }
        }
    });

    function updateBoard() {
        gameBoard.forEach((value, index) => {
            const cell = document.querySelector(`.cell[data-index="${index}"]`);
            cell.textContent = value;
        });
    }

    function checkResult() {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];

        for (let pattern of winPatterns) {
            const [a, b, c] = pattern;
            if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
                showPopup(`${gameBoard[a]} Wins!`);
                gameActive = false;
                return;
            }
        }

        if (!gameBoard.includes('') && gameActive) {
            showPopup("It's a draw!");
            gameActive = false;
        }
    }

    function botMove() {
        let bestMove = minimax(gameBoard, 'O').index;
        if (bestMove !== undefined) {
            gameBoard[bestMove] = 'O';
            updateBoard();
            checkResult();
        }
    }

    function minimax(newBoard, player) {
        let emptyCells = newBoard.map((v, i) => (v === '' ? i : null)).filter(i => i !== null);

        if (checkWin(newBoard, 'X')) return { score: -10 };
        if (checkWin(newBoard, 'O')) return { score: 10 };
        if (emptyCells.length === 0) return { score: 0 };

        let moves = [];
        for (let i of emptyCells) {
            let move = {};
            move.index = i;
            newBoard[i] = player;

            if (player === 'O') {
                move.score = minimax(newBoard, 'X').score;
            } else {
                move.score = minimax(newBoard, 'O').score;
            }

            newBoard[i] = '';
            moves.push(move);
        }

        return moves.reduce((best, move) => (player === 'O' ? (move.score > best.score ? move : best) : (move.score < best.score ? move : best)), moves[0]);
    }

    function checkWin(board, player) {
        return [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ].some(pattern => pattern.every(i => board[i] === player));
    }

    function showPopup(message) {
        document.getElementById('winner-message').textContent = message;
        popup.style.display = 'flex';
    }

    window.playAgain = function () {
        gameBoard = ['', '', '', '', '', '', '', '', ''];
        currentPlayer = 'X';
        gameActive = true;
        updateBoard();
        popup.style.display = 'none';
    };
});
