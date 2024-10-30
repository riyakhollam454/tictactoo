const X_CLASS = 'x';
const O_CLASS = 'o';
const WINNING_COMBINATIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

const cells = document.querySelectorAll('[data-cell]');
const board = document.getElementById('board');
const restartButton = document.getElementById('restartButton');
const gameStatus = document.getElementById('gameStatus');
const playComputerBtn = document.getElementById('playComputerBtn');

let circleTurn;
let isComputerPlaying = false;

// Start the game
startGame();

restartButton.addEventListener('click', startGame);
playComputerBtn.addEventListener('click', () => {
    isComputerPlaying = !isComputerPlaying;
    playComputerBtn.textContent = isComputerPlaying ? 'Stop vs Computer' : 'Play vs Computer';
    startGame();
});

function startGame() {
    circleTurn = false;
    cells.forEach(cell => {
        cell.classList.remove(X_CLASS);
        cell.classList.remove(O_CLASS);
        cell.classList.remove('winning-cell'); // Remove winning highlight
        cell.textContent = ''; // Clear the cell content
        cell.removeEventListener('click', handleClick);
        cell.addEventListener('click', handleClick, { once: true });
    });
    setBoardHoverClass();
    gameStatus.textContent = `Player X's turn`;
}

function handleClick(e) {
    const cell = e.target;
    const currentClass = circleTurn ? O_CLASS : X_CLASS;
    placeMark(cell, currentClass);
    if (checkWin(currentClass)) {
        endGame(false, currentClass); // Pass the winner to the endGame function
        highlightWinningCells(currentClass); // Highlight the winning cells
    } else if (isDraw()) {
        endGame(true);
    } else {
        swapTurns();
        if (isComputerPlaying && !circleTurn) {
            computerMove();
        }
    }
}

function placeMark(cell, currentClass) {
    cell.classList.add(currentClass);
    cell.textContent = currentClass === X_CLASS ? 'X' : 'O'; // Add 'X' or 'O' to the cell content
}

function swapTurns() {
    circleTurn = !circleTurn;
    setBoardHoverClass();
    gameStatus.textContent = circleTurn ? "Player O's turn" : "Player X's turn";
}

function setBoardHoverClass() {
    board.classList.remove(X_CLASS);
    board.classList.remove(O_CLASS);
    if (circleTurn) {
        board.classList.add(O_CLASS);
    } else {
        board.classList.add(X_CLASS);
    }
}

function checkWin(currentClass) {
    return WINNING_COMBINATIONS.some(combination => {
        return combination.every(index => {
            return cells[index].classList.contains(currentClass);
        });
    });
}

function highlightWinningCells(currentClass) {
    const winningCombination = WINNING_COMBINATIONS.find(combination => {
        return combination.every(index => cells[index].classList.contains(currentClass));
    });
    
    if (winningCombination) {
        winningCombination.forEach(index => {
            cells[index].classList.add('winning-cell'); // Highlight the winning cells
        });
    }
}

function endGame(draw, winner = null) {
    if (draw) {
        gameStatus.textContent = `Draw!`;
    } else {
        gameStatus.textContent = `${winner.toUpperCase()} wins!`; // Display winner (X or O)
    }
    cells.forEach(cell => cell.removeEventListener('click', handleClick)); // Stop the game
}

function isDraw() {
    return [...cells].every(cell => {
        return cell.classList.contains(X_CLASS) || cell.classList.contains(O_CLASS);
    });
}

// Computer AI Move
function computerMove() {
    const availableCells = [...cells].filter(cell => !cell.classList.contains(X_CLASS) && !cell.classList.contains(O_CLASS));
    const randomCell = availableCells[Math.floor(Math.random() * availableCells.length)];
    setTimeout(() => {
        if (randomCell) {
            randomCell.click();
        }
    }, 500);
}
