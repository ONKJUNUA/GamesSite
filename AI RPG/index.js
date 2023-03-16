// set up canvas and context
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

// set up player object with position and speed
const player = {
  x: 100,
  y: 100,
  speed: 5,
  width: 32,
  height: 32,
  isAlive: true
};

// set up enemy object with position and size
const enemy = {
    x: 400,
    y: 300,
    width: 64,
    height: 64,
    velocityX: 2,
    velocityY: -2
  };

// set up map boundaries
const map = {
  width: 800,
  height: 600
};

// update player position based on user input
function update() {
  if (38 in keysDown) { // up arrow
    player.y -= player.speed;
  }
  if (40 in keysDown) { // down arrow
    player.y += player.speed;
  }
  if (37 in keysDown) { // left arrow
    player.x -= player.speed;
  }
  if (39 in keysDown) { // right arrow
    player.x += player.speed;
  }

  // check if player is out of bounds and adjust position if necessary
  if (player.x < 0) {
    player.x = 0;
  }
  if (player.y < 0) {
    player.y = 0;
  }
  if (player.x + player.width > map.width) {
    player.x = map.width - player.width;
  }
  if (player.y + player.height > map.height) {
    player.y = map.height - player.height;
  }

    // move enemy randomly
    if (Math.random() < 0.02) { // chance to change direction
        enemy.velocityX = Math.random() * 4 - 2;
        enemy.velocityY = Math.random() * 4 - 2;
      }
      enemy.x += enemy.velocityX;
      enemy.y += enemy.velocityY;
    
      // check if enemy is out of bounds and adjust velocity if necessary
      if (enemy.x < 0 || enemy.x + enemy.width > map.width) {
        enemy.velocityX = -enemy.velocityX;
      }
      if (enemy.y < 0 || enemy.y + enemy.height > map.height) {
        enemy.velocityY = -enemy.velocityY;
      }

  // check if player is touching enemy and set isAlive flag to false if true
  if (player.x < enemy.x + enemy.width &&
      player.x + player.width > enemy.x &&
      player.y < enemy.y + enemy.height &&
      player.y + player.height > enemy.y) {
    player.isAlive = false;
  }

  if (!player.isAlive){
    player.x=100;
    player.y=100;
    player.isAlive = true;
    player.speed=0;
}
}
// draw player and enemy on canvas
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
 
  ctx.fillStyle = "#FF0000";
  ctx.fillRect(player.x, player.y, player.width, player.height);  

  ctx.fillStyle = "#00FF00";
  ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
}

// set up key event listeners
const keysDown = {};
addEventListener("keydown", function(e) {
  keysDown[e.keyCode] = true;
});
addEventListener("keyup", function(e) {
  delete keysDown[e.keyCode];
});

// game loop
function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

// start game loop
gameLoop();