// Tic-Tac-Toe Board
let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = false;  // Will be true after selecting a mode
let scoreX = 0;
let scoreO = 0;
let gameMode = ""; // "friends" or "robot"

// Optional sound files (make sure they exist if you use them)
const clickSound = new Audio("sounds/click.mp3");
const winSound = new Audio("sounds/win.mp3");
const drawSound = new Audio("sounds/draw.mp3");

/**
 * Highlight the chosen button and set the mode
 */
function setMode(mode) {
  // Remove "active-mode" from both buttons
  document.getElementById("btnFriends").classList.remove("active-mode");
  document.getElementById("btnRobot").classList.remove("active-mode");

  // Highlight the chosen mode button
  if (mode === "friends") {
    document.getElementById("btnFriends").classList.add("active-mode");
  } else {
    document.getElementById("btnRobot").classList.add("active-mode");
  }

  gameMode = mode;
  resetGame();
  gameActive = true; // Game is active now that a mode is chosen
}

/**
 * Player (or Robot) makes a move at the given index
 */
function makeMove(index) {
  if (!gameActive) return; // If no mode is selected yet, do nothing
  if (board[index] === "") {
    board[index] = currentPlayer;
    document.getElementsByClassName("cell")[index].innerText = currentPlayer;

    // Play click sound (if file exists)
    clickSound.play();

    // Check for winner or draw
    if (checkWinner(board)) {
      updateScore();
      showPopup(`${currentPlayer} Wins!`);
      winSound.play();
      gameActive = false;
      return;
    } else if (board.every(cell => cell !== "")) {
      showPopup("It's a Draw!");
      drawSound.play();
      gameActive = false;
      return;
    } else {
      // Switch turns
      if (gameMode === "friends") {
        currentPlayer = (currentPlayer === "X") ? "O" : "X";
      } else if (gameMode === "robot") {
        // Human is always X and robot is always O.
        if (currentPlayer === "X") {
          // Now it's robot's turn
          currentPlayer = "O";
          // Use the advanced robot move with a short delay
          setTimeout(advancedRobotMove, 500);
        } else {
          // After robot moves, switch back to X
          currentPlayer = "X";
        }
      }
    }
  }
}

/**
 * Advanced Robot (AI) that uses the Minimax algorithm to pick the best move.
 */
function advancedRobotMove() {
  if (!gameActive) return;
  let bestScore = -Infinity;
  let bestMoveIndex = -1;
  
  // Iterate through available moves
  for (let i = 0; i < board.length; i++) {
    if (board[i] === "") {
      board[i] = "O"; // Try this move
      let score = minimax(board, 0, false);
      board[i] = ""; // Undo move
      if (score > bestScore) {
        bestScore = score;
        bestMoveIndex = i;
      }
    }
  }
  // Make the best move found
  if (bestMoveIndex !== -1) {
    makeMove(bestMoveIndex);
  }
}

/**
 * Minimax algorithm: recursively simulate moves to find the best outcome for the robot.
 */
function minimax(newBoard, depth, isMaximizing) {
  let winner = getWinner(newBoard);
  if (winner === "O") return 10 - depth;
  if (winner === "X") return depth - 10;
  if (!newBoard.includes("")) return 0; // Draw
  
  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < newBoard.length; i++) {
      if (newBoard[i] === "") {
        newBoard[i] = "O";
        let score = minimax(newBoard, depth + 1, false);
        newBoard[i] = "";
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < newBoard.length; i++) {
      if (newBoard[i] === "") {
        newBoard[i] = "X";
        let score = minimax(newBoard, depth + 1, true);
        newBoard[i] = "";
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}

/**
 * Determine if there's a winner and return "X", "O", or null if no winner.
 */
function getWinner(boardState) {
  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  for (let pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
      return boardState[a];
    }
  }
  return null;
}

/**
 * A helper function that simply calls getWinner with the current board.
 */
function checkWinner(currentBoard) {
  return getWinner(currentBoard) !== null;
}

/**
 * Update the scoreboard
 */
function updateScore() {
  if (currentPlayer === "X") {
    scoreX++;
    document.getElementById("scoreX").innerText = scoreX;
  } else {
    scoreO++;
    document.getElementById("scoreO").innerText = scoreO;
  }
}

/**
 * Reset the board but keep the scores
 */
function resetGame() {
  board = ["", "", "", "", "", "", "", "", ""];
  gameActive = (gameMode !== ""); // Only active if a mode is chosen
  currentPlayer = "X"; // Human always starts as X
  Array.from(document.getElementsByClassName("cell")).forEach(cell => {
    cell.innerText = "";
  });
  closePopup();
}

/**
 * Reset both the board and the scores
 */
function resetScores() {
  scoreX = 0;
  scoreO = 0;
  document.getElementById("scoreX").innerText = scoreX;
  document.getElementById("scoreO").innerText = scoreO;
  resetGame();
}

/**
 * Show a popup message (winner or draw)
 */
function showPopup(message) {
  document.getElementById("winnerMessage").innerText = message;
  document.getElementById("winnerPopup").style.display = "flex";
}

/**
 * Close the popup
 */
function closePopup() {
  document.getElementById("winnerPopup").style.display = "none";
  resetGame();
}