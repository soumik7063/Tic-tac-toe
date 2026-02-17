let boxes = document.querySelectorAll(".box");
let resetBtn = document.querySelector(".reset-btn");
let newGameBtn = document.querySelector("#new-btn");
let msgContainer = document.querySelector(".msg-container");
let msg = document.querySelector("#msg");
let soloBtn = document.querySelector("#solo-btn");
let multiBtn = document.querySelector("#multi-btn");

let turnO = true;
let count = 0;
let soloMode = false;
let gameActive = true;

const winPatterns = [
  [0, 1, 2],
  [0, 3, 6],
  [0, 4, 8],
  [1, 4, 7],
  [2, 5, 8],
  [2, 4, 6],
  [3, 4, 5],
  [6, 7, 8],
];

soloBtn.addEventListener("click", () => {
  soloMode = true;
  soloBtn.classList.add("active");
  multiBtn.classList.remove("active");
  resetGame();
});

multiBtn.addEventListener("click", () => {
  soloMode = false;
  multiBtn.classList.add("active");
  soloBtn.classList.remove("active");
  resetGame();
});

const resetGame = () => {
  turnO = true;
  count = 0;
  gameActive = true;
  enableBoxes();
  msgContainer.classList.add("hide");
};

boxes.forEach((box) => {
  box.addEventListener("click", () => {
    if (!gameActive || box.innerText !== "") return;

    if (soloMode) {
      box.innerText = "X";
      box.disabled = true;
      count++;

      if (checkWinner() || count === 9) {
        if (count === 9 && !checkWinner()) gameDraw();
        return;
      }

      gameActive = false;
      setTimeout(() => {
        aiMove();
        gameActive = true;
      }, 300);
    } else {
      box.innerText = turnO ? "O" : "X";
      turnO = !turnO;
      box.disabled = true;
      count++;

      let isWinner = checkWinner();
      if (count === 9 && !isWinner) gameDraw();
    }
  });
});

const aiMove = () => {
  let bestMove = findBestMove();
  if (bestMove !== -1) {
    boxes[bestMove].innerText = "O";
    boxes[bestMove].disabled = true;
    count++;

    if (checkWinner()) return;
    if (count === 9) gameDraw();
  }
};

const minimax = (board, depth, isMaximizing) => {
  let winner = checkWinnerForMinimax(board);
  if (winner === "O") return 10 - depth;
  if (winner === "X") return depth - 10;
  if (board.every(cell => cell !== "")) return 0;

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === "") {
        board[i] = "O";
        let score = minimax(board, depth + 1, false);
        board[i] = "";
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === "") {
        board[i] = "X";
        let score = minimax(board, depth + 1, true);
        board[i] = "";
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
};

const findBestMove = () => {
  let board = Array.from(boxes).map(box => box.innerText);
  let bestScore = -Infinity;
  let move = -1;

  for (let i = 0; i < 9; i++) {
    if (board[i] === "") {
      board[i] = "O";
      let score = minimax(board, 0, false);
      board[i] = "";
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  return move;
};

const checkWinnerForMinimax = (board) => {
  for (let pattern of winPatterns) {
    let [a, b, c] = pattern;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
};

const gameDraw = () => {
  msg.innerText = `Game was a Draw.`;
  msgContainer.classList.remove("hide");
  gameActive = false;
  disableBoxes();
};

const disableBoxes = () => {
  for (let box of boxes) {
    box.disabled = true;
  }
};

const enableBoxes = () => {
  for (let box of boxes) {
    box.disabled = false;
    box.innerText = "";
  }
};

const showWinner = (winner) => {
  if (soloMode) {
    msg.innerText = winner === "X" ? "You Win!" : "AI Wins!";
  } else {
    msg.innerText = `Congratulations, Winner is ${winner === "O" ? "Player 1" : "Player 2"}`;
  }
  msgContainer.classList.remove("hide");
  gameActive = false;
  disableBoxes();
};

const checkWinner = () => {
  for (let pattern of winPatterns) {
    let pos1Val = boxes[pattern[0]].innerText;
    let pos2Val = boxes[pattern[1]].innerText;
    let pos3Val = boxes[pattern[2]].innerText;

    if (pos1Val != "" && pos2Val != "" && pos3Val != "") {
      if (pos1Val === pos2Val && pos2Val === pos3Val) {
        showWinner(pos1Val);
        return true;
      }
    }
  }
  return false;
};

newGameBtn.addEventListener("click", resetGame);
resetBtn.addEventListener("click", resetGame);
