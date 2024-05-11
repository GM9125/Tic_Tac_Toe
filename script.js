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
        if (theme !== 'dark') {
            popup.style.backgroundColor = themeColors[theme] || themeColors.default;
        } else {
            popup.style.backgroundColor = '#fff';
        }
    }

    board.addEventListener('click', (e) => {
        const cell = e.target;
        const index = cell.dataset.index;

        if (gameBoard[index] === '' && gameActive) {
            gameBoard[index] = currentPlayer;
            updateBoard();
            checkResult();
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            displayPlayerTurn();
        }
    });

    function updateBoard() {
        gameBoard.forEach((value, index) => {
            const cell = document.querySelector(`.cell[data-index="${index}"]`);
            cell.textContent = value;
        });
    }

    function displayPlayerTurn() {
        if (gameActive) {
            resultDisplay.textContent = `Player ${currentPlayer}'s turn`;
        }
    }

    function checkResult() {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];

        winPatterns.forEach(pattern => {
            const [a, b, c] = pattern;
            if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
                showPopup(`${currentPlayer} Wins!`);
                gameActive = false;
                resultDisplay.textContent = '';
                return;
            }
        });

        if (!gameBoard.includes('') && gameActive) {
            showPopup(`It's a draw!`);
            gameActive = false;
            resultDisplay.textContent = '';
        }
    }

    function showPopup(message) {
        const winnerMessage = document.getElementById('winner-message');
        winnerMessage.textContent = message;
        popup.style.display = 'flex';
    }

    window.playAgain = function () {
        gameBoard = ['', '', '', '', '', '', '', '', ''];
        currentPlayer = 'X';
        gameActive = true;
        resultDisplay.textContent = `Player ${currentPlayer}'s turn`;
        updateBoard();
        hidePopup();
    };

    function hidePopup() {
        popup.style.display = 'none';
    }
});
