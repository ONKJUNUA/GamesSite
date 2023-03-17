const game = document.getElementById("game");
const player = document.getElementById("player");
const enemies = [];
let score = 0;

function spawnEnemy() {
  const enemy = document.createElement("div");
  enemy.classList.add("enemy");
  enemy.style.top = Math.floor(Math.random() * (game.offsetHeight - 20)) + "px";
  enemy.style.left = game.offsetWidth - 20 + "px";
  game.appendChild(enemy);
  enemies.push(enemy);
}

function moveEnemies() {
  enemies.forEach(enemy => {
    enemy.style.left = parseInt(enemy.style.left) - 1 + "px";
    if (isColliding(player, enemy)) {
      endGame();
    }
    if (parseInt(enemy.style.left) + 20 < 0) {
      enemy.remove();
      score++;
    }
  });
}

function isColliding(a, b) {
  const aRect = a.getBoundingClientRect();
  const bRect = b.getBoundingClientRect();
  return !(aRect.right < bRect.left || aRect.left > bRect.right || aRect.bottom < bRect.top || aRect.top > bRect.bottom);
}

function endGame() {
  alert("Game over! Your score: " + score);
  reset();
}

function reset() {
  player.style.top = 0;
  player.style.left = 0;
  enemies.forEach(enemy => enemy.remove());
  enemies.length = 0;
  score = 0;
}

document.addEventListener("keydown", event => {
  if (event.key === "ArrowUp") {
    player.style.top -= 10 + "px";
  }
  if (event.key === "ArrowDown") {
    player.style.top += 10 + "px";
  }
});
setInterval(spawnEnemy, 1000);
setInterval(moveEnemies, 10);
movePlayer();