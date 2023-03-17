const board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
const cells = document.querySelectorAll(".cell");

function play(event) {
  const cell = event.target;
  const index = Array.from(cells).indexOf(cell);
  if (board[index] === "") {
    board[index] = currentPlayer;
    cell.textContent = currentPlayer;
    if (checkWin() !== "") {
      alert(currentPlayer + " wins!");
      reset();
    } else if (board.every(cell => cell !== "")) {
      alert("Tie!");
      reset();
    } else {
      currentPlayer = currentPlayer === "X" ? "O" : "X";
    }
  }
}

function checkWin() {
  const winCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6] // diagonals
  ];
  for (const combination of winCombinations) {
    if (board[combination[0]] === board[combination[1]] && board[combination[1]] === board[combination[2]] && board[combination[0]] !== "") {
      return board[combination[0]];
    }
  }
  return "";
}

function reset() {
  for (const cell of cells) {
    cell.textContent = "";
  }
  board.fill("");
  currentPlayer = "X";
}

for (const cell of cells) {
  cell.addEventListener("click", play);
}