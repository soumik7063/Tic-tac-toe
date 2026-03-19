let boxes = document.querySelectorAll(".box");
let newGameBtn = document.querySelector("#new-btn");
let resetScoreBtn = document.querySelector("#reset-score-btn");
let msgContainer = document.querySelector(".msg-container");
let msg = document.querySelector("#msg");
let scoreO = document.querySelector("#score-o");
let scoreX = document.querySelector("#score-x");
let scoreDraw = document.querySelector("#score-draw");

// Player symbol mapping
const players = {
  O: "Player 1",
  X: "Player 2",
};

let turnO = true; //playerX, playerO
let count = 0; //To Track Draw
let scores = {
  O: 0,
  X: 0,
  draw: 0,
};

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

const resetGame = () => {
  turnO = true;
  count = 0;
  enableBoxes();
  msgContainer.classList.add("hide");
};

const updateScoreUI = () => {
  scoreO.innerText = scores.O;
  scoreX.innerText = scores.X;
  scoreDraw.innerText = scores.draw;
};

const resetScoreboard = () => {
  scores.O = 0;
  scores.X = 0;
  scores.draw = 0;
  updateScoreUI();
};

boxes.forEach((box) => {
  box.addEventListener("click", () => {

    box.innerText = turnO ? "O" : "X";
    box.disabled = true;
    count++;

    // Stops exexution if winner is found
    if (checkWinner()) return;

    if (count === 9) {
      gameDraw();
    }
    turnO = !turnO;
  });
});

const gameDraw = () => {
  scores.draw++;
  updateScoreUI();
  msg.innerText = `Game was a Draw.`;
  msgContainer.classList.remove("hide");
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

const showWinner = (symbol) => {
  scores[symbol]++;
  updateScoreUI();

  msg.innerText = `Congratulations, Winner is ${players[symbol]}`;
  msgContainer.classList.remove("hide");

  gameActive = false;
  disableBoxes();
};

const checkWinner = () => {
  for (let pattern of winPatterns) {
    let pos1Val = boxes[pattern[0]].innerText;
    let pos2Val = boxes[pattern[1]].innerText;
    let pos3Val = boxes[pattern[2]].innerText;

    if (pos1Val !== "" && pos1Val === pos2Val && pos2Val === pos3Val) {
      showWinner(pos1Val);
      return true;
    }
  }

  return false;
};

newGameBtn.addEventListener("click", resetGame);
resetScoreBtn.addEventListener("click", resetScoreboard);
updateScoreUI();